import InvoiceList from "../components/InvoiceList";
//import data from "../data.json";
import InvoicesHeader from "../components/InvoicesHeader";
import { useState, useEffect } from "react";
import EmptyMessage from "./EmptyMessage";
import styles from "../styles/Invoices.module.scss";
import InvoiceForm from "./InvoiceForm";
import Screen from "./Screen";

export default function Invoices({
  data,
  selectInvoice,
  handleAddNewInvoiceClick,
  showInvoiceForm,
}) {
  const filterOptions = ["paid", "pending", "draft"];
  const [filter, setFilter] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState(data);
  // const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  // const [showScreen, setShowScreen] = useState(false);

  // useEffect(() => {
  //   if (!showInvoiceForm) {
  //     setTimeout(() => {
  //       setShowScreen(false);
  //     }, 500);
  //   } else {
  //     setShowScreen(true);
  //   }
  // }, [showInvoiceForm]);

  useEffect(() => {
    if (filter.length > 0) {
      setFilteredInvoices(
        data.filter((invoice) => filter.includes(invoice.status))
      );
    } else {
      setFilteredInvoices(data);
    }
  }, [filter, data]);

  // const handleAddNewInvoiceClick = () => {
  //   setShowInvoiceForm(true);
  // };

  // const handleDiscardNewInvoiceClick = () => {
  //   setShowInvoiceForm(false);
  // };

  const handleFilterSelect = (e, selectedStatus) => {
    e.stopPropagation();
    setFilter((prevState) => {
      if (!prevState.includes(selectedStatus)) {
        return [...prevState, selectedStatus];
      } else {
        return prevState.filter((status) => status !== selectedStatus);
      }
    });
  };

  return (
    <div
      className={`${styles.root} ${
        showInvoiceForm ? styles.root_with_invoice_form : ""
      }`}
    >
      <InvoicesHeader
        filterOptions={filterOptions}
        filter={filter}
        handleFilterSelect={handleFilterSelect}
        invoiceCount={filteredInvoices.length}
        showInvoiceForm={showInvoiceForm}
        handleAddNewInvoiceClick={handleAddNewInvoiceClick}
      />
      <InvoiceList
        data={filteredInvoices}
        selectInvoice={selectInvoice}
        showInvoiceForm={showInvoiceForm}
      />
      {filteredInvoices.length === 0 && <EmptyMessage />}
    </div>
  );
}
