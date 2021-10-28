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

export default function InvoicePage() {
  const router = useRouter();
  const { id } = router.query;
  const [session, loading] = useSession();
  const { data, error, isLoading } = useGetInvoiceByIdQuery(id);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showScreen, setShowScreen] = useState(false);
  const [hideToast, setHideToast] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  useEffect(() => {
    if (showToast) {
      setHideToast(false);
      setTimeout(() => {
        setHideToast(true);
      }, 2500);
    }
  }, [showToast]);

  useEffect(() => {
    if (hideToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 500);
    }
  }, [hideToast]);

  useEffect(() => {
    if (!showInvoiceForm) {
      setTimeout(() => {
        setShowScreen(false);
      }, 500);
    } else {
      setShowScreen(true);
    }
  }, [showInvoiceForm]);

  const handleEditInvoiceClick = () => {
    setShowInvoiceForm(true);
  };

  const hideInvoiceForm = () => {
    setShowInvoiceForm(false);
  };

  const showToastMessage = (type, message) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const closeToast = () => {
    setHideToast(true);
  };

  if (!session) {
    return <div>Loading session...</div>;
  }

  if (isLoading) {
    return <div className={styles.root}>Loading data...</div>;
  }

  if (error) {
    return <div className={styles.root}>Oops, an error occured</div>;
  }

  return (
    <div className={styles.root}>
      <AppBar user={session.user} />
      <Invoice
        data={data.invoice}
        handleEditInvoiceClick={handleEditInvoiceClick}
        showInvoiceForm={showInvoiceForm}
        showToastMessage={showToastMessage}
      />
      {showScreen && (
        <Screen>
          <InvoiceForm
            hideInvoiceForm={hideInvoiceForm}
            hidden={!showInvoiceForm}
            showToastMessage={showToastMessage}
            selectedInvoice={data.invoice}
          />
        </Screen>
      )}
      {showToast && (
        <Toast
          type={toastType}
          hideToast={hideToast}
          closeToast={closeToast}
          message={toastMessage}
        />
      )}
    </div>
  );
}
