import styles from "../styles/Home.module.scss";
import AppBar from "../components/AppBar";
import Invoices from "../components/Invoices";
import Invoice from "../components/Invoice";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectInvoices } from "../features/invoices/invoicesSlice";
import InvoiceForm from "../components/InvoiceForm";
import Screen from "../components/Screen";

export default function Home() {
  const invoices = useSelector(selectInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showScreen, setShowScreen] = useState(false);

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

  const handleDiscardNewInvoiceClick = () => {
    setShowInvoiceForm(false);
  };

  const selectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const deselectInvoice = () => {
    setSelectedInvoice(null);
  };

  return (
    <div className={styles.root}>
      <AppBar />
      {!selectedInvoice && (
        <Invoices
          data={invoices}
          selectInvoice={selectInvoice}
          handleAddNewInvoiceClick={handleAddNewInvoiceClick}
          showInvoiceForm={showInvoiceForm}
        />
      )}
      {selectedInvoice && (
        <Invoice
          data={selectedInvoice}
          deselectInvoice={deselectInvoice}
          handleEditInvoiceClick={handleEditInvoiceClick}
        />
      )}
      {showScreen && (
        <Screen>
          <InvoiceForm
            handleDiscardNewInvoiceClick={handleDiscardNewInvoiceClick}
            hidden={!showInvoiceForm}
            selectedInvoice={selectedInvoice}
          />
        </Screen>
      )}
    </div>
  );
}
