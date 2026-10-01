import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Messages.module.css";

const Messages = () => {
    const navigate = useNavigate();

    const [selectedConversation, setSelectedConversation] =
        useState(null);

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
                    onClick={() => navigate("/lobby")}
                >
                    <span className={styles.brandDot} />
                    INSTACARD
                </button>

                <div className={styles.navCenter}>
                    DIRECT MESSAGES
                </div>

                <div className={styles.navRight}>
                    <button
                        type="button"
                        onClick={() => navigate("/lobby")}
                    >
                        LOBBY
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/profile/me")}
                    >
                        PROFILE
                    </button>
                </div>
            </nav>

            {/* =================================================
                MAIN MESSAGING AREA
            ================================================= */}

            <section className={styles.messagingShell}>

                {/* =================================================
                    CONVERSATION LIST
                ================================================= */}

                <aside className={styles.conversationPanel}>

                    <div className={styles.panelHeader}>
                        <div>
                            <span className={styles.panelEyebrow}>
                                YOUR NETWORK
                            </span>

                            <h1>Messages</h1>
                        </div>

                        <span className={styles.messageCount}>
                            00
                        </span>
                    </div>

                    <div className={styles.searchBox}>
                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="SEARCH CONVERSATIONS"
                        />
                    </div>

                    <div className={styles.conversationList}>

                        {/* Placeholder conversation */}

                        <button
                            type="button"
                            className={`${styles.conversationItem} ${
                                selectedConversation === "demo"
                                    ? styles.activeConversation
                                    : ""
                            }`}
                            onClick={() =>
                                setSelectedConversation("demo")
                            }
                        >
                            <div className={styles.avatar}>
                                X
                            </div>

                            <div className={styles.conversationInfo}>
                                <div className={styles.conversationTop}>
                                    <h2>x2</h2>

                                    <span>NOW</span>
                                </div>

                                <p>
                                    Start a conversation...
                                </p>
                            </div>
                        </button>

                        {/* Empty state */}

                        <div className={styles.listEmpty}>
                            <span>—</span>

                            <p>
                                Your conversations
                                will appear here.
                            </p>
                        </div>

                    </div>
                </aside>

                {/* =================================================
                    CHAT PANEL
                ================================================= */}

                <section className={styles.chatPanel}>

                    {!selectedConversation ? (
                        <div className={styles.chatEmpty}>

                            <div className={styles.emptyNumber}>
                                01
                            </div>

                            <span className={styles.chatEyebrow}>
                                DIRECT CONNECTION
                            </span>

                            <h2>
                                Select a
                                <br />
                                conversation.
                            </h2>

                            <p>
                                Choose someone from your
                                network to continue the
                                conversation.
                            </p>

                        </div>
                    ) : (
                        <div className={styles.chatPlaceholder}>

                            <div className={styles.chatHeader}>
                                <div>
                                    <span>
                                        CONVERSATION
                                    </span>

                                    <h2>x2</h2>
                                </div>

                                <span className={styles.onlineDot}>
                                    ●
                                </span>
                            </div>

                            <div className={styles.messageArea}>
                                <div className={styles.messageBubble}>
                                    Your messages will appear
                                    here.
                                </div>
                            </div>

                            <div className={styles.messageComposer}>
                                <input
                                    type="text"
                                    placeholder="WRITE A MESSAGE..."
                                />

                                <button type="button">
                                    SEND
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

            <footer className={styles.footer}>
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