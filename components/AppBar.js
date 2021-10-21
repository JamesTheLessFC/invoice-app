import styles from "../styles/AppBar.module.scss";
import Image from "next/image";
import logo from "../public/assets/logo.svg";
import avatar from "../public/assets/image-avatar.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";

export default function AppBar() {
  const router = useRouter();
  const isActive = (pathname) => router.pathname === pathname;

  const [session, loading] = useSession();

  return (
    <div className={styles.root}>
      <div className={styles.graphic_1}>&nbsp;</div>
      <div className={styles.graphic_2}>&nbsp;</div>
      <Image src={logo} alt="logo" />
      <div className={styles.align_right}>
        {loading ? (
          <p>Validating session...</p>
        ) : !session ? (
          <Link href="/api/auth/signin">
            <a data-active={isActive("/signup")}>Log In</a>
          </Link>
        ) : (
          <button onClick={() => signOut()}>Log Out</button>
        )}
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
