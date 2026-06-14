import React from 'react';
import styles from './Welcome.module.css';
import insta from '../../assets/insta.png';
import facebook from '../../assets/facebook.png';
import linkedin from '../../assets/linkedin.png';
import discord from '../../assets/discord.png';
import github from '../../assets/github.png';
import { useNavigate } from "react-router-dom";
const Welcome = () => {
  
  const navigate = useNavigate();

  return (
    <div className={styles.Welcome}>

  <div className={styles.heroBox}>
    <h1>
      <span className={styles.welcome}>Welcome</span>
      <span className={styles.to}> to </span>
      <br />
      <span className={styles.instacard}>INSTACARD</span>
    </h1>
  </div>

  <p className={styles.tagline}>
    build ur profile by a card and connect..! :)
  </p>

  <div className={styles.btnContainer}>
    <button onClick={() => navigate("/builder") } className={styles.startBtn}>
      get started ?
    </button>

    <img src={insta} className={`${styles.icon} ${styles.insta}`} />
    <img src={facebook} className={`${styles.icon} ${styles.facebook}`} />
    <img src={linkedin} className={`${styles.icon} ${styles.linkedin}`} />
    <img src={discord} className={`${styles.icon} ${styles.discord}`} />
  </div>

</div>
  );
};

export default Welcome;