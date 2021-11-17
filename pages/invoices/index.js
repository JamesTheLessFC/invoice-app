import styles from "../../styles/page.module.scss";
import { useSession } from "next-auth/react";
import { useGetInvoicesQuery } from "../../services/invoice";
import AppBar from "../../components/AppBar";
import Invoices from "../../components/Invoices";
import { useEffect } from "react";
import InvoiceForm from "../../components/InvoiceForm";
import Screen from "../../components/Screen";
import Toast from "../../components/Toast";
import { withRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { selectToast } from "../../features/toast/toastSlice";
import { selectInvoiceForm } from "../../features/invoiceForm/invoiceFormSlice";
import {
  selectInvoiceList,
  setFilters,
  setInvoiceCount,
  setPage,
  setPages,
} from "../../features/invoiceList/invoiceListSlice";
import { arraysAreEqual } from "../../util/helperFunctions";
import { selectDarkMode } from "../../features/darkMode/darkModeSlice";
import Head from "../../components/Head";
import {
  selectInvoice,
  setInvoiceId,
} from "../../features/invoice/invoiceSlice";

export async function getServerSideProps({ query }) {
  const pageString = query.page;
  const filter = query.filter ? query.filter : null;
  let filters = [];
  if (filter) {
    filters = filter.split(",");
  }
  return {
    props: { page: Number(pageString), filters },
  };
}

function InvoicesPage({ page, filters, router }) {
  const { status } = useSession();
  const toast = useSelector(selectToast);
  const invoiceForm = useSelector(selectInvoiceForm);
  const invoiceList = useSelector(selectInvoiceList);
  const dispatch = useDispatch();
  const { data, error, isFetching } = useGetInvoicesQuery({
    page: invoiceList.page,
    filters: invoiceList.filters,
  });
  const darkMode = useSelector(selectDarkMode);
  const invoice = useSelector(selectInvoice);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (invoice.id !== "") {
      dispatch(setInvoiceId(""));
    }
  }, [dispatch, invoice.id]);

  useEffect(() => {
    if (!arraysAreEqual(filters, invoiceList.filters)) {
      dispatch(setFilters(filters));
    }
  }, [invoiceList.filters, filters, dispatch]);

  useEffect(() => {
    if (page !== invoiceList.page) {
      dispatch(setPage(page));
    }
  }, [dispatch, invoiceList.page, page]);

  useEffect(() => {
    if (data?.count) {
      dispatch(setInvoiceCount(data.count));
      let pages = [];
      const maxPerPage = invoiceList.maxPerPage;
      const numPages = Math.ceil(data.count / maxPerPage);
      for (let i = 1; i <= numPages; i++) {
        pages.push(i);
      }
      dispatch(setPages(pages));
    }
  }, [data, dispatch, invoiceList.maxPerPage]);

  if (isFetching) {
    return (
      <>
        <Head title="Loading..." />
        <div
          className={`${styles.root} ${styles.root_no_content} ${
            darkMode.on ? styles.root_dark : ""
          }`}
        >
          <AppBar />
          <FontAwesomeIcon
            icon={faSpinner}
            pulse
            className={styles.spinner_icon}
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head title="Error" />
        <div
          className={`${styles.root} ${styles.root_no_content} ${
            darkMode.on ? styles.root_dark : ""
          }`}
        >
          <AppBar />
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className={styles.error_icon}
          />
          <h3>Oops! Something went wrong.</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Invoices" />
      <div className={`${styles.root} ${darkMode.on ? styles.root_dark : ""}`}>
        <AppBar />
        <Invoices data={data.invoices} />
        {invoiceForm.open && (
          <Screen>
            <InvoiceForm />
          </Screen>
        )}
        {toast.active && <Toast />}
      </div>
    </>
  );
}

export default withRouter(InvoicesPage);
