import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Login failed."
        );
        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      navigate("/lobby");

    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.loginPage}>

      {/* 3D BACKGROUND */}

      <div className={styles.scene}>

        <div
          className={`${styles.connection} ${styles.line1}`}
        />

        <div
          className={`${styles.connection} ${styles.line2}`}
        />

        <div
          className={`${styles.connection} ${styles.line3}`}
        />

        <div
          className={`${styles.node} ${styles.node1}`}
        />

        <div
          className={`${styles.node} ${styles.node2}`}
        />

        <div
          className={`${styles.node} ${styles.node3}`}
        />

        <div
          className={`${styles.node} ${styles.node4}`}
        />

        <div
          className={`${styles.floatingCard} ${styles.cardOne}`}
        >
          <div className={styles.miniAvatar}>
            R
          </div>

          <div>
            <strong>Developer</strong>
            <span>React · Node.js</span>
          </div>
        </div>

        <div
          className={`${styles.floatingCard} ${styles.cardTwo}`}
        >
          <div className={styles.miniAvatar}>
            A
          </div>

          <div>
            <strong>Designer</strong>
            <span>UI/UX · Figma</span>
          </div>
        </div>

        <div
          className={`${styles.floatingCard} ${styles.cardThree}`}
        >
          <div className={styles.miniAvatar}>
            S
          </div>

          <div>
            <strong>Engineer</strong>
            <span>Java · Cloud</span>
          </div>
        </div>

      </div>


      {/* LOGIN CARD */}

      <div className={styles.loginCard}>

        <div className={styles.logo}>
          INSTACARD
        </div>

        <h1>
          Welcome back
        </h1>

        <p className={styles.subtitle}>
          Login to continue building connections.
        </p>


        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className={styles.field}>

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

          </div>


          {/* PASSWORD */}

          <div className={styles.field}>

            <label htmlFor="password">
              Password
            </label>

            <div className={styles.passwordWrapper}>

              <input
                id="password"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className={styles.showPassword}
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          {/* ERROR */}

          {error && (
            <p
              style={{
                margin: "0",
                color: "#ff5555",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}


          {/* LOGIN */}

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p className={styles.registerText}>
          Don't have an account?{" "}

          <Link to="/register">
            Create account
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;