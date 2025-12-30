"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScheduleCreation() {
  const router = useRouter();
  const [scheduleCount, setScheduleCount] = useState<number[]>([1]);
  const [formData, setFormData] = useState<any>({});

  const handleClick = () => {
    setScheduleCount((prev) => [...prev, prev.length + 1]);
  };

  const handleChange = (id: number, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [id]: {
        ...prev[id],
        id: `${id}`, // Simple ID generation
        [field]: value
      }
    }));
  };

  const viewSchedules = () => {
    router.push("/pages/scheduleDisplay");
  }

  const handleSave = async () => {
    const schedules = Object.values(formData);
    if (schedules.length === 0) return;

    try {
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedules)
      });

      if (response.ok) {
        alert('Schedules saved!');
        // Optional: clear form or redirect
      } else {
        alert('Failed to save.');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Schedule Creation</h1>
      </header>
      <main className={styles.mainContent}>
        <p>Create your new schedule entries below.</p>
        <div className={styles.contentPlaceholder}>
          <div className={styles.gridContainer}>
            {scheduleCount.map((item) => (
              <div key={item} className={styles.scheduleData}>
                <h3>Schedule {item}</h3>
                <input
                  type="text"
                  placeholder="Enter Schedule Name"
                  onChange={(e) => handleChange(item, 'name', e.target.value)}
                />
                <label>Date</label>
                <input
                  type="date"
                  placeholder="Enter Date"
                  onChange={(e) => handleChange(item, 'date', e.target.value)}
                />
                <label>Start Time</label>
                <input
                  type="time"
                  placeholder="Enter Start Time"
                  onChange={(e) => handleChange(item, 'startTime', e.target.value)}
                />
                <label>End Time</label>
                <input
                  type="time"
                  placeholder="Enter End Time"
                  onChange={(e) => handleChange(item, 'endTime', e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.addButton} onClick={handleClick}>
              Add More
            </button>
            <button className={styles.saveButton} onClick={handleSave}>
              Save Schedules
            </button>
            <button className={styles.viewButton} onClick={viewSchedules}>
              View Schedules
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
