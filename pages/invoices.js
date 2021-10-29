import styles from "../styles/page.module.scss";
import { useSession } from "next-auth/client";
import { useGetInvoicesQuery } from "../services/invoice";
import AppBar from "../components/AppBar";
import Invoices from "../components/Invoices";
import { useState, useEffect } from "react";
import InvoiceForm from "../components/InvoiceForm";
import Screen from "../components/Screen";
import Toast from "../components/Toast";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  selectToast,
  showToast,
  hideToast,
} from "../features/toast/toastSlice";

export default function InvoicesPage() {
  const [session, loading] = useSession();
  const { data, error, isLoading } = useGetInvoicesQuery();
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showScreen, setShowScreen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useSelector(selectToast);

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    if (!showInvoiceForm) {
      setTimeout(() => {
        setShowScreen(false);
      }, 500);
    } else {
      setShowScreen(true);
    }
  }, [showInvoiceForm]);

  const handleAddNewInvoiceClick = () => {
    setShowInvoiceForm(true);
  };

  const hideInvoiceForm = () => {
    setShowInvoiceForm(false);
  };

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
      <Invoices
        data={data.invoices}
        handleAddNewInvoiceClick={handleAddNewInvoiceClick}
        showInvoiceForm={showInvoiceForm}
      />
      {showScreen && (
        <Screen>
          <InvoiceForm
            hideInvoiceForm={hideInvoiceForm}
            hidden={!showInvoiceForm}
          />
        </Screen>
      )}
      {toast.active && (
        <Toast
          type={toast.type}
          hideToast={toast.hide}
          closeToast={() => dispatch(hideToast())}
          message={toast.message}
        />
      )}
    </div>
  );
}
