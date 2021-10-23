import styles from "../styles/AppBar.module.scss";
import Image from "next/image";
import logo from "../public/assets/logo.svg";
import avatar from "../public/assets/image-avatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faUserCircle,
  faSignInAlt,
  faSignOutAlt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";

export default function AppBar({ user }) {
  const router = useRouter();
  const isActive = (pathname) => router.pathname === pathname;

  const [session, loading] = useSession();

  return (
    <div className={styles.root}>
      <div className={styles.graphic_1}>&nbsp;</div>
      <div className={styles.graphic_2}>&nbsp;</div>
      <Image src={logo} alt="logo" />
      <div className={styles.align_right}>
        <button>
          <FontAwesomeIcon
            icon={faMoon}
            className={`${styles.icon} ${styles.icon_moon}`}
          />
        </button>
        <div className={styles.divider}>&nbsp;</div>
        <div className={styles.avatar_name_container}>
          {user?.image ? (
            <Image
              src={user.image}
              alt="avatar"
              width={32}
              height={32}
              className={styles.avatar}
            />
          ) : (
            <FontAwesomeIcon icon={faUserCircle} className={styles.icon} />
          )}
          {user ? <p className={styles.name}>{user.name || user.login}</p> : ""}
        </div>
        <div className={styles.divider}>&nbsp;</div>
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} className={styles.icon} />
        ) : !session ? (
          <Link href="/api/auth/signin">
            <a data-active={isActive("/signup")}>
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
