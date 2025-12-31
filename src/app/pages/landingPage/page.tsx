"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { accounts } from "../../data/accountSetup";

export default function Home() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Sign In State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

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

  const handleSignUp = async () => {
    if (!signUpName || !signUpEmail || !signUpPassword) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch('/api/accountSetup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Sign up success:", data);
        alert(`Account created for ${data.user.name}! Please sign in.`);
        setIsSignUp(false); // Switch to Sign In view
        // Optionally pre-fill sign-in fields
        setEmail(signUpEmail);
        setPassword('');
      } else {
        const errorData = await response.json();
        alert(`Sign up failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("An error occurred during sign up.");
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
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />
            <button type="button" onClick={handleSignUp}>Sign Up</button>
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
