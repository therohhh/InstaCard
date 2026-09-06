import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;


    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }


    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }


    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        setError(
          data.message || "Registration failed."
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
    <div className={styles.registerPage}>

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


      {/* REGISTER CARD */}

      <div className={styles.registerCard}>

        <div className={styles.logo}>
          INSTACARD
        </div>


        <h1>
          Create your account
        </h1>


        <p className={styles.subtitle}>
          Build your profile and start connecting.
        </p>


        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className={styles.field}>

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />

          </div>


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
                placeholder="Create a password"
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


          {/* CONFIRM PASSWORD */}

          <div className={styles.field}>

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className={styles.passwordWrapper}>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />

              <button
                type="button"
                className={styles.showPassword}
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword
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


          {/* REGISTER */}

          <button
            type="submit"
            className={styles.registerButton}
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        <p className={styles.loginText}>
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;