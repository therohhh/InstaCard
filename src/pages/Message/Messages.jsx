import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import styles from "./Messages.module.css";

const Messages = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] =
        useState(null);

    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState("");
    const messagesEndRef = useRef(null);
    const [messageText, setMessageText] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const currentUser = useMemo(() => {
        try {
            const storedUser =
                localStorage.getItem("user");

            return storedUser
                ? JSON.parse(storedUser)
                : null;
        } catch {
            return null;
        }
    }, []);

    const currentUserId =
        currentUser?._id || currentUser?.id;

    /* =========================================================
       FETCH CONVERSATIONS
    ========================================================= */

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    "http://localhost:5000/api/conversations",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load conversations"
                    );
                }

                setConversations(
                    Array.isArray(data.conversations)
                        ? data.conversations
                        : []
                );
            } catch (err) {
                console.error(
                    "Fetch conversations error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load conversations."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [navigate]);

    useEffect(() => {
        const incomingConversation =
            location.state?.conversation;

        if (!incomingConversation?._id) {
            return;
        }
        // Navigation state intentionally initializes the selected chat.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedConversation(incomingConversation);

        // Clear navigation state so refresh doesn't
        // repeatedly re-select the conversation.
        window.history.replaceState(
            {},
            document.title
        );
    }, [location.state]);

    /* =========================================================
       FETCH MESSAGES
    ========================================================= */

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedConversation?._id) {
                setMessages([]);
                setMessagesError("");
                return;
            }

            try {
                setMessagesLoading(true);
                setMessagesError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    `http://localhost:5000/api/messages/${selectedConversation._id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load messages"
                    );
                }

                setMessages(
                    Array.isArray(data.messages)
                        ? data.messages
                        : []
                );
            } catch (err) {
                console.error(
                    "Fetch messages error:",
                    err
                );

                setMessagesError(
                    err.message ||
                    "Unable to load messages."
                );

                setMessages([]);
            } finally {
                setMessagesLoading(false);
            }
        };

        fetchMessages();
    }, [selectedConversation, navigate]);

    /* =========================================================
   AUTO-REFRESH MESSAGES
========================================================= */

    useEffect(() => {
        if (!selectedConversation?._id) {
            return;
        }

        const refreshMessages = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await fetch(
                    `http://localhost:5000/api/messages/${selectedConversation._id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to refresh messages"
                    );
                }

                setMessages(
                    Array.isArray(data.messages)
                        ? data.messages
                        : []
                );
            } catch (err) {
                console.error(
                    "Auto-refresh messages error:",
                    err
                );
            }
        };

        const intervalId = setInterval(
            refreshMessages,
            3000
        );

        return () => {
            clearInterval(intervalId);
        };
    }, [selectedConversation]);
    /* =========================================================
       GET OTHER PARTICIPANT
    ========================================================= */

    const getOtherParticipant = (conversation) => {
        if (
            !Array.isArray(
                conversation?.participants
            )
        ) {
            return null;
        }

        return (
            conversation.participants.find(
                (participant) =>
                    String(
                        participant?._id
                    ) !==
                    String(currentUserId)
            ) || null
        );
    };

    /* =========================================================
       SEARCH CONVERSATIONS
    ========================================================= */

    const filteredConversations =
        conversations.filter((conversation) => {
            const person =
                getOtherParticipant(conversation);

            if (!person) {
                return false;
            }

            const query =
                search.trim().toLowerCase();

            if (!query) {
                return true;
            }

            return (
                person.name
                    ?.toLowerCase()
                    .includes(query) ||
                person.email
                    ?.toLowerCase()
                    .includes(query)
            );
        });

    /* =========================================================
       FORMAT TIME
    ========================================================= */

    const formatTime = (date) => {
        if (!date) {
            return "";
        }

        const messageDate = new Date(date);

        if (Number.isNaN(messageDate.getTime())) {
            return "";
        }

        return messageDate.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    /* =========================================================
       SELECT CONVERSATION
    ========================================================= */

    const handleConversationSelect = (
        conversation
    ) => {
        setSelectedConversation(conversation);
        setMessageText("");
        setMessagesError("");
    };

    /* =========================================================
       SEND MESSAGE
    ========================================================= */

    const handleSendMessage = async () => {
        const text = messageText.trim();

        if (
            !text ||
            !selectedConversation?._id ||
            sendingMessage
        ) {
            return;
        }

        try {
            setSendingMessage(true);
            setMessagesError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                `http://localhost:5000/api/messages/${selectedConversation._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        text,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to send message"
                );
            }

            /* Add new message to chat immediately */
            setMessages(
                (previousMessages) => [
                    ...previousMessages,
                    data.data,
                ]
            );

            /* Clear input */
            setMessageText("");

            /* Update conversation preview */
            setConversations(
                (previousConversations) =>
                    previousConversations.map(
                        (conversation) =>
                            conversation._id ===
                                selectedConversation._id
                                ? {
                                    ...conversation,
                                    lastMessage:
                                        data.data.text,
                                    lastMessageAt:
                                        data.data.createdAt,
                                }
                                : conversation
                    )
            );

            /* Update selected conversation */
            setSelectedConversation(
                (previousConversation) =>
                    previousConversation
                        ? {
                            ...previousConversation,
                            lastMessage:
                                data.data.text,
                            lastMessageAt:
                                data.data.createdAt,
                        }
                        : previousConversation
            );
        } catch (err) {
            console.error(
                "Send message error:",
                err
            );

            setMessagesError(
                err.message ||
                "Unable to send message."
            );
        } finally {
            setSendingMessage(false);
        }
    };

    /* =========================================================
       SELECTED PERSON
    ========================================================= */

    const selectedPerson =
        selectedConversation
            ? getOtherParticipant(
                selectedConversation
            )
            : null;

    return (
        <main className={styles.messagesPage}>
            {/* =================================================
                BACKGROUND
            ================================================= */}

            <div className={styles.gridPlane} />
            <div className={styles.glowOrb} />

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className={styles.nav}>
                <button
                    type="button"
                    className={styles.brand}
                    onClick={() =>
                        navigate("/lobby")
                    }
                >
                    <span
                        className={styles.brandDot}
                    />

                    INSTACARD
                </button>

                <div className={styles.navCenter}>
                    DIRECT MESSAGES
                </div>

                <div className={styles.navRight}>
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/lobby")
                        }
                    >
                        LOBBY
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/profile/me")
                        }
                    >
                        PROFILE
                    </button>
                </div>
            </nav>

            {/* =================================================
                MAIN MESSAGING AREA
            ================================================= */}

            <section
                className={styles.messagingShell}
            >
                {/* =================================================
                    CONVERSATION LIST
                ================================================= */}

                <aside
                    className={
                        styles.conversationPanel
                    }
                >
                    <div
                        className={styles.panelHeader}
                    >
                        <div>
                            <span
                                className={
                                    styles.panelEyebrow
                                }
                            >
                                YOUR NETWORK
                            </span>

                            <h1>Messages</h1>
                        </div>

                        <span
                            className={
                                styles.messageCount
                            }
                        >
                            {String(
                                conversations.length
                            ).padStart(2, "0")}
                        </span>
                    </div>

                    <div
                        className={styles.searchBox}
                    >
                        <span>⌕</span>

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="SEARCH CONVERSATIONS"
                        />
                    </div>

                    <div
                        className={
                            styles.conversationList
                        }
                    >
                        {loading ? (
                            <div
                                className={
                                    styles.listEmpty
                                }
                            >
                                <span>...</span>

                                <p>
                                    Loading
                                    conversations...
                                </p>
                            </div>
                        ) : error ? (
                            <div
                                className={
                                    styles.listEmpty
                                }
                            >
                                <span>!</span>

                                <p>{error}</p>
                            </div>
                        ) : filteredConversations.length ===
                            0 ? (
                            <div
                                className={
                                    styles.listEmpty
                                }
                            >
                                <span>—</span>

                                <p>
                                    {search
                                        ? "No conversations match your search."
                                        : "Your conversations will appear here."}
                                </p>
                            </div>
                        ) : (
                            filteredConversations.map(
                                (conversation) => {
                                    const person =
                                        getOtherParticipant(
                                            conversation
                                        );

                                    const isSelected =
                                        selectedConversation?._id ===
                                        conversation._id;

                                    const initial =
                                        person?.name
                                            ?.charAt(
                                                0
                                            )
                                            ?.toUpperCase() ||
                                        "?";

                                    return (
                                        <button
                                            key={
                                                conversation._id
                                            }
                                            type="button"
                                            className={`${styles.conversationItem} ${isSelected
                                                ? styles.activeConversation
                                                : ""
                                                }`}
                                            onClick={() =>
                                                handleConversationSelect(
                                                    conversation
                                                )
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.avatar
                                                }
                                            >
                                                {
                                                    initial
                                                }
                                            </div>

                                            <div
                                                className={
                                                    styles.conversationInfo
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.conversationTop
                                                    }
                                                >
                                                    <h2>
                                                        {
                                                            person?.name
                                                        }
                                                    </h2>

                                                    <span>
                                                        {formatTime(
                                                            conversation.lastMessageAt
                                                        )}
                                                    </span>
                                                </div>

                                                <p>
                                                    {conversation.lastMessage ||
                                                        "Start a conversation..."}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                }
                            )
                        )}
                    </div>
                </aside>

                {/* =================================================
                    CHAT PANEL
                ================================================= */}

                <section
                    className={styles.chatPanel}
                >
                    {!selectedConversation ? (
                        <div
                            className={
                                styles.chatEmpty
                            }
                        >
                            <div
                                className={
                                    styles.emptyNumber
                                }
                            >
                                01
                            </div>

                            <span
                                className={
                                    styles.chatEyebrow
                                }
                            >
                                DIRECT CONNECTION
                            </span>

                            <h2>
                                Select a
                                <br />
                                conversation.
                            </h2>

                            <p>
                                Choose someone from
                                your network to
                                continue the
                                conversation.
                            </p>
                        </div>
                    ) : (
                        <div
                            className={
                                styles.chatPlaceholder
                            }
                        >
                            <div
                                className={
                                    styles.chatHeader
                                }
                            >
                                <div>
                                    <span>
                                        CONVERSATION
                                    </span>

                                    <h2>
                                        {
                                            selectedPerson?.name
                                        }
                                    </h2>
                                </div>

                                <span
                                    className={
                                        styles.onlineDot
                                    }
                                >
                                    ●
                                </span>
                            </div>

                            <div
                                className={
                                    styles.messageArea
                                }
                            >
                                {messagesLoading ? (
                                    <div
                                        className={
                                            styles.listEmpty
                                        }
                                    >
                                        <span>...</span>
                                        <p>
                                            Loading
                                            messages...
                                        </p>
                                    </div>
                                ) : messagesError ? (
                                    <div
                                        className={
                                            styles.listEmpty
                                        }
                                    >
                                        <span>!</span>
                                        <p>
                                            {messagesError}
                                        </p>
                                    </div>
                                ) : messages.length ===
                                    0 ? (
                                    <div
                                        className={
                                            styles.listEmpty
                                        }
                                    >
                                        <span>—</span>

                                        <p>
                                            No messages yet.
                                            Start the
                                            conversation.
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            styles.messagesStack
                                        }
                                    >
                                        {messages.map(
                                            (
                                                message
                                            ) => {
                                                const senderId =
                                                    typeof message.sender ===
                                                        "object"
                                                        ? message
                                                            .sender
                                                            ?._id
                                                        : message.sender;

                                                const isMine =
                                                    String(
                                                        senderId
                                                    ) ===
                                                    String(
                                                        currentUserId
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            message._id
                                                        }
                                                        className={
                                                            isMine
                                                                ? styles.myMessage
                                                                : styles.theirMessage
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                styles.messageBubble
                                                            }
                                                        >
                                                            {
                                                                message.text
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* =================================================
                                MESSAGE COMPOSER
                            ================================================= */}

                            <div
                                className={
                                    styles.messageComposer
                                }
                            >
                                <input
                                    type="text"
                                    placeholder="WRITE A MESSAGE..."
                                    value={messageText}
                                    onChange={(event) =>
                                        setMessageText(
                                            event.target.value
                                        )
                                    }
                                    onKeyDown={(
                                        event
                                    ) => {
                                        if (
                                            event.key ===
                                            "Enter"
                                        ) {
                                            handleSendMessage();
                                        }
                                    }}
                                    disabled={
                                        sendingMessage
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={
                                        handleSendMessage
                                    }
                                    disabled={
                                        sendingMessage ||
                                        !messageText.trim()
                                    }
                                >
                                    {sendingMessage
                                        ? "SENDING..."
                                        : "SEND"}

                                    <span>↗</span>
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer
                className={styles.footer}
            >
                <span>
                    INSTACARD / DIRECT MESSAGING
                </span>

                <span>
                    CONNECT · CREATE · COLLABORATE
                </span>
            </footer>
        </main>
    );
};

export default Messages;