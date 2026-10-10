import styles from "./InstaCard.module.css";

const InstaCard = ({
    card = {},
    avatarImage = null,
    backgroundImage = null,
    onMessage = null,
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

    const handleMessageClick = (event) => {
        event.stopPropagation();

        if (onMessage) {
            onMessage(card);
        }
    };

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
                        <span>{initial}</span>
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
                                    onClick={(event) =>
                                        event.stopPropagation()
                                    }
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
                                    onClick={(event) =>
                                        event.stopPropagation()
                                    }
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
                                    onClick={(event) =>
                                        event.stopPropagation()
                                    }
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
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();

                                if (onMessage) {
    console.log(
        "Calling onMessage for:",
        card.name,
        card._id
    );

    onMessage(card);
} else {
    console.error(
        "onMessage prop is missing!"
    );
}
                            }}
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