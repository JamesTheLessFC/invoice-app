import styles from "../styles/CustomDatePicker.module.scss";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "react-calendar";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function CustomDatePicker({ date, handleDateChange, error }) {
  const [hideCalendar, setHideCalendar] = useState(true);

  useEffect(() => {
    if (!hideCalendar) {
      const handleOutsideClick = (e) => {
        if (
          typeof e.target.className === "string" &&
          e.target.className.split(" ")[0] ===
            "react-calendar__navigation__arrow"
        ) {
          return;
        } else {
          setHideCalendar(true);
        }
      };
      setTimeout(() => {
        window.addEventListener("click", handleOutsideClick);
      }, 0);
      return () => {
        window.removeEventListener("click", handleOutsideClick);
      };
    }
  }, [hideCalendar]);

  const toggleCalendarVisibility = (e) => {
    e.preventDefault();
    setHideCalendar((prevState) => {
      return !prevState;
    });
  };

  return (
    <div
      className={`${styles.root} ${hideCalendar ? "" : styles.root_focused} ${
        error ? styles.root_with_error : ""
      }`}
    >
      <span>
        {date.toLocaleDateString("en-US", {
          dateStyle: "medium",
        })}
      </span>
      <button className={styles.button} onClick={toggleCalendarVisibility}>
        <FontAwesomeIcon icon={faCalendar} />
      </button>
      <Calendar
        className={`${styles.calendar} ${
          hideCalendar ? styles.calendar_hidden : ""
        }`}
        nextLabel={
          <FontAwesomeIcon icon={faChevronRight} className={styles.chevron} />
        }
        prevLabel={
          <FontAwesomeIcon icon={faChevronLeft} className={styles.chevron} />
        }
        next2Label={null}
        prev2Label={null}
        minDetail="month"
        value={date}
        onChange={handleDateChange}
        //showNeighboringMonth={false}
      />
    </div>
  );
}
