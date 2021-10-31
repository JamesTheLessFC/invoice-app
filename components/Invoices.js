import InvoiceList from "../components/InvoiceList";
import InvoicesHeader from "../components/InvoicesHeader";
import EmptyMessage from "./EmptyMessage";
import styles from "../styles/Invoices.module.scss";
import { useSelector } from "react-redux";
import { selectInvoiceForm } from "../features/invoiceForm/invoiceFormSlice";

export default function Invoices({ data }) {
  const invoiceForm = useSelector(selectInvoiceForm);

  return (
    <div
      className={`${styles.root} ${
        invoiceForm.open ? styles.root_with_invoice_form : ""
      }`}
    >
      <InvoicesHeader />
      <InvoiceList data={data} />
      {data.length === 0 && <EmptyMessage />}
    </div>
  );
}
