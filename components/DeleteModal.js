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
import { selectInvoiceList } from "../features/invoiceList/invoiceListSlice";
import { selectDarkMode } from "../features/darkMode/darkModeSlice";

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
  const invoiceList = useSelector(selectInvoiceList);
  const darkMode = useSelector(selectDarkMode);

  const deleteInvoice = () => {
    deleteInvoiceById(invoiceId);
  };
  const returnToInvoices = () => {
    dispatch(hideDeleteModal());
    const selectedFilters = invoiceList.filters;
    const page = invoiceList.page;
    router.push(
      `/invoices?${
        selectedFilters.length > 0
          ? `filter=${
              selectedFilters.length > 1
                ? selectedFilters.join(",")
                : selectedFilters[0]
            }&`
          : ""
      }page=${page}`
    );
  };

  return (
    <div
      className={`${styles.root} ${
        deleteModal.hidden ? styles.root_hidden : ""
      } ${darkMode.on ? styles.root_dark : ""}`}
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
      <p className={styles.body}>
        {deleteSuccess
          ? `Invoice #${deletionResultData.id
              .slice(-8)
              .toUpperCase()} has been deleted.`
          : deleteFailure
          ? `Something went wrong. Invoice #${invoiceId
              .slice(-8)
              .toUpperCase()} could not be deleted.`
          : `Are you sure you want to delete Invoice #${invoiceId
              .slice(-8)
              .toUpperCase()}? This action cannot be undone.`}
      </p>
      <div className={styles.actions}>
        {deleteSuccess ? (
          <button className={styles.return} onClick={returnToInvoices}>
            Return to invoices
          </button>
        ) : (
          <>
            <button
              className={styles.cancel}
              onClick={() => dispatch(hideDeleteModal())}
              disabled={isDeleting}
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
