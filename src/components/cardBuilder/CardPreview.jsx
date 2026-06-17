import styles from "./CardPreview.module.css";

const CardPreview = ({ cardData }) => {
  const initial = cardData.name ? cardData.name.charAt(0).toUpperCase() : "?";

  return (
    <div className={styles.card}>

      {/* top: avatar + name / role */}
      <div className={styles.topRow}>
        {cardData.avatar ? (
          <img src={cardData.avatar} alt="profile" className={styles.avatarImage} />
        ) : (
          <div className={styles.avatar}>{initial}</div>
        )}

        <div className={styles.nameBlock}>
          <h2
            className={`${styles.name} ${
              cardData.name ? styles.nameFilled : styles.namePlaceholder
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

    </div>
  );
};

export default CardPreview;