import styles from "../styles/AppBar.module.scss";
import Image from "next/image";
import logo from "../public/assets/logo.svg";
import avatar from "../public/assets/image-avatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-solid-svg-icons";

export default function AppBar() {
  return (
    <div className={styles.root}>
      <div className={styles.graphic_1}>&nbsp;</div>
      <div className={styles.graphic_2}>&nbsp;</div>
      <Image src={logo} alt="logo" />
      <div className={styles.align_right}>
        <button>
          <FontAwesomeIcon icon={faMoon} className={styles.icon} />
        </button>
        <div className={styles.divider}>&nbsp;</div>
        <Image
          src={avatar}
          alt="avatar"
          width={32}
          height={32}
          className={styles.avatar}
        />
      </div>
    </div>
  );
}
