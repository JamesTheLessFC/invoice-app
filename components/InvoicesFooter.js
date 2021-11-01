import styles from "../styles/InvoicesFooter.module.scss";
import { useSelector } from "react-redux";
import { selectInvoiceList } from "../features/invoiceList/invoiceListSlice";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function InvoicesFooter() {
  const invoiceList = useSelector(selectInvoiceList);
  const router = useRouter();
  const maxPageLinks = 5;
  const pageLinkMaxDiff = Math.floor(maxPageLinks / 2);

  const navigateToPage = (page) => {
    const selectedFilters = invoiceList.filters;
    router.push(
      `/invoices?${
        selectedFilters.length > 0
          ? `filter=${
              selectedFilters.length > 1
                ? selectedFilters.join(",")
                : selectedFilters[0]
            }&`
          : ""
      }page=${page}`
    );
  };

  return (
    <div className={styles.root}>
      <button
        disabled={invoiceList.page === 1}
        onClick={() => navigateToPage(invoiceList.page - 1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className={styles.page_link_buttons}>
        {invoiceList.pages.length >= maxPageLinks &&
          invoiceList.page - pageLinkMaxDiff > 1 && <p>...</p>}
        {invoiceList.pages
          .filter((pageNum) =>
            invoiceList.page <= pageLinkMaxDiff
              ? pageNum <= pageLinkMaxDiff * 2 + 1
              : invoiceList.page > invoiceList.pages.length - pageLinkMaxDiff
              ? pageNum >= invoiceList.pages.length - pageLinkMaxDiff * 2
              : Math.abs(pageNum - invoiceList.page) <= pageLinkMaxDiff
          )
          .map((pageNum) => (
            <button
              key={pageNum}
              className={pageNum === invoiceList.page ? styles.active : ""}
              onClick={() => navigateToPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}
        {invoiceList.pages.length >= maxPageLinks &&
          invoiceList.page + pageLinkMaxDiff < invoiceList.pages.length && (
            <p>...</p>
          )}
      </div>
      <button
        disabled={!(invoiceList.page * 2 < invoiceList.invoiceCount)}
        onClick={() => navigateToPage(invoiceList.page + 1)}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
}
