import styles from "../styles/AppBar.module.scss";
import Image from "next/image";
import logo from "../public/assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faUserCircle,
  faSignInAlt,
  faSignOutAlt,
  faSpinner,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  toggleDarkMode,
  selectDarkMode,
} from "../features/darkMode/darkModeSlice";
import { useSelector, useDispatch } from "react-redux";

export default function AppBar() {
  const { status, data: session } = useSession();
  const darkMode = useSelector(selectDarkMode);
  const dispatch = useDispatch();

  return (
    <div className={styles.root}>
      <div className={styles.graphic_1}>&nbsp;</div>
      <div className={styles.graphic_2}>&nbsp;</div>
      <Image src={logo} alt="logo" />
      <div className={styles.align_right}>
        <button onClick={() => dispatch(toggleDarkMode())}>
          <FontAwesomeIcon
            icon={darkMode.on ? faSun : faMoon}
            className={`${styles.icon} ${!darkMode.on ? styles.icon_moon : ""}`}
          />
        </button>
        <div className={styles.divider}>&nbsp;</div>
        <div className={styles.avatar_name_container}>
          {status === "authenticated" && session.user.image ? (
            <Image
              src={session.user.image}
              alt="avatar"
              width={32}
              height={32}
              className={styles.avatar}
            />
          ) : (
            <FontAwesomeIcon icon={faUserCircle} className={styles.icon} />
          )}
          {status === "authenticated" ? (
            <p className={styles.name}>
              {session.user.name || session.user.email}
            </p>
          ) : (
            <p className={styles.name}>Signed Out</p>
          )}
        </div>
        <div className={styles.divider}>&nbsp;</div>
        {status === "loading" ? (
          <FontAwesomeIcon icon={faSpinner} pulse className={styles.icon} />
        ) : status === "unauthenticated" ? (
          <Link href="/api/auth/signin">
            <a>
              <FontAwesomeIcon icon={faSignInAlt} className={styles.icon} />
            </a>
          </Link>
        ) : (
          <button onClick={() => signOut()}>
            <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
          </button>
        )}
      </div>
    </div>
  );
}
