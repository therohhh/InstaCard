import styles from "./BuilderForm.module.css";
import { useState } from "react";
const BuilderForm = ({ cardData, setCardData }) => {
  const handleChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };
  const [skill, setSkill] = useState("");
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
          <label>Profile Photo</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];

              if (!file) return;

              setCardData({
                ...cardData,
                avatar: URL.createObjectURL(file),
              });
            }}
          />
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
        <input
          type="text"
          placeholder="Add Skill"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
      </div>
      <button
        onClick={() => {
          if (!skill.trim()) return;

          setCardData({
            ...cardData,
            skills: [...cardData.skills, skill],
          });

          setSkill("");
        }}
      >
        Add Skill
      </button>
      <div className={styles.footer}>Live preview →</div>
    </div>
  );
};

export default BuilderForm;