import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import styles from "./Builder.module.css";

const fallbackAvatar = {
    color: "#1f2937",
};

const Builder = () => {
    const navigate = useNavigate();

    const backgroundInputRef = useRef(null);
    const avatarInputRef = useRef(null);
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
    const [avatarImage, setAvatarImage] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCard((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    const addSkill = () => {
        const skill = skillInput.trim();

        if (!skill) return;

        if (card.skills.length >= 8) {
            setError("You can add up to 8 skills.");
            return;
        }

        const alreadyExists = card.skills.some(
            (item) => item.toLowerCase() === skill.toLowerCase()
        );

        if (alreadyExists) {
            setSkillInput("");
            return;
        }

        setCard((prev) => ({
            ...prev,
            skills: [...prev.skills, skill],
        }));

        setSkillInput("");
        setError("");
    };

    const removeSkill = (skillToRemove) => {
        setCard((prev) => ({
            ...prev,
            skills: prev.skills.filter(
                (skill) => skill !== skillToRemove
            ),
        }));
    };

    const handleImageUpload = (file, setter) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setter(reader.result);
            setError("");
        };

        reader.onerror = () => {
            setError("Unable to read the selected image.");
        };

        reader.readAsDataURL(file);
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];

        handleImageUpload(file, setAvatarImage);

        e.target.value = "";
    };

    const handleBackgroundUpload = (e) => {
        const file = e.target.files?.[0];

        handleImageUpload(file, setBackgroundImage);

        e.target.value = "";
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
        } catch (downloadError) {
            console.error(
                "Card download failed:",
                downloadError
            );

            setError(
                "Unable to download the card. Please try again."
            );
        }
    };

    const saveAndPushToLobby = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError(
                "Your session has expired. Please login again."
            );

            navigate("/login");
            return;
        }

        if (!card.name.trim()) {
            setError("Please enter your name.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                name: card.name.trim(),
                role: card.role.trim(),
                bio: card.bio.trim(),
                skills: card.skills,
                github: card.github.trim(),
                linkedin: card.linkedin.trim(),
                portfolio: card.portfolio.trim(),

                avatar: avatarImage
                    ? {
                          type: "image",
                          url: avatarImage,
                      }
                    : {
                          type: "letter",
                          label: card.name
                              .charAt(0)
                              .toUpperCase(),
                          color: fallbackAvatar.color,
                      },

                backgroundImage:
                    backgroundImage || null,

                status: "published",
            };

            const response = await fetch(
                "http://localhost:5000/api/cards",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            console.log("Publish response:", data);

            if (!response.ok) {
                setError(
                    data.message ||
                        "Failed to publish card."
                );

                return;
            }

            if (!data.card) {
                setError(
                    "Card was saved but the server did not return the card."
                );

                return;
            }

            localStorage.setItem(
                "instacard",
                JSON.stringify(data.card)
            );

            navigate("/lobby", {
                replace: true,
            });
        } catch (publishError) {
            console.error(
                "Publish card error:",
                publishError
            );

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setSaving(false);
        }
    };

    const displaySkills =
        card.skills.length > 0
            ? card.skills
            : ["React", "Node.js", "MongoDB"];

    return (
        <div className={styles.builderPage}>
            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div className={styles.backgroundGrid} />
            <div className={styles.backgroundGlow} />
            <div className={styles.backgroundOrb} />

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className={styles.header}>
                <div className={styles.headerBrand}>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => navigate("/lobby")}
                    >
                        ← Lobby
                    </button>

                    <div className={styles.brandMark}>
                        <span />
                        INSTACARD
                    </div>
                </div>

                <div className={styles.headerStatus}>
                    <span className={styles.statusDot} />
                    LIVE BUILDER
                </div>
            </header>

            {/* =====================================================
                INTRO
            ===================================================== */}

            <section className={styles.intro}>
                <div className={styles.introMeta}>
                    <span>01</span>
                    <span>CREATE / DEFINE / SHARE</span>
                </div>

                <h1>
                    Build your
                    <span> identity.</span>
                </h1>

                <p>
                    Create a professional identity card
                    that makes your work instantly
                    recognizable.
                </p>
            </section>

            {/* =====================================================
                BUILDER
            ===================================================== */}

            <main className={styles.builderContainer}>
                {/* =================================================
                    LEFT — EDITOR
                ================================================= */}

                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <span className={styles.sectionNumber}>
                                01
                            </span>

                            <h2>Card Details</h2>
                        </div>

                        <span className={styles.liveLabel}>
                            ● LIVE
                        </span>
                    </div>

                    <div className={styles.form}>
                        {/* =================================================
                            PROFILE MEDIA
                        ================================================= */}

                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <div>
                                    <span className={styles.controlIndex}>
                                        01
                                    </span>

                                    <label>
                                        Profile Picture
                                    </label>
                                </div>

                                <span>OPTIONAL</span>
                            </div>

                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleAvatarUpload
                                }
                                className={styles.fileInput}
                            />

                            <div
                                className={
                                    styles.profileUploadArea
                                }
                            >
                                <div
                                    className={
                                        styles.avatarUploadPreview
                                    }
                                >
                                    {avatarImage ? (
                                        <img
                                            src={avatarImage}
                                            alt="Profile preview"
                                        />
                                    ) : (
                                        <span>+</span>
                                    )}
                                </div>

                                <div
                                    className={
                                        styles.profileUploadInfo
                                    }
                                >
                                    <strong>
                                        {avatarImage
                                            ? "Profile picture added"
                                            : "Add profile picture"}
                                    </strong>

                                    <span>
                                        Use a clear,
                                        professional image.
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={
                                    styles.uploadButton
                                }
                                onClick={() =>
                                    avatarInputRef.current?.click()
                                }
                            >
                                ↑{" "}
                                {avatarImage
                                    ? "Change image"
                                    : "Upload image"}
                            </button>

                            {avatarImage && (
                                <button
                                    type="button"
                                    className={
                                        styles.removeButton
                                    }
                                    onClick={() =>
                                        setAvatarImage(null)
                                    }
                                >
                                    Remove profile picture
                                </button>
                            )}
                        </div>

                        {/* =================================================
                            BACKGROUND
                        ================================================= */}

                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <div>
                                    <span className={styles.controlIndex}>
                                        02
                                    </span>

                                    <label>
                                        Card Background
                                    </label>
                                </div>

                                <span>OPTIONAL</span>
                            </div>

                            <input
                                ref={backgroundInputRef}
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleBackgroundUpload
                                }
                                className={styles.fileInput}
                            />

                            <button
                                type="button"
                                className={
                                    styles.backgroundUploadButton
                                }
                                onClick={() =>
                                    backgroundInputRef.current?.click()
                                }
                            >
                                <span className={styles.uploadIcon}>
                                    +
                                </span>

                                <span>
                                    {backgroundImage
                                        ? "Change background image"
                                        : "Add a custom background"}
                                </span>

                                <span className={styles.uploadArrow}>
                                    ↗
                                </span>
                            </button>

                            {backgroundImage && (
                                <div
                                    className={
                                        styles.backgroundPreview
                                    }
                                >
                                    <img
                                        src={backgroundImage}
                                        alt="Background preview"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setBackgroundImage(null)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            BASIC INFORMATION
                        ================================================= */}

                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <div>
                                    <span className={styles.controlIndex}>
                                        03
                                    </span>

                                    <label>
                                        Basic Information
                                    </label>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="name">
                                    NAME
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Rohith Lenka"
                                    value={card.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="role">
                                    ROLE
                                </label>

                                <input
                                    id="role"
                                    name="role"
                                    type="text"
                                    placeholder="Software Developer"
                                    value={card.role}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="bio">
                                    BIO
                                </label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows="4"
                                    maxLength="180"
                                    placeholder="Tell people a little about yourself..."
                                    value={card.bio}
                                    onChange={handleChange}
                                />

                                <span
                                    className={
                                        styles.characterCount
                                    }
                                >
                                    {card.bio.length}/180
                                </span>
                            </div>
                        </div>

                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <div>
                                    <span className={styles.controlIndex}>
                                        04
                                    </span>

                                    <label>Skills</label>
                                </div>

                                <span>
                                    {card.skills.length}/8
                                </span>
                            </div>

                            <div
                                className={
                                    styles.skillInputWrapper
                                }
                            >
                                <input
                                    type="text"
                                    placeholder="Add a skill..."
                                    value={skillInput}
                                    maxLength="20"
                                    onChange={(e) =>
                                        setSkillInput(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key ===
                                            "Enter"
                                        ) {
                                            e.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={addSkill}
                                    disabled={
                                        card.skills.length >=
                                        8
                                    }
                                    className={
                                        styles.addSkillButton
                                    }
                                >
                                    Add
                                </button>
                            </div>

                            {card.skills.length > 0 && (
                                <div
                                    className={
                                        styles.skillList
                                    }
                                >
                                    {card.skills.map(
                                        (skill) => (
                                            <div
                                                className={
                                                    styles.skillTag
                                                }
                                                key={skill}
                                            >
                                                <span>
                                                    {skill}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeSkill(
                                                            skill
                                                        )
                                                    }
                                                    aria-label={`Remove ${skill}`}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* =================================================
                            SOCIAL LINKS
                        ================================================= */}

                        <div className={styles.controlSection}>
                            <div className={styles.controlHeading}>
                                <div>
                                    <span className={styles.controlIndex}>
                                        05
                                    </span>

                                    <label>
                                        Social Links
                                    </label>
                                </div>

                                <span>OPTIONAL</span>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="github">
                                    GITHUB
                                </label>

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
                                <label htmlFor="linkedin">
                                    LINKEDIN
                                </label>

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
                                <label htmlFor="portfolio">
                                    PORTFOLIO
                                </label>

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

                        {error && (
                            <div
                                className={
                                    styles.errorMessage
                                }
                            >
                                <span>!</span>
                                {error}
                            </div>
                        )}
                    </div>
                </section>

                {/* =================================================
                    RIGHT — LIVE PREVIEW
                ================================================= */}

                <section className={styles.previewSection}>
                    <div className={styles.previewHeader}>
                        <div>
                            <span className={styles.previewNumber}>
                                02
                            </span>

                            <div>
                                <p>LIVE PREVIEW</p>
                                <span>
                                    Changes appear instantly
                                </span>
                            </div>
                        </div>

                        <span className={styles.previewHint}>
                            DRAG / EXPLORE
                        </span>
                    </div>

                    <div className={styles.previewArea}>
                        <div className={styles.previewGrid} />

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
                            <div
                                className={
                                    styles.cardOverlay
                                }
                            />

                            <div
                                className={
                                    styles.cardGlow
                                }
                            />

                            <div
                                className={
                                    styles.cardInner
                                }
                            >
                                <div
                                    className={
                                        styles.cardAvatar
                                    }
                                >
                                    {avatarImage ? (
                                        <img
                                            src={avatarImage}
                                            alt={
                                                card.name ||
                                                "Profile"
                                            }
                                        />
                                    ) : (
                                        <span
                                            style={{
                                                backgroundColor:
                                                    fallbackAvatar.color,
                                            }}
                                        >
                                            {card.name
                                                ? card.name
                                                      .charAt(
                                                          0
                                                      )
                                                      .toUpperCase()
                                                : "R"}
                                        </span>
                                    )}
                                </div>

                                <div
                                    className={
                                        styles.cardMain
                                    }
                                >
                                    <div
                                        className={
                                            styles.identity
                                        }
                                    >
                                        <span
                                            className={
                                                styles.cardEyebrow
                                            }
                                        >
                                            PROFESSIONAL IDENTITY
                                        </span>

                                        <h2>
                                            {card.name ||
                                                "Your Name"}
                                        </h2>

                                        <p>
                                            {card.role ||
                                                "Your Role"}
                                        </p>

                                        <span
                                            className={
                                                styles.cardBio
                                            }
                                        >
                                            {card.bio ||
                                                "Your professional bio will appear here."}
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            styles.cardSkills
                                        }
                                    >
                                        {displaySkills.map(
                                            (skill) => (
                                                <span
                                                    key={skill}
                                                >
                                                    {skill}
                                                </span>
                                            )
                                        )}
                                    </div>

                                    <div
                                        className={
                                            styles.cardFooter
                                        }
                                    >
                                        <div
                                            className={
                                                styles.socialLinks
                                            }
                                        >
                                            {card.github ? (
                                                <a
                                                    href={
                                                        card.github
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    GitHub
                                                </a>
                                            ) : (
                                                <span>
                                                    GitHub
                                                </span>
                                            )}

                                            {card.linkedin ? (
                                                <a
                                                    href={
                                                        card.linkedin
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    LinkedIn
                                                </a>
                                            ) : (
                                                <span>
                                                    LinkedIn
                                                </span>
                                            )}

                                            {card.portfolio ? (
                                                <a
                                                    href={
                                                        card.portfolio
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    Portfolio
                                                </a>
                                            ) : (
                                                <span>
                                                    Portfolio
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className={
                                                styles.messageButton
                                            }
                                        >
                                            Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                styles.previewCaption
                            }
                        >
                            <span>
                                INSTACARD / IDENTITY SYSTEM
                            </span>

                            <span>
                                {card.name
                                    ? "READY TO PUBLISH"
                                    : "START WITH YOUR NAME"}
                            </span>
                        </div>
                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className={styles.cardActions}>
                        <button
                            type="button"
                            className={
                                styles.downloadButton
                            }
                            onClick={downloadCard}
                        >
                            <span>↓</span>
                            Download JPG
                        </button>

                        <button
                            type="button"
                            className={
                                styles.publishButton
                            }
                            onClick={
                                saveAndPushToLobby
                            }
                            disabled={saving}
                        >
                            <span>
                                {saving ? "◌" : "↗"}
                            </span>

                            {saving
                                ? "Publishing..."
                                : "Publish to Lobby"}
                        </button>
                    </div>
                </section>
            </main>

            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className={styles.footer}>
                <span>INSTACARD © 2026</span>

                <span>
                    BUILD SOMETHING WORTH REMEMBERING.
                </span>
            </footer>
        </div>
    );
};

export default Builder;