import styles from "../../styles/page.module.scss";
import Invoice from "../../components/Invoice";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/client";
import { useGetInvoiceByIdQuery } from "../../services/invoice";
import { useRouter } from "next/router";
import AppBar from "../../components/AppBar";
import Toast from "../../components/Toast";
import Screen from "../../components/Screen";
import InvoiceForm from "../../components/InvoiceForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  selectInvoiceForm,
  showInvoiceForm,
} from "../../features/invoiceForm/invoiceFormSlice";
import { selectToast, showToast } from "../../features/toast/toastSlice";
import { useDispatch, useSelector } from "react-redux";

export default function InvoicePage() {
  const router = useRouter();
  const { id } = router.query;
  const [session, loading] = useSession();
  const { data, error, isLoading } = useGetInvoiceByIdQuery(id);
  // const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  // const [showScreen, setShowScreen] = useState(false);
  // const [hideToast, setHideToast] = useState(true);
  // const [showToast, setShowToast] = useState(false);
  // const [toastMessage, setToastMessage] = useState("");
  // const [toastType, setToastType] = useState("");

  const toast = useSelector(selectToast);
  const invoiceForm = useSelector(selectInvoiceForm);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  // useEffect(() => {
  //   if (showToast) {
  //     setHideToast(false);
  //     setTimeout(() => {
  //       setHideToast(true);
  //     }, 2500);
  //   }
  // }, [showToast]);

  // useEffect(() => {
  //   if (hideToast) {
  //     setTimeout(() => {
  //       setShowToast(false);
  //     }, 500);
  //   }
  // }, [hideToast]);

  // useEffect(() => {
  //   if (!showInvoiceForm) {
  //     setTimeout(() => {
  //       setShowScreen(false);
  //     }, 500);
  //   } else {
  //     setShowScreen(true);
  //   }
  // }, [showInvoiceForm]);

  const handleEditInvoiceClick = () => {
    dispatch(showInvoiceForm());
  };

  // const hideInvoiceForm = () => {
  //   setShowInvoiceForm(false);
  // };

  // const showToastMessage = (type, message) => {
  //   setToastMessage(message);
  //   setToastType(type);
  //   setShowToast(true);
  // };

  // const closeToast = () => {
  //   setHideToast(true);
  // };

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
      <Invoice
        data={data.invoice}
        handleEditInvoiceClick={handleEditInvoiceClick}
      />
      {invoiceForm.open && (
        <Screen>
          <InvoiceForm invoice={data.invoice} />
        </Screen>
      )}
      {toast.active && <Toast />}
    </div>
  );
}
