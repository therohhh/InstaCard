import React from 'react';
import styles from './Welcome.module.css';
import insta from '../../assets/insta.png';
import facebook from '../../assets/facebook.png';
import linkedin from '../../assets/linkedin.png';
import discord from '../../assets/discord.png';
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.Welcome}>

      <div className={styles.heroBox}>
        <h1>
          <span className={styles.welcome}>Welcome to</span>
          <span className={styles.instacard}>INSTACARD</span>
        </h1>
      </div>

      <p className={styles.tagline}>
        build your profile, share a card, make a connection.
      </p>

      <div className={styles.btnContainer}>
        <button
          onClick={() => navigate("/builder")}
          className={styles.startBtn}
        >
          Get started
        </button>

        <img src={insta} className={`${styles.icon} ${styles.insta}`} alt="" />
        <img src={facebook} className={`${styles.icon} ${styles.facebook}`} alt="" />
        <img src={linkedin} className={`${styles.icon} ${styles.linkedin}`} alt="" />
        <img src={discord} className={`${styles.icon} ${styles.discord}`} alt="" />
      </div>

    </div>
  );
};

export default Welcome;