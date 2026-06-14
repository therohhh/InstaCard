import styles from "./CardPreview.module.css";

const CardPreview = ({ cardData }) => {
  const initial = cardData.name ? cardData.name.charAt(0).toUpperCase() : "?";

  return (
    <div className={styles.card}>
      <div className={styles.tag}>— identity card</div>

      <div className={styles.avatar}>{initial}</div>

      <h2 className={`${styles.name} ${!cardData.name ? styles.namePlaceholder : ""}`}>
        {cardData.name || "Your Name"}
      </h2>

      <p className={`${styles.role} ${!cardData.role ? styles.rolePlaceholder : ""}`}>
        {cardData.role || "Your Role"}
      </p>

      <div className={styles.divider} />

      <p className={`${styles.bio} ${!cardData.bio ? styles.bioPlaceholder : ""}`}>
        {cardData.bio || "Your bio will appear here..."}
      </p>

      <div className={styles.cardFooter}>
        <div className={styles.dot} />
        <div className={styles.dot} />
        <div className={styles.dot} />
      </div>
    </div>
  );
};

export default CardPreview;