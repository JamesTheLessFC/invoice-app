import styles from "../styles/ModalScreen.module.scss";

export default function ModalScreen({ children }) {
  return <div className={styles.root}>{children}</div>;
}
