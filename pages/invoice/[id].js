import styles from "../../styles/page.module.scss";
import Invoice from "../../components/Invoice";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
import { useSelector, useDispatch } from "react-redux";
import { selectDarkMode } from "../../features/darkMode/darkModeSlice";
import Head from "../../components/Head";
import { setInvoiceId } from "../../features/invoice/invoiceSlice";

function InvoicePage({ router }) {
  const { id } = router.query;
  const [skip, setSkip] = useState(true);
  const { status } = useSession();
  const { data, error, isLoading, isUninitialized } = useGetInvoiceByIdQuery(
    id,
    { skip }
  );
  const darkMode = useSelector(selectDarkMode);
  const toast = useSelector(selectToast);
  const invoiceForm = useSelector(selectInvoiceForm);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
      setSkip(false);
    }
  }, [id]);

  useEffect(() => {
    if (data && data.invoice) {
      dispatch(setInvoiceId(data.invoice.id));
    }
  }, [dispatch, data]);

  if (isLoading || isUninitialized) {
    return (
      <>
        <Head title="Loading..." />
        <div
          className={`${styles.root} ${styles.root_no_content} ${
            darkMode.on ? styles.root_dark : ""
          }`}
        >
          <AppBar />
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className={styles.spinner_icon}
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head title="Error" />
        <div
          className={`${styles.root} ${styles.root_no_content} ${
            darkMode.on ? styles.root_dark : ""
          }`}
        >
          <AppBar />
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className={styles.error_icon}
          />
          <h3>Oops! Something went wrong.</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title={`Invoice #${data.invoice.id.slice(-8).toUpperCase()}`} />
      <div className={`${styles.root} ${darkMode.on ? styles.root_dark : ""}`}>
        <AppBar />
        <Invoice data={data.invoice} />
        {invoiceForm.open && (
          <Screen>
            <InvoiceForm invoice={data.invoice} />
          </Screen>
        )}
        {toast.active && <Toast />}
      </div>
    </>
  );
}

export default withRouter(InvoicePage);
