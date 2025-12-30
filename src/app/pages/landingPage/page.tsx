"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { accounts } from "../../data/accountSetup";

export default function Home() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    const user = accounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (user) {
      console.log(`welcome ${user.name}`);
      router.push("/pages/scheduleCreation");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className={styles.landingWrapper}>
      <div className={`${styles.container} ${isSignUp ? styles.rightPanelActive : ''}`}>
        {/* Sign Up Form */}
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form action="#">
            <h1>CREATE ACCOUNT</h1>
            <span>use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="button">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form action="#">
            <h1>SIGN IN</h1>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#">Forgot your password?</a>
            <button type="button" onClick={handleSignIn}>Sign In</button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className={styles.ghost} onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className={styles.ghost} onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
