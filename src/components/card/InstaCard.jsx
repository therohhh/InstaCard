import styles from "./InstaCard.module.css";

const InstaCard = ({
    card = {},
    avatarImage = null,
    backgroundImage = null,
}) => {
    const avatar =
        avatarImage ||
        (card.avatar?.type === "image"
            ? card.avatar.url
            : null);

    const initial =
        card.name?.charAt(0)?.toUpperCase() || "R";

    const skills =
        Array.isArray(card.skills) && card.skills.length > 0
            ? card.skills
            : ["React", "Node.js", "MongoDB"];

    const cardBackground =
        backgroundImage ||
        card.backgroundImage ||
        null;

    return (
        <div
            className={styles.profileCard}
            style={
                cardBackground
                    ? {
                          backgroundImage: `url(${cardBackground})`,
                      }
                    : undefined
            }
        >
            <div className={styles.cardOverlay} />

            <div className={styles.cardInner}>
                {/* PROFILE IMAGE */}
                <div className={styles.cardAvatar}>
                    {avatar ? (
                        <img
                            src={avatar}
                            alt={card.name || "Profile"}
                        />
                    ) : (
                        <span>
                            {initial}
                        </span>
                    )}
                </div>

                {/* MAIN CONTENT */}
                <div className={styles.cardMain}>
                    <div className={styles.identity}>
                        <h2>
                            {card.name || "Your Name"}
                        </h2>

                        <p>
                            {card.role || "Your Role"}
                        </p>

                        <span>
                            {card.bio ||
                                "Your professional bio will appear here."}
                        </span>
                    </div>

                    {/* SKILLS */}
                    <div className={styles.cardSkills}>
                        {skills.map((skill) => (
                            <span key={skill}>
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* FOOTER */}
                    <div className={styles.cardFooter}>
                        <div className={styles.socialLinks}>
                            {card.github ? (
                                <a
                                    href={card.github}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    GitHub
                                </a>
                            ) : (
                                <span>GitHub</span>
                            )}

                            {card.linkedin ? (
                                <a
                                    href={card.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    LinkedIn
                                </a>
                            ) : (
                                <span>LinkedIn</span>
                            )}

                            {card.portfolio ? (
                                <a
                                    href={card.portfolio}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Portfolio
                                </a>
                            ) : (
                                <span>Portfolio</span>
                            )}
                        </div>

                        <button
                            type="button"
                            className={styles.messageButton}
                        >
                            Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstaCard;