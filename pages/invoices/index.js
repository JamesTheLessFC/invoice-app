import styles from "../../styles/page.module.scss";
import { useSession } from "next-auth/client";
import { useGetInvoicesQuery } from "../../services/invoice";
import AppBar from "../../components/AppBar";
import Invoices from "../../components/Invoices";
import { useEffect } from "react";
import InvoiceForm from "../../components/InvoiceForm";
import Screen from "../../components/Screen";
import Toast from "../../components/Toast";
import { useRouter } from "next/router";
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

export default function InvoicesPage({ page, filters }) {
  const [session, loading] = useSession();
  const router = useRouter();
  const toast = useSelector(selectToast);
  const invoiceForm = useSelector(selectInvoiceForm);
  const invoiceList = useSelector(selectInvoiceList);
  const dispatch = useDispatch();
  const { data, error, isFetching } = useGetInvoicesQuery({
    page: invoiceList.page,
    filters: invoiceList.filters,
  });

  // useEffect(() => {
  //   if (!session) {
  //     router.push("/");
  //   }
  // }, [session, router]);

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
      const maxPerPage = 2;
      const numPages = Math.ceil(data.count / maxPerPage);
      for (let i = 1; i <= numPages; i++) {
        pages.push(i);
      }
      dispatch(setPages(pages));
    }
  }, [data, dispatch]);

  if (isFetching) {
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
      <Invoices data={data.invoices} />
      {invoiceForm.open && (
        <Screen>
          <InvoiceForm />
        </Screen>
      )}
      {toast.active && <Toast />}
    </div>
  );
}
