import styles from "../styles/EmptyMessage.module.scss";
import Image from "next/image";
import EmptyGraphic from "../public/assets/illustration-empty.svg";
import { useSelector } from "react-redux";
import { selectDarkMode } from "../features/darkMode/darkModeSlice";

export default function EmptyMessage() {
  const darkMode = useSelector(selectDarkMode);
  return (
    <div className={`${styles.root} ${darkMode.on ? styles.root_dark : ""}`}>
      <Image src={EmptyGraphic} alt="empty invoice list" />
      <h2>There is nothing here</h2>
      <p>
        To get started, create an invoice by clicking the &apos;Add&apos; button
      </p>
    </div>
  );
}
