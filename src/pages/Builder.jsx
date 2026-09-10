import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Builder.module.css";
import html2canvas from "html2canvas";

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

    /* =========================================================
       FORM CHANGE
    ========================================================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCard((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    /* =========================================================
       ADD SKILL
    ========================================================= */

    const addSkill = () => {
        const skill = skillInput.trim();

        if (!skill) return;

        if (card.skills.length >= 8) {
            return;
        }

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

    /* =========================================================
       REMOVE SKILL
    ========================================================= */

    const removeSkill = (skillToRemove) => {
        setCard((prev) => ({
            ...prev,
            skills: prev.skills.filter(
                (skill) => skill !== skillToRemove
            ),
        }));
    };

    /* =========================================================
       IMAGE → BASE64
    ========================================================= */

    const handleImageUpload = (file, setter) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setter(reader.result);
        };

        reader.onerror = () => {
            alert("Unable to read the image.");
        };

        reader.readAsDataURL(file);
    };

    /* =========================================================
       PROFILE PICTURE
    ========================================================= */

    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];

        handleImageUpload(file, setAvatarImage);

        e.target.value = "";
    };

    /* =========================================================
       BACKGROUND IMAGE
    ========================================================= */

    const handleBackgroundUpload = (e) => {
        const file = e.target.files?.[0];

        handleImageUpload(file, setBackgroundImage);

        e.target.value = "";
    };

    /* =========================================================
       DOWNLOAD CARD
    ========================================================= */

    const downloadCard = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(
                cardRef.current,
                {
                    useCORS: true,
                    scale: 2,
                    backgroundColor: null,
                }
            );

            const image = canvas.toDataURL(
                "image/jpeg",
                0.95
            );

            const link =
                document.createElement("a");

            link.href = image;
            link.download = "instacard.jpg";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        } catch (error) {
            console.error(
                "Card download failed:",
                error
            );

            alert(
                "Unable to download the card. Please try again."
            );
        }
    };

    /* =========================================================
       SAVE + PUBLISH
    ========================================================= */

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
                        color:
                            fallbackAvatar.color,
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
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();

            console.log(
                "Publish response:",
                data
            );

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

            /* ================================================
               SAVE LATEST CARD LOCALLY
            ================================================= */

            localStorage.setItem(
                "instacard",
                JSON.stringify(data.card)
            );

            navigate("/lobby", {
                replace: true,
            });
            
        } catch (error) {
            console.error(
                "Publish card error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <div className={styles.builderPage}>

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className={styles.header}>

                <div>

                    <p className={styles.eyebrow}>
                        INSTACARD
                    </p>

                    <h1>
                        Create your card
                    </h1>

                    <p className={styles.subtitle}>
                        Build your professional identity
                        and share it with the world.
                    </p>

                </div>

            </header>


            {/* =====================================================
                BUILDER
            ===================================================== */}

            <main className={styles.builderContainer}>

                {/* =================================================
                    LEFT — FORM
                ================================================= */}

                <section
                    className={styles.formSection}
                >

                    <div
                        className={
                            styles.sectionHeader
                        }
                    >

                        <h2>
                            Card Details
                        </h2>

                        <span>
                            Live Preview
                        </span>

                    </div>


                    <div className={styles.form}>

                        {/* =================================================
                            PROFILE PICTURE
                        ================================================= */}

                        <div
                            className={
                                styles.controlSection
                            }
                        >

                            <div
                                className={
                                    styles.controlHeading
                                }
                            >

                                <label>
                                    Profile Picture
                                </label>

                                <span>
                                    Optional
                                </span>

                            </div>


                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleAvatarUpload
                                }
                                className={
                                    styles.fileInput
                                }
                            />


                            <div
                                className={
                                    styles.profileUploadArea
                                }
                            >

                                {avatarImage ? (
                                    <img
                                        src={
                                            avatarImage
                                        }
                                        alt="Profile preview"
                                        className={
                                            styles.uploadedAvatar
                                        }
                                    />
                                ) : (
                                    <div
                                        className={
                                            styles.emptyAvatar
                                        }
                                    >
                                        ?
                                    </div>
                                )}


                                <div
                                    className={
                                        styles.profileUploadInfo
                                    }
                                >

                                    <strong>
                                        {avatarImage
                                            ? "Profile picture added"
                                            : "Add your profile picture"}
                                    </strong>

                                    <span>
                                        Use a clear professional
                                        photo.
                                    </span>

                                </div>

                            </div>


                            <button
                                type="button"
                                className={
                                    styles.uploadButton
                                }
                                onClick={() =>
                                    avatarInputRef
                                        .current
                                        ?.click()
                                }
                            >
                                ↑

                                {avatarImage
                                    ? "Change Profile Picture"
                                    : "Upload Profile Picture"}
                            </button>


                            {avatarImage && (
                                <button
                                    type="button"
                                    className={
                                        styles.removeBackground
                                    }
                                    onClick={() =>
                                        setAvatarImage(
                                            null
                                        )
                                    }
                                >
                                    Remove profile picture
                                </button>
                            )}

                        </div>


                        {/* =================================================
                            BACKGROUND
                        ================================================= */}

                        <div
                            className={
                                styles.controlSection
                            }
                        >

                            <div
                                className={
                                    styles.controlHeading
                                }
                            >

                                <label>
                                    Card Background
                                </label>

                                <span>
                                    Optional
                                </span>

                            </div>


                            <input
                                ref={
                                    backgroundInputRef
                                }
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleBackgroundUpload
                                }
                                className={
                                    styles.fileInput
                                }
                            />


                            <button
                                type="button"
                                className={
                                    styles.uploadButton
                                }
                                onClick={() =>
                                    backgroundInputRef
                                        .current
                                        ?.click()
                                }
                            >
                                ↑

                                {backgroundImage
                                    ? "Change Background Image"
                                    : "Upload Background Image"}
                            </button>


                            {backgroundImage && (
                                <div
                                    className={
                                        styles.backgroundPreview
                                    }
                                >

                                    <img
                                        src={
                                            backgroundImage
                                        }
                                        alt="Background preview"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setBackgroundImage(
                                                null
                                            )
                                        }
                                    >
                                        Remove background
                                    </button>

                                </div>
                            )}

                        </div>


                        {/* =================================================
                            BASIC INFORMATION
                        ================================================= */}

                        <div
                            className={
                                styles.controlSection
                            }
                        >

                            <div
                                className={
                                    styles.controlHeading
                                }
                            >

                                <label>
                                    Basic Information
                                </label>

                            </div>


                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Rohith Lenka"
                                    value={card.name}
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label htmlFor="role">
                                    Role
                                </label>

                                <input
                                    id="role"
                                    name="role"
                                    type="text"
                                    placeholder="Software Developer"
                                    value={card.role}
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label htmlFor="bio">
                                    Bio
                                </label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows="4"
                                    maxLength="180"
                                    placeholder="Tell people a little about yourself..."
                                    value={card.bio}
                                    onChange={
                                        handleChange
                                    }
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

                        <div
                            className={
                                styles.controlSection
                            }
                        >

                            <div
                                className={
                                    styles.controlHeading
                                }
                            >

                                <label>
                                    Skills
                                </label>

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
                                    placeholder="e.g. React"
                                    value={
                                        skillInput
                                    }
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
                                    onClick={
                                        addSkill
                                    }
                                    disabled={
                                        card.skills
                                            .length >=
                                        8
                                    }
                                    className={
                                        styles.addSkillButton
                                    }
                                >
                                    Add
                                </button>

                            </div>


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
                                            key={
                                                skill
                                            }
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
                                            >
                                                ×
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            SOCIAL LINKS
                        ================================================= */}

                        <div
                            className={
                                styles.controlSection
                            }
                        >

                            <div
                                className={
                                    styles.controlHeading
                                }
                            >

                                <label>
                                    Social Links
                                </label>

                                <span>
                                    Optional
                                </span>

                            </div>


                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label htmlFor="github">
                                    GitHub
                                </label>

                                <input
                                    id="github"
                                    name="github"
                                    type="url"
                                    placeholder="https://github.com/username"
                                    value={
                                        card.github
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label htmlFor="linkedin">
                                    LinkedIn
                                </label>

                                <input
                                    id="linkedin"
                                    name="linkedin"
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    value={
                                        card.linkedin
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            <div
                                className={
                                    styles.field
                                }
                            >

                                <label htmlFor="portfolio">
                                    Portfolio
                                </label>

                                <input
                                    id="portfolio"
                                    name="portfolio"
                                    type="url"
                                    placeholder="https://yourportfolio.com"
                                    value={
                                        card.portfolio
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (
                            <p
                                className={
                                    styles.errorMessage
                                }
                            >
                                {error}
                            </p>
                        )}

                    </div>

                </section>


                {/* =================================================
                    RIGHT — PREVIEW
                ================================================= */}

                <section
                    className={
                        styles.previewSection
                    }
                >

                    <div
                        className={
                            styles.previewHeader
                        }
                    >

                        <div>

                            <p>
                                PREVIEW
                            </p>

                            <span>
                                Your card updates automatically
                            </span>

                        </div>

                    </div>


                    <div
                        className={
                            styles.previewArea
                        }
                    >

                        {/* =================================================
                            PROFILE CARD
                        ================================================= */}

                        <div
                            ref={cardRef}
                            className={
                                styles.profileCard
                            }
                            style={
                                backgroundImage
                                    ? {
                                        backgroundImage:
                                            `url(${backgroundImage})`,
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
                                    styles.cardInner
                                }
                            >

                                {/* PROFILE IMAGE */}

                                <div
                                    className={
                                        styles.cardAvatar
                                    }
                                >

                                    {avatarImage ? (
                                        <img
                                            src={
                                                avatarImage
                                            }
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


                                {/* MAIN CONTENT */}

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

                                        <h2>
                                            {card.name ||
                                                "Your Name"}
                                        </h2>

                                        <p>
                                            {card.role ||
                                                "Your Role"}
                                        </p>

                                        <span>
                                            {card.bio ||
                                                "Your professional bio will appear here."}
                                        </span>

                                    </div>


                                    <div
                                        className={
                                            styles.cardSkills
                                        }
                                    >

                                        {card.skills
                                            .length >
                                            0 ? (
                                            card.skills.map(
                                                (
                                                    skill
                                                ) => (
                                                    <span
                                                        key={
                                                            skill
                                                        }
                                                    >
                                                        {
                                                            skill
                                                        }
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <>
                                                <span>
                                                    React
                                                </span>

                                                <span>
                                                    Node.js
                                                </span>

                                                <span>
                                                    MongoDB
                                                </span>
                                            </>
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

                                            {card.github && (
                                                <a
                                                    href={
                                                        card.github
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    GitHub
                                                </a>
                                            )}

                                            {card.linkedin && (
                                                <a
                                                    href={
                                                        card.linkedin
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    LinkedIn
                                                </a>
                                            )}

                                            {card.portfolio && (
                                                <a
                                                    href={
                                                        card.portfolio
                                                    }
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
                                                        <span>
                                                            GitHub
                                                        </span>

                                                        <span>
                                                            LinkedIn
                                                        </span>

                                                        <span>
                                                            Portfolio
                                                        </span>
                                                    </>
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


                        {/* =================================================
                            ACTION BUTTONS
                        ================================================= */}

                        <div
                            className={
                                styles.cardActions
                            }
                        >

                            <button
                                type="button"
                                className={
                                    styles.downloadButton
                                }
                                onClick={
                                    downloadCard
                                }
                            >
                                ↓ Download JPG
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
                                {saving
                                    ? "Publishing..."
                                    : "✓ Save & Push to Lobby"}
                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default Builder;