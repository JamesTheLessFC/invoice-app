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

export default function InvoicesPage() {
  const [session, loading] = useSession();
  const { data, error, isLoading } = useGetInvoicesQuery();
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showScreen, setShowScreen] = useState(false);
  const [hideToast, setHideToast] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

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

  const handleAddNewInvoiceClick = () => {
    setShowInvoiceForm(true);
  };

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

  // if (!session) {
  //   router.push("/");
  // }

  if (isLoading) {
    return <div className={styles.root}>Loading data...</div>;
  }

  if (error) {
    return <div className={styles.root}>Oops, an error occured</div>;
  }

  return (
    <div className={styles.root}>
      <AppBar user={session.user} />
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
            showToastMessage={showToastMessage}
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
