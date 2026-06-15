import styles from "./CardPreview.module.css";

const CardPreview = ({ cardData }) => {
  const initial = cardData.name
    ? cardData.name.charAt(0).toUpperCase()
    : "?";

  return (
    <div className={styles.card}>
      <span className={styles.tag}>
        — INSTACARD
      </span>

      {cardData.avatar ? (
        <img
          src={cardData.avatar}
          alt="profile"
          className={styles.avatarImage}
        />
      ) : (
        <div className={styles.avatar}>
          {initial}
        </div>
      )}

      <h2 className={styles.name}>
        {cardData.name || "Your Name"}
      </h2>

      <p className={styles.role}>
        {cardData.role || "Your Role"}
      </p>

      <p className={styles.bio}>
        {cardData.bio ||
          "Your bio will appear here..."}
      </p>

      <div className={styles.skills}>
        {cardData.skills.map((skill, index) => (
          <span key={index}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CardPreview;