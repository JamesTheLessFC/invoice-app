import styles from "../styles/page.module.scss";
import AppBar from "../components/AppBar";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import { SignInMessage } from "../components/SignInMessage";
import router from "next/router";
import { useSelector } from "react-redux";
import { selectInvoiceList } from "../features/invoiceList/invoiceListSlice";
import Head from "../components/Head";
import { selectInvoice } from "../features/invoice/invoiceSlice";

export default function Home() {
  const [session, loading] = useSession();
  const invoiceList = useSelector(selectInvoiceList);
  const invoice = useSelector(selectInvoice);

  useEffect(() => {
    if (session) {
      const selectedFilters = invoiceList.filters;
      const page = invoiceList.page;
      const invoiceId = invoice.id;

      if (invoiceId) {
        router.push(`/invoice/${invoiceId}`);
      } else {
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
      }
    }
  }, [session, invoiceList.filters, invoiceList.page, invoice.id]);

  if (!session) {
    return (
      <>
        <Head title="Home" />
        <div className={styles.root}>
          <AppBar />
          <SignInMessage />
        </div>
      </>
    );
  }

  return (
    <>
      <Head title="Redirecting..." />
      <div className={styles.root}>
        <AppBar />
      </div>
    </>
  );
}
