import { useRef, useState } from "react";
import styles from "./Builder.module.css";
import html2canvas from "html2canvas";


const avatars = [
    { id: 1, label: "R", color: "#1f2937" },
    { id: 2, label: "A", color: "#334155" },
    { id: 3, label: "S", color: "#475569" },
    { id: 4, label: "M", color: "#374151" },
    { id: 5, label: "J", color: "#52525b" },
    { id: 6, label: "K", color: "#3f3f46" },
];

const Builder = () => {
    const fileInputRef = useRef(null);
    const cardRef = useRef(null);

    const [card, setCard] = useState({
        name: "",
        role: "",
        bio: "",
        skills: [],
        github: "",
        linkedin: "",
        portfolio: "",
    });

    const [skillInput, setSkillInput] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
    const [backgroundImage, setBackgroundImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCard((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addSkill = () => {
        const skill = skillInput.trim();

        if (!skill) return;

        if (card.skills.includes(skill)) {
            setSkillInput("");
            return;
        }

        setCard((prev) => ({
            ...prev,
            skills: [...prev.skills, skill],
        }));

        setSkillInput("");
    };

    const removeSkill = (skillToRemove) => {
        setCard((prev) => ({
            ...prev,
            skills: prev.skills.filter(
                (skill) => skill !== skillToRemove
            ),
        }));
    };

    const handleBackgroundUpload = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setBackgroundImage(imageUrl);
    };

    const downloadCard = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: null,
            });

            const image = canvas.toDataURL("image/jpeg", 0.95);

            const link = document.createElement("a");

            link.href = image;
            link.download = "instacard.jpg";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        } catch (error) {
            console.error("Card download failed:", error);

            alert("Unable to download the card. Please try again.");
        }
    };

    const saveAndPushToLobby = () => {
        const cardData = {
            ...card,

            avatar: selectedAvatar,

            backgroundImage,

            createdAt: new Date().toISOString(),

            status: "published",
        };

        localStorage.setItem(
            "instacard",
            JSON.stringify(cardData)
        );

        alert("Your InstaCard has been saved!");
    };
    return (
        <div className={styles.builderPage}>
            {/* HEADER */}
            <header className={styles.header}>
                <div>
                    <p className={styles.eyebrow}>INSTACARD</p>

                    <h1>Create your card</h1>

                    <p className={styles.subtitle}>
                        Build your professional identity and share it with
                        the world.
                    </p>
                </div>
            </header>

            <main className={styles.builderContainer}>
                {/* =========================================
            LEFT SIDE — FORM
        ========================================= */}

                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Card Details</h2>

                        <span>Live Preview</span>
                    </div>

                    <div className={styles.form}>
                        {/* AVATAR */}
                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <label>Choose your avatar</label>

                                <span>Select one</span>
                            </div>

                            <div className={styles.avatarGrid}>
                                {avatars.map((avatar) => (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        className={`${styles.avatarOption} ${selectedAvatar.id === avatar.id
                                            ? styles.avatarSelected
                                            : ""
                                            }`}
                                        onClick={() => setSelectedAvatar(avatar)}
                                    >
                                        <span
                                            className={styles.avatarCircle}
                                            style={{
                                                backgroundColor: avatar.color,
                                            }}
                                        >
                                            {avatar.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* BACKGROUND */}
                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <label>Card Background</label>

                                <span>Upload an image</span>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleBackgroundUpload}
                                className={styles.fileInput}
                            />

                            <button
                                type="button"
                                className={styles.uploadButton}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <span className={styles.uploadIcon}>↑</span>

                                {backgroundImage
                                    ? "Change Background Image"
                                    : "Upload Background Image"}
                            </button>

                            {backgroundImage && (
                                <button
                                    type="button"
                                    className={styles.removeBackground}
                                    onClick={() => setBackgroundImage(null)}
                                >
                                    Remove background
                                </button>
                            )}
                        </div>

                        {/* BASIC INFORMATION */}
                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <label>Basic Information</label>
                            </div>

                            {/* NAME */}
                            <div className={styles.field}>
                                <label htmlFor="name">Name</label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Rohith Lenka"
                                    value={card.name}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* ROLE */}
                            <div className={styles.field}>
                                <label htmlFor="role">Role</label>

                                <input
                                    id="role"
                                    name="role"
                                    type="text"
                                    placeholder="Software Developer"
                                    value={card.role}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* BIO */}
                            <div className={styles.field}>
                                <label htmlFor="bio">Bio</label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows="4"
                                    maxLength="180"
                                    placeholder="Tell people a little about yourself..."
                                    value={card.bio}
                                    onChange={handleChange}
                                />

                                <span className={styles.characterCount}>
                                    {card.bio.length}/180
                                </span>
                            </div>
                        </div>

                        {/* SKILLS */}
                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <label>Skills</label>

                                <span>{card.skills.length}/8</span>
                            </div>

                            <div className={styles.skillInputWrapper}>
                                <input
                                    type="text"
                                    placeholder="e.g. React"
                                    value={skillInput}
                                    maxLength="20"
                                    onChange={(e) =>
                                        setSkillInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={addSkill}
                                    disabled={card.skills.length >= 8}
                                    className={styles.addSkillButton}
                                >
                                    Add
                                </button>
                            </div>

                            <div className={styles.skillList}>
                                {card.skills.map((skill) => (
                                    <div
                                        className={styles.skillTag}
                                        key={skill}
                                    >
                                        <span>{skill}</span>

                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            aria-label={`Remove ${skill}`}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SOCIAL LINKS */}
                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <label>Social Links</label>

                                <span>Optional</span>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="github">GitHub</label>

                                <input
                                    id="github"
                                    name="github"
                                    type="url"
                                    placeholder="https://github.com/username"
                                    value={card.github}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="linkedin">LinkedIn</label>

                                <input
                                    id="linkedin"
                                    name="linkedin"
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    value={card.linkedin}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="portfolio">Portfolio</label>

                                <input
                                    id="portfolio"
                                    name="portfolio"
                                    type="url"
                                    placeholder="https://yourportfolio.com"
                                    value={card.portfolio}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================
            RIGHT SIDE — PREVIEW
        ========================================= */}

                <section className={styles.previewSection}>
                    <div className={styles.previewHeader}>
                        <div>
                            <p>PREVIEW</p>

                            <span>
                                Your card updates automatically
                            </span>
                        </div>
                    </div>

                    <div className={styles.previewArea}>
                        <div
                            ref={cardRef}
                            className={styles.profileCard}
                            style={
                                backgroundImage
                                    ? {
                                        backgroundImage: `url(${backgroundImage})`,
                                    }
                                    : undefined
                            }
                        >
                            {/* BACKGROUND OVERLAY */}
                            <div className={styles.cardOverlay}></div>

                            {/* CARD CONTENT */}
                            <div className={styles.cardInner}>

                                {/* AVATAR */}
                                <div className={styles.cardAvatar}>
                                    <span
                                        style={{
                                            backgroundColor: selectedAvatar.color,
                                        }}
                                    >
                                        {selectedAvatar.label}
                                    </span>
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
                                        {card.skills.length > 0 ? (
                                            card.skills.map((skill) => (
                                                <span key={skill}>
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <>
                                                <span>React</span>
                                                <span>Node.js</span>
                                                <span>MongoDB</span>
                                            </>
                                        )}
                                    </div>

                                    {/* FOOTER */}
                                    <div className={styles.cardFooter}>

                                        <div className={styles.socialLinks}>

                                            {card.github && (
                                                <a
                                                    href={card.github}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    GitHub
                                                </a>
                                            )}

                                            {card.linkedin && (
                                                <a
                                                    href={card.linkedin}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    LinkedIn
                                                </a>
                                            )}

                                            {card.portfolio && (
                                                <a
                                                    href={card.portfolio}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Portfolio
                                                </a>
                                            )}

                                            {!card.github &&
                                                !card.linkedin &&
                                                !card.portfolio && (
                                                    <>
                                                        <span>GitHub</span>
                                                        <span>LinkedIn</span>
                                                        <span>Portfolio</span>
                                                    </>
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

                        {/* ACTION BUTTONS */}
                        <div className={styles.cardActions}>

                            <button
                                type="button"
                                className={styles.downloadButton}
                                onClick={downloadCard}
                            >
                                ↓ Download JPG
                            </button>

                            <button
                                type="button"
                                className={styles.publishButton}
                                onClick={saveAndPushToLobby}
                            >
                                ✓ Save & Push to Lobby
                            </button>

                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Builder;