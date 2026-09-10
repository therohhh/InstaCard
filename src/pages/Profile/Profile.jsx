import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./Profile.module.css";
import InstaCard from "../../components/card/InstaCard";

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCard = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:5000/api/cards/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message || "Card not found."
                    );
                    return;
                }

                setCard(data.card);
            } catch (error) {
                console.error(
                    "Profile loading error:",
                    error
                );

                setError(
                    "Unable to connect to server."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [id, navigate]);

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <main className={styles.profile}>
                <div className={styles.loading}>
                    LOADING PROFILE
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
                <div className={styles.error}>
                    <span>404</span>

                    <h1>
                        PROFILE NOT FOUND
                    </h1>

                    <button
                        onClick={() =>
                            navigate("/lobby")
                        }
                    >
                        ← BACK TO LOBBY
                    </button>
                </div>
            </main>
        );
    }

    /* =========================================================
       PROFILE
    ========================================================= */

    return (
        <main className={styles.profile}>
            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav className={styles.nav}>
                <button
                    onClick={() =>
                        navigate("/lobby")
                    }
                >
                    ← LOBBY
                </button>

                <span>
                    INSTACARD®
                </span>

                <span>
                    PROFILE / {card._id.slice(-4)}
                </span>
            </nav>

            {/* =================================================
                AMBIENT SCENE
            ================================================= */}

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
                PROFILE CONTENT
            ================================================= */}

            <section className={styles.content}>
                <div className={styles.index}>
                    <span>
                        INSTA
                    </span>

                    <span>
                        CARD
                    </span>

                    <strong>
                        /{card._id.slice(-4)}
                    </strong>
                </div>

                {/* =================================================
                    INSTACARD
                ================================================= */}

                <div className={styles.cardWrapper}>
                    <InstaCard card={card} />
                </div>

                {/* =================================================
                    PROFILE INFORMATION
                ================================================= */}

                <div className={styles.profileInfo}>
                    <div className={styles.bio}>
                        <span>
                            ABOUT
                        </span>

                        <p>
                            {card.bio ||
                                "Building ideas, creating connections and exploring what comes next."}
                        </p>
                    </div>

                    <div
                        className={
                            styles.expertise
                        }
                    >
                        <span>
                            EXPERTISE
                        </span>

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
                                            {skill}
                                        </span>
                                    )
                                )
                            ) : (
                                <span>
                                    GENERAL
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* =================================================
                    SOCIAL LINKS
                ================================================= */}

                {(card.github ||
                    card.linkedin ||
                    card.portfolio) && (
                    <div
                        className={styles.links}
                    >
                        {card.github && (
                            <a
                                href={
                                    card.github
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                GITHUB ↗
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
                                LINKEDIN ↗
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
                                PORTFOLIO ↗
                            </a>
                        )}
                    </div>
                )}
            </section>

            {/* =================================================
                BOTTOM
            ================================================= */}

            <div className={styles.bottom}>
                <span>
                    CONNECTED THROUGH INSTACARD
                </span>

                <button
                    onClick={() =>
                        navigate("/lobby")
                    }
                >
                    BACK TO NETWORK
                    <span>↗</span>
                </button>
            </div>
        </main>
    );
};

export default Profile;