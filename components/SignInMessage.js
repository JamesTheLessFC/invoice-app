import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/SignInMessage.module.scss";
import Link from "next/link";

export function SignInMessage() {
  return (
    <div className={styles.root}>
      <FontAwesomeIcon icon={faLock} className={styles.icon} />
      <h2>You are not signed in</h2>
      <p>
        Please{" "}
        <Link href="/api/auth/signin">
          <a>sign in</a>
        </Link>{" "}
        to get started
      </p>
    </div>
  );
}
