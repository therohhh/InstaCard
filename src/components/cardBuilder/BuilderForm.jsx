import styles from "./BuilderForm.module.css";

const BuilderForm = ({ cardData, setCardData }) => {
  const handleChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        {/* <span className={styles.eyebrow}>Card Builder</span> */}
        <h1>
          Design your <em>identity.</em>
        </h1>
        <div className={styles.divider} />
      </div>

      <div className={styles.fields}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Jane Smith"
            value={cardData.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="role">Role</label>
          <input
            id="role"
            type="text"
            name="role"
            placeholder="Frontend Developer"
            value={cardData.role}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="A few words about yourself..."
            value={cardData.bio}
            onChange={handleChange}
            rows={5}
          />
        </div>
      </div>

      <div className={styles.footer}>Live preview →</div>
    </div>
  );
};

export default BuilderForm;