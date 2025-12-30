"use client";

import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from 'date-fns/locale';
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./page.module.css";
import { useEffect, useState, useMemo } from "react";
import { Schedule, schedules } from "../../data/schedules";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent extends Event {
  resource?: Schedule;
}

export default function ScheduleDisplay() {
  // Use direct import instead of state for now, assuming static file usage as requested
  // If dynamic is needed later, we can revert to state + fetch, but user asked to "connect the schedule.ts datafile"
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedRange, setSelectedRange] = useState<{ start: Date; end: Date } | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Transform data on mount (or could use useMemo immediately if imported directly)
    // Importing 'schedules' directly from the top
    const transformedEvents = schedules.map((schedule) => {
      const startDateTime = new Date(`${schedule.date}T${schedule.startTime}`);
      const endDateTime = new Date(`${schedule.date}T${schedule.endTime}`);
      return {
        title: schedule.name,
        start: startDateTime,
        end: endDateTime,
        resource: schedule,
      };
    });
    setEvents(transformedEvents);
  }, []);

  const handleSelectSlot = ({ start, end, action }: { start: Date; end: Date; action: 'select' | 'click' | 'doubleClick' }) => {
    // Determine if it is a "day" click or a "range" selection
    // start and end might be same for a single day click depending on view

    // For simplicity, we just set the range and open overlay
    // If it's a day view/click, start is 00:00 end is 00:00 of next day usually
    setSelectedRange({ start, end });
    setShowOverlay(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    // If clicking an event, show that day's agenda or just that event?
    // "filtered agenda tho base on that current day" - implying context of day
    const start = startOfWeek(event.start!, { locale: enUS }); // Just defaulting to showing context if needed, but let's stick to the event's day

    // Better: Open overlay for the day of the event
    const eventDayStart = new Date(event.start!);
    eventDayStart.setHours(0, 0, 0, 0);
    const eventDayEnd = new Date(event.start!);
    eventDayEnd.setHours(23, 59, 59, 999);

    setSelectedRange({ start: eventDayStart, end: eventDayEnd });
    setShowOverlay(true);
  };

  const filteredEventsForOverlay = useMemo(() => {
    if (!selectedRange) return [];
    return events.filter(e => {
      // Check if event overlaps with selected range
      return (e.start! >= selectedRange.start && e.start! < selectedRange.end) ||
        (e.end! > selectedRange.start && e.end! <= selectedRange.end);
    }).sort((a, b) => a.start!.getTime() - b.start!.getTime());
  }, [selectedRange, events]);

  // "script for the agenda that will display all the agenda from starting from the date today"
  // This logic is naturally handled by the "Agenda" view of React Big Calendar if we pass all events.
  // Unless user wants a CUSTOM list below. But RB-Calendar's Agenda view does this.

  const calendarFormats = {
    dateFormat: 'd',
    dayFormat: (date: Date, culture: any, localizer: any) =>
      localizer.format(date, 'EEE dd', culture),
    dayHeaderFormat: (date: Date, culture: any, localizer: any) =>
      localizer.format(date, 'EEEE, MMMM dd, yyyy', culture),
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }, culture: any, localizer: any) =>
      `${localizer.format(start, 'MMMM dd', culture)} - ${localizer.format(end, 'MMMM dd, yyyy', culture)}`,
  };

  const components = {
    month: {
      event: () => null, // Hide events in month view
    },
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1>Schedule Display</h1>
      </header>
      <main className={styles.mainContent}>
        <p>View your upcoming schedules below. Click on a day to see detailed agenda.</p>
        <div className={styles.calendarContainer}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
            formats={calendarFormats}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            scrollToTime={new Date()} // Scroll to current time in week/day view
            components={components}
          // To make "whole month clickable" and clean, hiding events helps.
          // We can also add a custom "dateCellWrapper" if we want to show a dot indicator instead of the event bar.
          />
        </div>

        {/* Overlay */}
        {showOverlay && (
          <div className={styles.overlayBackdrop} onClick={() => setShowOverlay(false)}>
            <div className={styles.overlayContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.overlayHeader}>
                <h2>Agenda</h2>
                {selectedRange && (
                  <span>
                    {format(selectedRange.start, 'MMM dd, yyyy')}
                    {selectedRange.start.getDate() !== new Date(selectedRange.end.getTime() - 1).getDate() &&
                      ` - ${format(new Date(selectedRange.end.getTime() - 1), 'MMM dd, yyyy')}`}
                  </span>
                )}
                <button className={styles.closeButton} onClick={() => setShowOverlay(false)}>×</button>
              </div>
              <div className={styles.agendaList}>
                {filteredEventsForOverlay.length > 0 ? (
                  filteredEventsForOverlay.map((evt, idx) => (
                    <div key={idx} className={styles.agendaItem}>
                      <div className={styles.timeBadge}>
                        {format(evt.start!, 'HH:mm')}
                      </div>
                      <div className={styles.eventDetails}>
                        <h3>{evt.title}</h3>
                        <p>{format(evt.start!, 'h:mm a')} - {format(evt.end!, 'h:mm a')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noEvents}>No events for this period.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
