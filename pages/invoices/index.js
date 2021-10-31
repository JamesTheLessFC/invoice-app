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
import { selectInvoiceList } from "../../features/invoiceList/invoiceListSlice";

export async function getServerSideProps({ query }) {
  const pageString = query.page;
  const filter = query.filter ? query.filter : null;
  let filters = [];
  if (filter) {
    filters = filter.split(",").map((status) => status.toUpperCase());
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
  const { data, error, isFetching } = useGetInvoicesQuery({ page, filters });
  const invoiceList = useSelector(selectInvoiceList);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

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
      <div>
        <button disabled={page === 1} onClick={() => navigateToPage(page - 1)}>
          Previous
        </button>
        <button
          disabled={!(page * 2 < data.count)}
          onClick={() => navigateToPage(page + 1)}
        >
          Next
        </button>
      </div>
      {invoiceForm.open && (
        <Screen>
          <InvoiceForm />
        </Screen>
      )}
      {toast.active && <Toast />}
    </div>
  );
}
