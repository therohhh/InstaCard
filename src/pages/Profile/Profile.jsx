import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";

import styles from "./Profile.module.css";
import InstaCard from "../../components/card/InstaCard";

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const cardRef = useRef(null);

    const [card, setCard] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const [profileResponse, meResponse] =
                    await Promise.all([
                        fetch(
                            `http://localhost:5000/api/cards/${id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        ),
                        fetch(
                            "http://localhost:5000/api/auth/me",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        ),
                    ]);

                const profileData =
                    await profileResponse.json();

                const meData = await meResponse.json();

                if (
                    profileResponse.status === 401 ||
                    meResponse.status === 401
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                    return;
                }

                if (!profileResponse.ok) {
                    setError(
                        profileData.message ||
                            "Card not found."
                    );
                    return;
                }

                setCard(profileData.card);

                if (meResponse.ok) {
                    setCurrentUser(meData.user);
                }
            } catch (err) {
                console.error(
                    "Profile loading error:",
                    err
                );

                setError(
                    "Unable to connect to server."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, navigate]);

    const isOwner = useMemo(() => {
        if (!card || !currentUser) {
            return false;
        }

        const cardUserId =
            typeof card.user === "object"
                ? card.user?._id
                : card.user;

        return (
            String(cardUserId) ===
            String(currentUser._id)
        );
    }, [card, currentUser]);

    const profileUrl = window.location.href;

    const copyProfileLink = async () => {
        try {
            await navigator.clipboard.writeText(
                profileUrl
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error(
                "Copy failed:",
                err
            );
        }
    };

    const downloadCard = async () => {
        if (!cardRef.current || downloading) {
            return;
        }

        try {
            setDownloading(true);

            const canvas = await html2canvas(
                cardRef.current,
                {
                    backgroundColor: "#101010",
                    scale: 2,
                    useCORS: true,
                }
            );

            const link =
                document.createElement("a");

            link.download = `${
                card.name
                    ?.toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "") ||
                "instacard"
            }-instacard.png`;

            link.href =
                canvas.toDataURL("image/png");

            link.click();
        } catch (err) {
            console.error(
                "Card download failed:",
                err
            );
        } finally {
            setDownloading(false);
        }
    };

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <main className={styles.profile}>
                <div className={styles.loadingScreen}>
                    <div className={styles.loadingMark}>
                        IC
                    </div>

                    <div className={styles.loadingText}>
                        <span />
                        LOADING PROFILE
                    </div>
                </div>
            </main>
        );
    }

    /* =========================================================
       ERROR
    ========================================================= */

    if (error || !card) {
        return (
            <main className={styles.profile}>
                <div className={styles.errorScreen}>
                    <span className={styles.errorCode}>
                        404
                    </span>

                    <div>
                        <p>THE CARD DOESN'T EXIST</p>

                        <h1>
                            PROFILE
                            <br />
                            NOT FOUND
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/lobby")
                        }
                    >
                        ← BACK TO NETWORK
                    </button>
                </div>
            </main>
        );
    }

    const cardId =
        card._id?.slice(-4)?.toUpperCase() ||
        "----";

    return (
        <main className={styles.profile}>
            {/* =================================================
                AMBIENT BACKGROUND
            ================================================= */}

            <div
                className={
                    styles.backgroundGrid
                }
            />

            <div
                className={`${styles.backgroundGlow} ${styles.glowOne}`}
            />

            <div
                className={`${styles.backgroundGlow} ${styles.glowTwo}`}
            />

            <div className={styles.scene}>
                <div
                    className={`${styles.ring} ${styles.ringOne}`}
                />

                <div
                    className={`${styles.ring} ${styles.ringTwo}`}
                />

                <div className={styles.orb} />
            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className={styles.nav}>
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() =>
                        navigate("/lobby")
                    }
                >
                    <span>←</span>
                    LOBBY
                </button>

                <div className={styles.logo}>
                    <span className={styles.logoMark}>
                        IC
                    </span>

                    <span>INSTACARD®</span>
                </div>

                <div className={styles.navMeta}>
                    <span>PROFILE</span>
                    <strong>/{cardId}</strong>
                </div>
            </nav>

            {/* =================================================
                HERO
            ================================================= */}

            <section className={styles.hero}>
                <div className={styles.heroTop}>
                    <div className={styles.heroIndex}>
                        <span>01</span>
                        <span>IDENTITY</span>
                    </div>

                    <div className={styles.liveIndicator}>
                        <span />
                        PUBLIC PROFILE
                    </div>
                </div>

                <div className={styles.identity}>
                    <div className={styles.identityNumber}>
                        {cardId}
                    </div>

                    <div className={styles.identityContent}>
                        <p className={styles.role}>
                            {card.role ||
                                "CREATIVE PROFESSIONAL"}
                        </p>

                        <h1>
                            {card.name ||
                                "Your Name"}
                        </h1>

                        <div
                            className={
                                styles.identityLine
                            }
                        >
                            <span />
                            <p>
                                {card.bio ||
                                    "Building ideas, creating connections and exploring what comes next."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =================================================
                CARD SECTION
            ================================================= */}

            <section className={styles.cardSection}>
                <div className={styles.sectionHeader}>
                    <div>
                        <span>02</span>
                        <p>INSTA CARD</p>
                    </div>

                    <span>
                        DIGITAL IDENTITY / {cardId}
                    </span>
                </div>

                <div
                    ref={cardRef}
                    className={styles.cardWrapper}
                >
                    <InstaCard card={card} />
                </div>

                <div className={styles.cardActions}>
                    <button
                        type="button"
                        onClick={downloadCard}
                        disabled={downloading}
                        className={
                            styles.secondaryAction
                        }
                    >
                        {downloading
                            ? "GENERATING..."
                            : "DOWNLOAD CARD"}
                        <span>↓</span>
                    </button>

                    <button
                        type="button"
                        onClick={copyProfileLink}
                        className={
                            styles.primaryAction
                        }
                    >
                        {copied
                            ? "LINK COPIED"
                            : "COPY PROFILE LINK"}
                        <span>
                            {copied ? "✓" : "↗"}
                        </span>
                    </button>

                    {isOwner && (
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/builder")
                            }
                            className={
                                styles.editAction
                            }
                        >
                            EDIT CARD
                            <span>→</span>
                        </button>
                    )}
                </div>
            </section>

            {/* =================================================
                INFORMATION
            ================================================= */}

            <section className={styles.infoSection}>
                <div className={styles.sectionHeader}>
                    <div>
                        <span>03</span>
                        <p>PROFILE DATA</p>
                    </div>

                    <span>
                        ABOUT / EXPERTISE / LINKS
                    </span>
                </div>

                <div className={styles.infoGrid}>
                    {/* ABOUT */}

                    <article
                        className={
                            styles.infoBlock
                        }
                    >
                        <div
                            className={
                                styles.blockLabel
                            }
                        >
                            <span>01</span>
                            ABOUT
                        </div>

                        <p
                            className={
                                styles.aboutText
                            }
                        >
                            {card.bio ||
                                "Building ideas, creating connections and exploring what comes next."}
                        </p>
                    </article>

                    {/* EXPERTISE */}

                    <article
                        className={
                            styles.infoBlock
                        }
                    >
                        <div
                            className={
                                styles.blockLabel
                            }
                        >
                            <span>02</span>
                            EXPERTISE
                        </div>

                        <div
                            className={
                                styles.skills
                            }
                        >
                            {card.skills?.length >
                            0 ? (
                                card.skills.map(
                                    (skill) => (
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
                                )
                            ) : (
                                <span>
                                    GENERAL
                                </span>
                            )}
                        </div>
                    </article>

                    {/* CONNECT */}

                    <article
                        className={
                            styles.infoBlock
                        }
                    >
                        <div
                            className={
                                styles.blockLabel
                            }
                        >
                            <span>03</span>
                            CONNECT
                        </div>

                        <div
                            className={
                                styles.socialLinks
                            }
                        >
                            {card.github && (
                                <a
                                    href={
                                        card.github
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span>
                                        GITHUB
                                    </span>
                                    ↗
                                </a>
                            )}

                            {card.linkedin && (
                                <a
                                    href={
                                        card.linkedin
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span>
                                        LINKEDIN
                                    </span>
                                    ↗
                                </a>
                            )}

                            {card.portfolio && (
                                <a
                                    href={
                                        card.portfolio
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span>
                                        PORTFOLIO
                                    </span>
                                    ↗
                                </a>
                            )}

                            {!card.github &&
                                !card.linkedin &&
                                !card.portfolio && (
                                    <p
                                        className={
                                            styles.noLinks
                                        }
                                    >
                                        NO PUBLIC LINKS
                                        ADDED
                                    </p>
                                )}
                        </div>
                    </article>
                </div>
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className={styles.bottom}>
                <div>
                    <span>
                        INSTACARD®
                    </span>

                    <p>
                        CONNECTED THROUGH
                        DIGITAL IDENTITY
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/lobby")
                    }
                >
                    BACK TO NETWORK
                    <span>↗</span>
                </button>
            </footer>
        </main>
    );
};

export default Profile;