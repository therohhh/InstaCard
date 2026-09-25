import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Lobby.module.css";
import InstaCard from "../../components/card/InstaCard";

const Lobby = () => {
    const navigate = useNavigate();

    const [myCard, setMyCard] = useState(null);
    const [cards, setCards] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [activeSkill, setActiveSkill] = useState("ALL");

    const [hovered, setHovered] = useState(null);
    const [mouse, setMouse] = useState({
        x: 0,
        y: 0,
    });

    /* =========================================================
       LOAD LOBBY DATA
    ========================================================= */

    useEffect(() => {
        const fetchLobbyData = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const [myCardResponse, cardsResponse] =
                    await Promise.all([
                        fetch(
                            "http://localhost:5000/api/cards/me",
                            {
                                headers,
                            }
                        ),
                        fetch(
                            "http://localhost:5000/api/cards",
                            {
                                headers,
                            }
                        ),
                    ]);

                const myCardData =
                    await myCardResponse.json();

                const cardsData =
                    await cardsResponse.json();

                if (myCardResponse.ok) {
                    setMyCard(myCardData.card);
                } else if (
                    myCardResponse.status === 401
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                    return;
                }

                if (cardsResponse.ok) {
                    setCards(cardsData.cards || []);
                } else if (
                    cardsResponse.status === 401
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                    return;
                } else {
                    setError(
                        cardsData.message ||
                            "Unable to load the network."
                    );
                }
            } catch (error) {
                console.error(
                    "Lobby loading error:",
                    error
                );

                setError(
                    "Unable to connect to the InstaCard network."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchLobbyData();
    }, [navigate]);

    /* =========================================================
       MOUSE
    ========================================================= */

    const handleMouseMove = (event) => {
        setMouse({
            x: event.clientX,
            y: event.clientY,
        });
    };

    /* =========================================================
       HELPERS
    ========================================================= */

    const getInitial = (name) =>
        name?.charAt(0)?.toUpperCase() || "?";

    const getAvatarImage = (card) => {
        if (
            card?.avatar &&
            typeof card.avatar === "object" &&
            card.avatar.type === "image" &&
            card.avatar.url
        ) {
            return card.avatar.url;
        }

        return null;
    };

    /* =========================================================
       NETWORK CARDS
    ========================================================= */

    const otherCards = useMemo(() => {
        return cards.filter(
            (card) =>
                !myCard ||
                card._id !== myCard._id
        );
    }, [cards, myCard]);

    /* =========================================================
       AVAILABLE SKILLS
    ========================================================= */

    const availableSkills = useMemo(() => {
        const skillMap = new Map();

        otherCards.forEach((card) => {
            if (!Array.isArray(card.skills)) {
                return;
            }

            card.skills.forEach((skill) => {
                if (
                    typeof skill !== "string" ||
                    !skill.trim()
                ) {
                    return;
                }

                const normalized =
                    skill.trim();

                const key =
                    normalized.toLowerCase();

                if (!skillMap.has(key)) {
                    skillMap.set(
                        key,
                        normalized
                    );
                }
            });
        });

        return Array.from(
            skillMap.values()
        )
            .sort((a, b) =>
                a.localeCompare(b)
            )
            .slice(0, 12);
    }, [otherCards]);

    /* =========================================================
       FILTER NETWORK
    ========================================================= */

    const filteredCards = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return otherCards.filter((card) => {
            const name =
                card.name?.toLowerCase() || "";

            const role =
                card.role?.toLowerCase() || "";

            const skills = Array.isArray(
                card.skills
            )
                ? card.skills
                      .map((skill) =>
                          skill
                              .toLowerCase()
                              .trim()
                      )
                      .join(" ")
                : "";

            const matchesSearch =
                !query ||
                name.includes(query) ||
                role.includes(query) ||
                skills.includes(query);

            const matchesSkill =
                activeSkill === "ALL" ||
                (Array.isArray(card.skills) &&
                    card.skills.some(
                        (skill) =>
                            skill
                                .toLowerCase()
                                .trim() ===
                            activeSkill.toLowerCase()
                        )
                    );

            return (
                matchesSearch &&
                matchesSkill
            );
        });
    }, [
        otherCards,
        search,
        activeSkill,
    ]);

    /* =========================================================
       CLEAR FILTERS
    ========================================================= */

    const clearFilters = () => {
        setSearch("");
        setActiveSkill("ALL");
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <main
            className={styles.lobby}
            onMouseMove={handleMouseMove}
        >
            {/* =====================================================
                AMBIENT 3D
            ===================================================== */}

            <div className={styles.gridPlane} />

            <div className={styles.orbit}>
                <div
                    className={styles.orbitRing}
                />

                <div
                    className={
                        styles.orbitRingInner
                    }
                />

                <div
                    className={styles.orbitDot}
                />
            </div>

            <div className={styles.glowOrb} />

            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <nav className={styles.nav}>
                <div className={styles.brand}>
                    INSTACARD
                    <span>®</span>
                </div>

                <div className={styles.navCenter}>
                    <span>LOBBY</span>
                    <span>NETWORK</span>
                </div>

                <div className={styles.navRight}>
                    <span>
                        {myCard
                            ? myCard.name
                            : "WELCOME"}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/builder"
                            )
                        }
                    >
                        {myCard
                            ? "EDIT CARD"
                            : "BUILD CARD"}

                        <span>↗</span>
                    </button>
                </div>
            </nav>

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className={styles.hero}>
                <div
                    className={
                        styles.heroMeta
                    }
                >
                    <span>01</span>

                    <span>
                        DIGITAL IDENTITY NETWORK
                    </span>

                    <span>2026</span>
                </div>

                <div
                    className={
                        styles.heroTitle
                    }
                >
                    <div>YOUR</div>

                    <div
                        className={
                            styles.titleOutline
                        }
                    >
                        NETWORK
                    </div>

                    <div
                        className={
                            styles.titleBottom
                        }
                    >
                        <span>YOUR</span>
                        <span>SPACE.</span>
                    </div>
                </div>

                <p
                    className={
                        styles.heroDescription
                    }
                >
                    Discover people.
                    <br />
                    Build your identity.
                    <br />
                    Create connections.
                </p>

                <div
                    className={
                        styles.scrollIndicator
                    }
                >
                    <span>SCROLL</span>
                    <span>↓</span>
                </div>
            </section>

            {/* =====================================================
                YOUR CARD
            ===================================================== */}

            <section
                className={
                    styles.myCardSection
                }
            >
                <div
                    className={
                        styles.sectionLabel
                    }
                >
                    <span>02</span>

                    <span>
                        YOUR INSTACARD
                    </span>

                    <strong>
                        {myCard ? "ACTIVE" : "NEW"}
                    </strong>
                </div>

                {loading ? (
                    <div
                        className={
                            styles.loading
                        }
                    >
                        <span>
                            LOADING YOUR IDENTITY
                        </span>

                        <div
                            className={
                                styles.loader
                            }
                        />
                    </div>
                ) : myCard ? (
                    <div
                        className={
                            styles.myCardLayout
                        }
                    >
                        <div
                            className={
                                styles.myCardPreview
                            }
                            onClick={() =>
                                navigate(
                                    `/profile/${myCard._id}`
                                )
                            }
                        >
                            <InstaCard
                                card={myCard}
                            />
                        </div>

                        <div
                            className={
                                styles.myCardInfo
                            }
                        >
                            <span>
                                THIS IS YOUR IDENTITY.
                            </span>

                            <h2>
                                Make it
                                <br />
                                unforgettable.
                            </h2>

                            <p>
                                Your InstaCard is
                                your digital
                                identity. Keep it
                                sharp, current and
                                yours.
                            </p>

                            <div
                                className={
                                    styles.actionGroup
                                }
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/builder"
                                        )
                                    }
                                >
                                    EDIT CARD
                                    <span>↗</span>
                                </button>

                                <button
                                    type="button"
                                    className={
                                        styles.secondaryButton
                                    }
                                    onClick={() =>
                                        navigate(
                                            `/profile/${myCard._id}`
                                        )
                                    }
                                >
                                    VIEW CARD
                                    <span>↗</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        className={
                            styles.createPanel
                        }
                    >
                        <span>
                            NO CARD YET
                        </span>

                        <h2>
                            BUILD YOUR
                            <br />
                            IDENTITY.
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/builder"
                                )
                            }
                        >
                            CREATE INSTACARD
                            <span>↗</span>
                        </button>
                    </div>
                )}
            </section>

            {/* =====================================================
                NETWORK
            ===================================================== */}

            <section
                className={styles.network}
            >
                <div
                    className={
                        styles.sectionLabel
                    }
                >
                    <span>03</span>

                    <span>
                        DISCOVER THE NETWORK
                    </span>

                    <strong>
                        {String(
                            otherCards.length
                        ).padStart(2, "0")}
                    </strong>
                </div>

                <div
                    className={
                        styles.networkIntro
                    }
                >
                    <h2>
                        PEOPLE
                        <br />
                        <span>BEHIND</span>
                        <br />
                        THE CARDS.
                    </h2>

                    <p>
                        Explore digital
                        identities created by
                        people across the
                        network.
                    </p>
                </div>

                {/* =================================================
                    SEARCH + FILTER
                ================================================= */}

                {!loading &&
                    otherCards.length > 0 && (
                        <div
                            className={
                                styles.discoveryTools
                            }
                        >
                            <div
                                className={
                                    styles.searchBox
                                }
                            >
                                <span
                                    className={
                                        styles.searchIcon
                                    }
                                >
                                    /
                                </span>

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="SEARCH NAME, ROLE OR SKILL..."
                                    aria-label="Search people by name, role or skill"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        className={
                                            styles.clearSearch
                                        }
                                        onClick={() =>
                                            setSearch(
                                                ""
                                            )
                                        }
                                        aria-label="Clear search"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>

                            <div
                                className={
                                    styles.filterBar
                                }
                            >
                                <button
                                    type="button"
                                    className={`${styles.filterButton} ${
                                        activeSkill ===
                                        "ALL"
                                            ? styles.filterActive
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setActiveSkill(
                                            "ALL"
                                        )
                                    }
                                >
                                    ALL
                                </button>

                                {availableSkills.map(
                                    (skill) => (
                                        <button
                                            type="button"
                                            key={skill}
                                            className={`${styles.filterButton} ${
                                                activeSkill.toLowerCase() ===
                                                skill.toLowerCase()
                                                    ? styles.filterActive
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setActiveSkill(
                                                    skill
                                                )
                                            }
                                        >
                                            {skill}
                                        </button>
                                    )
                                )}
                            </div>

                            <div
                                className={
                                    styles.resultsMeta
                                }
                            >
                                <span>
                                    {filteredCards.length ===
                                    1
                                        ? "01 PERSON FOUND"
                                        : `${String(
                                              filteredCards.length
                                          ).padStart(
                                              2,
                                              "0"
                                          )} PEOPLE FOUND`}
                                </span>

                                <span>
                                    {activeSkill !==
                                    "ALL"
                                        ? `SKILL / ${activeSkill.toUpperCase()}`
                                        : search
                                        ? `SEARCH / ${search.toUpperCase()}`
                                        : "FILTER / ALL"}
                                </span>

                                {(search ||
                                    activeSkill !==
                                        "ALL") && (
                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                    >
                                        CLEAR FILTERS
                                        <span>×</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                {/* =================================================
                    NETWORK STATES
                ================================================= */}

                {loading ? (
                    <div
                        className={
                            styles.loading
                        }
                    >
                        <span>
                            LOADING NETWORK
                        </span>

                        <div
                            className={
                                styles.loader
                            }
                        />
                    </div>
                ) : error ? (
                    <div
                        className={
                            styles.empty
                        }
                    >
                        <span>ERROR / 500</span>

                        <h3>
                            NETWORK
                            <br />
                            UNAVAILABLE.
                        </h3>

                        <p>{error}</p>
                    </div>
                ) : otherCards.length === 0 ? (
                    <div
                        className={
                            styles.empty
                        }
                    >
                        <span>00</span>

                        <h3>
                            YOU ARE EARLY.
                            <br />
                            THAT'S GOOD.
                        </h3>

                        <p>
                            Create your card and
                            become the first
                            connection.
                        </p>
                    </div>
                ) : filteredCards.length ===
                  0 ? (
                    <div
                        className={
                            styles.empty
                        }
                    >
                        <span>00 / NO MATCH</span>

                        <h3>
                            NOTHING
                            <br />
                            FOUND.
                        </h3>

                        <p>
                            Try another name,
                            role or skill.
                        </p>

                        <button
                            type="button"
                            className={
                                styles.emptyButton
                            }
                            onClick={
                                clearFilters
                            }
                        >
                            RESET SEARCH
                            <span>↗</span>
                        </button>
                    </div>
                ) : (
                    <div
                        className={
                            styles.cardGrid
                        }
                    >
                        {filteredCards.map(
                            (card, index) => (
                                <article
                                    key={card._id}
                                    className={
                                        styles.networkCard
                                    }
                                    onMouseEnter={() =>
                                        setHovered(
                                            card._id
                                        )
                                    }
                                    onMouseLeave={() =>
                                        setHovered(
                                            null
                                        )
                                    }
                                    onClick={() =>
                                        navigate(
                                            `/profile/${card._id}`
                                        )
                                    }
                                >
                                    <div
                                        className={
                                            styles.cardIndex
                                        }
                                    >
                                        <span>
                                            {String(
                                                index +
                                                    1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                        <span>
                                            {card.role ||
                                                "CREATOR"}
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            styles.cardPreview
                                        }
                                    >
                                        <InstaCard
                                            card={
                                                card
                                            }
                                        />
                                    </div>

                                    <div
                                        className={
                                            styles.networkCardMeta
                                        }
                                    >
                                        <div>
                                            <strong>
                                                {
                                                    card.name
                                                }
                                            </strong>

                                            <span>
                                                {card.role ||
                                                    "DIGITAL CREATOR"}
                                            </span>
                                        </div>

                                        <span
                                            className={
                                                styles.cardArrow
                                            }
                                        >
                                            ↗
                                        </span>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}
            </section>

            {/* =====================================================
                CURSOR PREVIEW
            ===================================================== */}

            {hovered && (
                <div
                    className={
                        styles.cursorPreview
                    }
                    style={{
                        left: mouse.x + 25,
                        top: mouse.y + 25,
                    }}
                >
                    {(() => {
                        const card =
                            filteredCards.find(
                                (item) =>
                                    item._id ===
                                    hovered
                            );

                        if (!card) {
                            return null;
                        }

                        const avatar =
                            getAvatarImage(
                                card
                            );

                        return (
                            <>
                                <div
                                    className={
                                        styles.previewTop
                                    }
                                >
                                    <span>
                                        INSTANT
                                    </span>

                                    <span>
                                        #
                                        {String(
                                            filteredCards.indexOf(
                                                card
                                            ) + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </span>
                                </div>

                                <div
                                    className={
                                        styles.previewAvatar
                                    }
                                >
                                    {avatar ? (
                                        <img
                                            src={
                                                avatar
                                            }
                                            alt={
                                                card.name
                                            }
                                        />
                                    ) : (
                                        <span>
                                            {getInitial(
                                                card.name
                                            )}
                                        </span>
                                    )}
                                </div>

                                <h3>
                                    {card.name}
                                </h3>

                                <p>
                                    {card.role ||
                                        "DIGITAL CREATOR"}
                                </p>

                                <div
                                    className={
                                        styles.previewLine
                                    }
                                />

                                <div
                                    className={
                                        styles.previewSkills
                                    }
                                >
                                    {card.skills
                                        ?.slice(
                                            0,
                                            4
                                        )
                                        .map(
                                            (
                                                skill
                                            ) => (
                                                <span
                                                    key={
                                                        skill
                                                    }
                                                >
                                                    {
                                                        skill
                                                    }
                                                </span>
                                            )
                                        )}
                                </div>

                                <div
                                    className={
                                        styles.previewFooter
                                    }
                                >
                                    VIEW PROFILE ↗
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer
                className={styles.footer}
            >
                <span>
                    INSTACARD®
                </span>

                <span>
                    CONNECT / CREATE / DISCOVER
                </span>

                <span>
                    {myCard
                        ? "YOUR NETWORK AWAITS"
                        : "CREATE YOUR IDENTITY"}
                </span>
            </footer>
        </main>
    );
};

export default Lobby;