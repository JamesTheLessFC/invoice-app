import InvoiceList from "../components/InvoiceList";
import InvoicesHeader from "../components/InvoicesHeader";
import { useState, useEffect } from "react";
import EmptyMessage from "./EmptyMessage";
import styles from "../styles/Invoices.module.scss";
import { useSelector } from "react-redux";
import { selectInvoiceForm } from "../features/invoiceForm/invoiceFormSlice";

export default function Invoices({ data }) {
  const filterOptions = ["paid", "pending", "draft"];
  const [filter, setFilter] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState(data);
  const invoiceForm = useSelector(selectInvoiceForm);

  useEffect(() => {
    if (filter.length > 0) {
      // setFilteredInvoices(
      //   data
      //     .filter((invoice) => filter.includes(invoice.status))
      //     .sort((a, b) => new Date(a.paymentDue) - new Date(b.paymentDue))
      // );
      setFilteredInvoices(
        data.filter((invoice) => filter.includes(invoice.status))
      );
    } else {
      // setFilteredInvoices(
      //   [...data].sort(
      //     (a, b) => new Date(a.paymentDue) - new Date(b.paymentDue)
      //   )
      // );
      setFilteredInvoices(data);
    }
  }, [filter, data]);

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
        invoiceForm.open ? styles.root_with_invoice_form : ""
      }`}
    >
      <InvoicesHeader
        filterOptions={filterOptions}
        filter={filter}
        handleFilterSelect={handleFilterSelect}
        invoiceCount={filteredInvoices.length}
      />
      <InvoiceList data={filteredInvoices} />
      {filteredInvoices.length === 0 && <EmptyMessage />}
    </div>
  );
}
