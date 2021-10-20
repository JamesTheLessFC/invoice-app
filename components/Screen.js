import styles from "../styles/Screen.module.scss";

export default function Screen({ children }) {
  return <div className={styles.root}>{children}</div>;
}
