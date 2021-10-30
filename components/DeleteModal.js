import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../styles/DeleteModal.module.scss";
import { useDeleteInvoiceByIdMutation } from "../services/invoice";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {
  hideDeleteModal,
  selectDeleteModal,
} from "../features/deleteModal/deleteModalSlice";

export default function DeleteModal({ invoiceId }) {
  const [
    deleteInvoiceById,
    {
      data: deletionResultData,
      isLoading: isDeleting,
      isSuccess: deleteSuccess,
      isError: deleteFailure,
    },
  ] = useDeleteInvoiceByIdMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const deleteModal = useSelector(selectDeleteModal);
  const deleteInvoice = () => {
    deleteInvoiceById(invoiceId);
  };

  return (
    <div
      className={`${styles.root} ${deleteModal.hide ? styles.root_hidden : ""}`}
    >
      <h1>
        <FontAwesomeIcon
          icon={
            deleteSuccess
              ? faCheckCircle
              : deleteFailure
              ? faExclamationCircle
              : faExclamationTriangle
          }
          className={`${styles.icon} ${
            deleteSuccess
              ? styles.icon_success
              : deleteFailure
              ? styles.icon_failure
              : ""
          }`}
        />
        <span>
          {deleteSuccess
            ? "Success!"
            : deleteFailure
            ? "Oops!"
            : "Confirm Deletion"}
        </span>
      </h1>
      <p>
        {deleteSuccess
          ? `Invoice #${deletionResultData.id
              .slice(-8)
              .toUpperCase()} has been deleted.`
          : deleteFailure
          ? `Something went wrong. Invoice #${invoiceId
              .slice(-8)
              .toUpperCase()} could not be deleted.`
          : `Are you sure you want to delete invoice #
        ${invoiceId.slice(-8).toUpperCase()}? This action cannot be undone.`}
      </p>
      <div className={styles.actions}>
        {deleteSuccess ? (
          <button
            className={styles.return}
            onClick={() => router.push("/invoices")}
          >
            Return to invoices
          </button>
        ) : (
          <>
            <button
              className={styles.cancel}
              onClick={() => dispatch(hideDeleteModal())}
            >
              Cancel
            </button>
            <button
              className={styles.delete}
              onClick={deleteInvoice}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : deleteFailure ? (
                "Try again"
              ) : (
                "Delete"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
