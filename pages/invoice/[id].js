import styles from "../../styles/page.module.scss";
import Invoice from "../../components/Invoice";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import { useGetInvoiceByIdQuery } from "../../services/invoice";
import { withRouter } from "next/router";
import AppBar from "../../components/AppBar";
import Toast from "../../components/Toast";
import Screen from "../../components/Screen";
import InvoiceForm from "../../components/InvoiceForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { selectInvoiceForm } from "../../features/invoiceForm/invoiceFormSlice";
import { selectToast } from "../../features/toast/toastSlice";
import { useSelector } from "react-redux";

function InvoicePage({ router }) {
  const { id } = router.query;
  const [session, loading] = useSession();
  const { data, error, isLoading } = useGetInvoiceByIdQuery(id);

  const toast = useSelector(selectToast);
  const invoiceForm = useSelector(selectInvoiceForm);

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  if (isLoading) {
    return (
      <div className={`${styles.root} ${styles.root_no_content}`}>
        <AppBar />
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className={styles.spinner_icon}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.root} ${styles.root_no_content}`}>
        <AppBar />
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className={styles.error_icon}
        />
        <h3>Oops! Something went wrong.</h3>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <AppBar />
      <Invoice data={data.invoice} />
      {invoiceForm.open && (
        <Screen>
          <InvoiceForm invoice={data.invoice} />
        </Screen>
      )}
      {toast.active && <Toast />}
    </div>
  );
}

export default withRouter(InvoicePage);
