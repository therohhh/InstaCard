import BuilderForm from "../../components/cardBuilder/BuilderForm";
import CardPreview from "../../components/cardBuilder/CardPreview";
import styles from "./CardBuilder.module.css";
import { useState } from "react";

const CardBuilder = () => {
  const [cardData, setCardData] = useState({
    name: "",
    role: "",
    bio: "",
    avatar: "",
    skills: [],
    socials: {
    github: "",
    linkedin: "",
    portfolio: "",
  },
   theme: "dark",
  });

  return (
    <div className={styles.builder}>
      <div className={styles.formPanel}>
        <BuilderForm cardData={cardData} setCardData={setCardData} />
      </div>
      <div className={styles.previewPanel}>
        <CardPreview cardData={cardData} />
      </div>
    </div>
  );
};

export default CardBuilder;