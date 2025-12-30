"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function RootPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Total duration in ms
    const duration = 6000;
    const intervalTime = 50; // Update every 50ms for smooth animation
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Redirect after 6 seconds
    const redirectTimer = setTimeout(() => {
      router.push("/pages/landingPage");
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className={styles.loadingContainer}>
      <video className={styles.backgroundVideo} autoPlay loop muted playsInline>
        <source src="/loadingBackground.mp4" type="video/mp4" />
      </video>
      <div className={styles.content}>
        <div className={styles.loadingMeterContainer}>
          <div className={styles.loadingMeter} style={{ width: `${progress}%` }}></div>
        </div>
        <p className={styles.loadingText}>Loading Scheduler...</p>
      </div>
    </div>
  );
}
