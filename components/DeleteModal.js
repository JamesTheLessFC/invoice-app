import styles from "../styles/DeleteModal.module.scss";

export default function DeleteModal({
  hidden,
  handleCancelDeleteClick,
  deleteInvoice,
}) {
  return (
    <div className={`${styles.root} ${hidden ? styles.root_hidden : ""}`}>
      <h1>Confirm Deletion</h1>
      <p>
        Are you sure you want to delete invoice #XM9141? This action cannot be
        undone.
      </p>
      <div className={styles.actions}>
        <button onClick={handleCancelDeleteClick}>Cancel</button>
        <button onClick={deleteInvoice}>Delete</button>
      </div>
    </div>
  );
}
