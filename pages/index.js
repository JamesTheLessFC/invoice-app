import styles from "../styles/page.module.scss";
import AppBar from "../components/AppBar";
import { useEffect } from "react";
import { useSession } from "next-auth/client";
import { SignInMessage } from "../components/SignInMessage";
import router from "next/router";
import { useSelector } from "react-redux";
import { selectInvoiceList } from "../features/invoiceList/invoiceListSlice";

export default function Home() {
  const [session, loading] = useSession();
  const invoiceList = useSelector(selectInvoiceList);

  useEffect(() => {
    if (session) {
      const selectedFilters = invoiceList.filters;
      const page = invoiceList.page;
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
  }, [session, invoiceList.filters, invoiceList.page]);

  if (!session) {
    return (
      <div className={styles.root}>
        <AppBar />
        <SignInMessage />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <AppBar />
    </div>
  );
}
