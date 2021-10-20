import styles from "../styles/InvoiceList.module.scss";
import InvoiceListItem from "./InvoiceListItem";

export default function InvoiceList({ data, selectInvoice, showInvoiceForm }) {
  return (
    <ul
      className={`${styles.root} ${
        showInvoiceForm ? styles.root_with_form : ""
      }`}
    >
      {data.map((invoice) => (
        <InvoiceListItem
          key={invoice.id}
          data={invoice}
          selectInvoice={selectInvoice}
        />
      ))}
    </ul>
  );
}
