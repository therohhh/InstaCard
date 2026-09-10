import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Lobby.module.css";

const Lobby = () => {
    const navigate = useNavigate();

    const [myCard, setMyCard] = useState(null);
    const [cards, setCards] = useState([]);

    const [loading, setLoading] = useState(true);
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

                const [
                    myCardResponse,
                    cardsResponse,
                ] = await Promise.all([
                    fetch(
                        "http://localhost:5000/api/cards/me",
                        { headers }
                    ),

                    fetch(
                        "http://localhost:5000/api/cards",
                        { headers }
                    ),
                ]);

                const myCardData =
                    await myCardResponse.json();

                const cardsData =
                    await cardsResponse.json();

                console.log(
                    "MY CARD:",
                    myCardData
                );

                console.log(
                    "NETWORK CARDS:",
                    cardsData
                );

                if (myCardResponse.ok) {
                    setMyCard(
                        myCardData.card
                    );
                } else if (
                    myCardResponse.status === 401
                ) {
                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    navigate("/login");

                    return;
                }

                if (cardsResponse.ok) {
                    setCards(
                        cardsData.cards || []
                    );
                }
            } catch (error) {
                console.error(
                    "Lobby loading error:",
                    error
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

    const handleMouseMove = (e) => {
        setMouse({
            x: e.clientX,
            y: e.clientY,
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

    const otherCards = cards.filter(
        (card) =>
            !myCard ||
            card._id !== myCard._id
    );

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

                    <span>
                        LOBBY
                    </span>

                    <span>
                        NETWORK
                    </span>

                </div>


                <div className={styles.navRight}>

                    <span>
                        {myCard
                            ? myCard.name
                            : "WELCOME"}
                    </span>


                    <button
                        onClick={() =>
                            navigate(
                                "/builder"
                            )
                        }
                    >
                        {myCard
                            ? "EDIT CARD"
                            : "BUILD CARD"}

                        <span>
                            ↗
                        </span>
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

                    <span>
                        2026
                    </span>
                </div>


                <div
                    className={
                        styles.heroTitle
                    }
                >

                    <div>
                        YOUR
                    </div>


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
                        <span>
                            YOUR
                        </span>

                        <span>
                            SPACE.
                        </span>
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
                    <span>
                        SCROLL
                    </span>

                    <span>
                        ↓
                    </span>
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
                    <span>
                        02
                    </span>

                    <span>
                        YOUR INSTACARD
                    </span>
                </div>


                {loading ? (

                    <div
                        className={
                            styles.loading
                        }
                    >
                        LOADING YOUR IDENTITY
                    </div>

                ) : myCard ? (

                    <div
                        className={
                            styles.myCardLayout
                        }
                    >

                        {/* =========================================
                            CARD
                        ========================================= */}

                        <div
                            className={
                                styles.identityCard
                            }
                            onClick={() =>
                                navigate(
                                    `/profile/${myCard._id}`
                                )
                            }
                            style={
                                getCardBackground(
                                    myCard
                                )
                                    ? {
                                          backgroundImage:
                                              `url(${getCardBackground(
                                                  myCard
                                              )})`,
                                      }
                                    : undefined
                            }
                        >

                            <div
                                className={
                                    styles.cardNoise
                                }
                            />


                            <div
                                className={
                                    styles.cardOverlay
                                }
                            />


                            <div
                                className={
                                    styles.cardTop
                                }
                            >

                                <span>
                                    INSTACARD®
                                </span>

                                <span>
                                    {myCard.status
                                        ?.toUpperCase()}
                                </span>

                            </div>


                            {/* =====================================
                                AVATAR
                            ===================================== */}

                            <div
                                className={
                                    styles.cardAvatar
                                }
                            >

                                {getAvatarImage(
                                    myCard
                                ) ? (

                                    <img
                                        src={getAvatarImage(
                                            myCard
                                        )}
                                        alt={
                                            myCard.name
                                        }
                                    />

                                ) : (

                                    <span>
                                        {getInitial(
                                            myCard.name
                                        )}
                                    </span>

                                )}

                            </div>


                            <div
                                className={
                                    styles.cardIdentity
                                }
                            >

                                <small>
                                    {myCard.role ||
                                        "CREATOR"}
                                </small>

                                <h2>
                                    {myCard.name}
                                </h2>

                                {myCard.bio && (
                                    <p>
                                        {myCard.bio}
                                    </p>
                                )}

                            </div>


                            <div
                                className={
                                    styles.cardBottom
                                }
                            >

                                <span>
                                    {myCard.skills
                                        ?.slice(
                                            0,
                                            3
                                        )
                                        .join(
                                            " / "
                                        )}
                                </span>

                                <span>
                                    ↗
                                </span>

                            </div>

                        </div>


                        {/* =========================================
                            INFO
                        ========================================= */}

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
                                Your InstaCard is your
                                digital identity.
                                Keep it sharp,
                                current and yours.
                            </p>


                            <div
                                className={
                                    styles.actionGroup
                                }
                            >

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/builder"
                                        )
                                    }
                                >
                                    EDIT CARD
                                    <span>
                                        ↗
                                    </span>
                                </button>


                                <button
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
                                    <span>
                                        ↗
                                    </span>
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
                            onClick={() =>
                                navigate(
                                    "/builder"
                                )
                            }
                        >
                            CREATE INSTACARD

                            <span>
                                ↗
                            </span>
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

                    <span>
                        03
                    </span>

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
                        <span>
                            BEHIND
                        </span>
                        <br />
                        THE CARDS.
                    </h2>


                    <p>
                        Explore digital identities
                        created by people across
                        the network.
                    </p>

                </div>


                {loading ? (

                    <div
                        className={
                            styles.loading
                        }
                    >
                        LOADING NETWORK
                    </div>

                ) : otherCards.length === 0 ? (

                    <div
                        className={
                            styles.empty
                        }
                    >

                        <span>
                            00
                        </span>

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

                ) : (

                    <div
                        className={
                            styles.people
                        }
                    >

                        <div
                            className={
                                styles.sectionHeader
                            }
                        >
                            <span>
                                INDEX
                            </span>

                            <span>
                                PROFILE
                            </span>

                            <span>
                                EXPERTISE
                            </span>

                            <span />
                        </div>


                        {otherCards.map(
                            (
                                card,
                                index
                            ) => (

                                <div
                                    key={
                                        card._id
                                    }
                                    className={`${styles.profileRow} ${
                                        hovered ===
                                        card._id
                                            ? styles.active
                                            : ""
                                    }`}
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
                                            styles.index
                                        }
                                    >
                                        {String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </div>


                                    {/* NETWORK AVATAR */}

                                    <div
                                        className={
                                            styles.profileName
                                        }
                                    >

                                        <div
                                            className={
                                                styles.networkAvatar
                                            }
                                        >

                                            {getAvatarImage(
                                                card
                                            ) ? (

                                                <img
                                                    src={getAvatarImage(
                                                        card
                                                    )}
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


                                        <div>

                                            <span>
                                                {
                                                    card.name
                                                }
                                            </span>

                                            <small>
                                                {card.role ||
                                                    "CREATOR"}
                                            </small>

                                        </div>

                                    </div>


                                    <div
                                        className={
                                            styles.skills
                                        }
                                    >

                                        {card.skills
                                            ?.slice(
                                                0,
                                                3
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
                                            styles.arrow
                                        }
                                    >
                                        ↗
                                    </div>

                                </div>

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
                        left:
                            mouse.x + 25,
                        top:
                            mouse.y + 25,
                    }}
                >

                    {(() => {

                        const card =
                            otherCards.find(
                                (item) =>
                                    item._id ===
                                    hovered
                            );

                        if (!card) {
                            return null;
                        }

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
                                            otherCards.indexOf(
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

                                    {getAvatarImage(
                                        card
                                    ) ? (

                                        <img
                                            src={getAvatarImage(
                                                card
                                            )}
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