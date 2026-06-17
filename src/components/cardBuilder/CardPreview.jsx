import styles from "./CardPreview.module.css";
import githubIcon from "../../assets/github.png";
import linkedinIcon from "../../assets/linkedin.png";

const CardPreview = ({ cardData }) => {
  const initial = cardData.name ? cardData.name.charAt(0).toUpperCase() : "?";

  return (
    <div
      className={`${styles.card} ${styles[cardData.theme]
        }`}
    >


      <div className={styles.topRow}>
        {cardData.avatar ? (
          <img src={cardData.avatar} alt="profile" className={styles.avatarImage} />
        ) : (
          <div className={styles.avatar}>{initial}</div>
        )}

        <div className={styles.nameBlock}>
          <h2
            className={`${styles.name} ${cardData.name ? styles.nameFilled : styles.namePlaceholder
              }`}
          >
            {cardData.name || "Your Name"}
          </h2>
          <p className={`${styles.role} ${cardData.role ? styles.roleFilled : ""}`}>
            {cardData.role || "your role"}
          </p>
        </div>
      </div>

      {/* bio */}
      <p className={`${styles.bio} ${cardData.bio ? styles.bioFilled : ""}`}>
        {cardData.bio || "your bio will appear here..."}
      </p>

      {/* bottom: skills + instacard label */}
      <div className={styles.bottomRow}>
        <div className={styles.skills}>
          {cardData.skills.map((s, i) => (
            <span key={i} className={styles.skillPill}>{s}</span>
          ))}
        </div>
        <span className={styles.tag}>— instacard</span>
      </div>
      <div className={styles.socials}>
        {cardData.socials.github && (
          <a
            href={cardData.socials.github}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={githubIcon}
              alt="GitHub"
              className={styles.socialIcon}
            />
          </a>
        )}

        {cardData.socials.linkedin && (
          <a
            href={cardData.socials.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={linkedinIcon}
              alt="LinkedIn"
              className={styles.socialIcon}
            />
          </a>
        )}

        {cardData.socials.portfolio && (
          <a
            href={cardData.socials.portfolio}
            target="_blank"
            rel="noreferrer"
            className={styles.portfolioLink}
          >
            Portfolio
          </a>
        )}
      </div>
    </div>
  );
};

export default CardPreview;