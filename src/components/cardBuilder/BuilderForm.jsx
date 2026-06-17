import styles from "./BuilderForm.module.css";
import { useState } from "react";


const BuilderForm = ({ cardData, setCardData }) => {
  const [skill, setSkill] = useState("");

  const handleChange = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSkill = () => {
    if (!skill.trim()) return;

    setCardData({
      ...cardData,
      skills: [...cardData.skills, skill.trim()],
    });

    setSkill("");
  };

  const removeSkill = (indexToRemove) => {
    setCardData({
      ...cardData,
      skills: cardData.skills.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setCardData({
      ...cardData,
      avatar: URL.createObjectURL(file),
    });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>
          Card Builder
        </span>

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
            className={styles.fileInput}
            onChange={handleImageUpload}
          />
        </div>

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
            rows={4}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Skills</label>

          <div className={styles.skillRow}>
            <input
              type="text"
              placeholder="React, Figma, Node..."
              value={skill}
              onChange={(e) =>
                setSkill(e.target.value)
              }
              onKeyDown={handleKey}
            />

            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAddSkill}
            >
              Add →
            </button>
          </div>

          <div className={styles.skillList}>
            {cardData.skills.map(
              (skill, index) => (
                <div
                  key={index}
                  className={styles.skillChip}
                >
                  <span>{skill}</span>

                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() =>
                      removeSkill(index)
                    }
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <div className={styles.inputGroup}>
        <label>GitHub</label>

        <input
          type="text"
          placeholder="https://github.com/username"
          value={cardData.socials.github}
          onChange={(e) =>
            setCardData({
              ...cardData,
              socials: {
                ...cardData.socials,
                github: e.target.value,
              },
            })
          }
        />
      </div>

      <div className={styles.inputGroup}>
        <label>LinkedIn</label>

        <input
          type="text"
          placeholder="https://linkedin.com/in/username"
          value={cardData.socials.linkedin}
          onChange={(e) =>
            setCardData({
              ...cardData,
              socials: {
                ...cardData.socials,
                linkedin: e.target.value,
              },
            })
          }
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Portfolio</label>

        <input
          type="text"
          placeholder="https://yourportfolio.com"
          value={cardData.socials.portfolio}
          onChange={(e) =>
            setCardData({
              ...cardData,
              socials: {
                ...cardData.socials,
                portfolio: e.target.value,
              },
            })
          }
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Theme</label>

        <select
          value={cardData.theme}
          onChange={(e) =>
            setCardData({
              ...cardData,
              theme: e.target.value,
            })
          }
        >
          <option value="dark">Dark</option>
          <option value="purple">Purple</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
      </div>
      <div className={styles.footer}>
        Live preview →
      </div>
    </div>
  );
};

export default BuilderForm;