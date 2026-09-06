import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCard = async () => {
            const token = localStorage.getItem("token");

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
                console.error(error);
                setError("Unable to connect to server.");
            } finally {
                setLoading(false);
            }
        };

        fetchCard();
    }, [id]);

    if (loading) {
        return (
            <main className={styles.profile}>
                <div className={styles.loading}>
                    LOADING PROFILE
                </div>
            </main>
        );
    }

    if (error || !card) {
        return (
            <main className={styles.profile}>
                <div className={styles.error}>
                    <span>404</span>
                    <h1>PROFILE NOT FOUND</h1>

                    <button onClick={() => navigate("/lobby")}>
                        ← BACK TO LOBBY
                    </button>
                </div>
            </main>
        );
    }

    const initial =
        card.name?.charAt(0)?.toUpperCase() || "?";

    return (
        <main className={styles.profile}>
            <nav className={styles.nav}>
                <button onClick={() => navigate("/lobby")}>
                    ← LOBBY
                </button>

                <span>INSTACARD®</span>

                <span>PROFILE / {card._id.slice(-4)}</span>
            </nav>

            <div className={styles.scene}>
                <div className={`${styles.ring} ${styles.ringOne}`} />
                <div className={`${styles.ring} ${styles.ringTwo}`} />
                <div className={styles.orb} />
            </div>

            <section className={styles.content}>
                <div className={styles.index}>
                    <span>INSTA</span>
                    <span>CARD</span>
                    <strong>/{card._id.slice(-4)}</strong>
                </div>

                <div className={styles.identity}>
                    <div className={styles.avatar}>
                        {initial}
                    </div>

                    <div className={styles.nameBlock}>
                        <p>
                            {card.role || "CREATOR"}
                        </p>

                        <h1>{card.name}</h1>
                    </div>
                </div>

                <div className={styles.details}>
                    <div className={styles.bio}>
                        <span>ABOUT</span>

                        <p>
                            {card.bio ||
                                "Building ideas, creating connections and exploring what comes next."}
                        </p>
                    </div>

                    <div className={styles.expertise}>
                        <span>EXPERTISE</span>

                        <div className={styles.skills}>
                            {card.skills?.map((skill) => (
                                <span key={skill}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.links}>
                    {card.github && (
                        <a
                            href={card.github}
                            target="_blank"
                            rel="noreferrer"
                        >
                            GITHUB ↗
                        </a>
                    )}

                    {card.linkedin && (
                        <a
                            href={card.linkedin}
                            target="_blank"
                            rel="noreferrer"
                        >
                            LINKEDIN ↗
                        </a>
                    )}

                    {card.portfolio && (
                        <a
                            href={card.portfolio}
                            target="_blank"
                            rel="noreferrer"
                        >
                            PORTFOLIO ↗
                        </a>
                    )}
                </div>
            </section>

            <div className={styles.bottom}>
                <span>CONNECTED THROUGH INSTACARD</span>

                <button>
                    CONNECT <span>↗</span>
                </button>
            </div>
        </main>
    );
};

export default Profile;