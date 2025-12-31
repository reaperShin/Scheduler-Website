"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

// 8 Crayon Colors + White
const CRAYON_COLORS = [
  "#FFFFFF", // White
  "#FF0000", // Red
  "#FFA500", // Orange
  "#FFFF00", // Yellow
  "#008000", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#EE82EE", // Violet
  "#000000", // Black? Or maybe Brown/Pink. "8 color crayon" usually includes Black and Brown. 
  // Let's stick to a standard 8-pack: Red, Orange, Yellow, Green, Blue, Violet, Brown, Black.
  // But user said "8 color crayon is the choices along with the white included".
  // Let's optimize for "highlight" colors that are readable or at least distinct.
  // Standard 8: Red, Blue, Green, Yellow, Orange, Purple, Brown, Black.
  // We need 8 + White.
  "#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#800080", "#A52A2A", "#000000"
];

// Wait, user said "Only 8 colors in the 8 color crayon is the choices along with the white included in the choices".
// Does that mean 8 TOTAL (7+White) or 8 colors AND White (9 total)?
// "Only 8 colors in the 8 color crayon is the choices along with the white included" -> 8 colors from crayon box + 1 white = 9 choices.
// Standard 8 pack: Red, Blue, Yellow, Green, Orange, Purple, Brown, Black.

const COLORS = [
  "#FFFFFF", // White (Default)
  "#FF0000", // Red
  "#FFA500", // Orange
  "#FFFF00", // Yellow
  "#008000", // Green
  "#0000FF", // Blue
  "#800080", // Purple
  "#A52A2A", // Brown
  "#000000"  // Black
];

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
            {scheduleCount.map((item) => {
              const scheduleData = formData[item] || {};
              const selectedColor = scheduleData.color || '#FFFFFF'; // Default white

              return (
                <div
                  key={item}
                  className={styles.scheduleData}
                  style={{ backgroundColor: selectedColor }}
                >
                  <h3>Schedule {item}</h3>
                  <div className={styles.colorPickerContainer} style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Pick a Color:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {COLORS.map((color) => (
                        <div
                          key={color}
                          onClick={() => handleChange(item, 'color', color)}
                          style={{
                            width: '25px',
                            height: '25px',
                            borderRadius: '50%',
                            backgroundColor: color,
                            cursor: 'pointer',
                            border: selectedColor === color ? '2px solid black' : '1px solid #ccc',
                            boxShadow: selectedColor === color ? '0 0 5px rgba(0,0,0,0.5)' : 'none'
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter Schedule Name"
                    onChange={(e) => handleChange(item, 'name', e.target.value)}
                    style={{ backgroundColor: 'rgba(255,255,255,0.7)' }} // Ensure text is readable
                  />
                  <label>Date</label>
                  <input
                    type="date"
                    placeholder="Enter Date"
                    onChange={(e) => handleChange(item, 'date', e.target.value)}
                    style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                  />
                  <label>Start Time</label>
                  <input
                    type="time"
                    placeholder="Enter Start Time"
                    onChange={(e) => handleChange(item, 'startTime', e.target.value)}
                    style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                  />
                  <label>End Time</label>
                  <input
                    type="time"
                    placeholder="Enter End Time"
                    onChange={(e) => handleChange(item, 'endTime', e.target.value)}
                    style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
                  />
                </div>
              );
            })}
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
