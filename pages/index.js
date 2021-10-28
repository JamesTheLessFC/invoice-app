import styles from "../styles/Home.module.scss";
import AppBar from "../components/AppBar";
import Invoices from "../components/Invoices";
import Invoice from "../components/Invoice";
import { useState, useEffect } from "react";
import InvoiceForm from "../components/InvoiceForm";
import Screen from "../components/Screen";
import prisma from "../lib/prisma";
import { getSession, useSession } from "next-auth/client";
import { SignInMessage } from "../components/SignInMessage";
import Toast from "../components/Toast";
import { useGetInvoicesQuery } from "../services/invoice";

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    return { props: { invoices: [], user: null } };
  }

  const user = session.user;

  const invoicesData = await prisma.invoice.findMany({
    where: {
      user: { email: session.user.email },
    },
    include: {
      items: true,
    },
  });
  const invoices = invoicesData.map((invoice) => ({
    ...invoice,
    total:
      invoice.items.length > 1
        ? invoice.items.reduce(
            (a, b) => a.price * a.quantity + b.price * b.quantity
          )
        : invoice.items.length === 1
        ? invoice.items[0].price * invoice.items[0].quantity
        : 0,
    paymentDue: new Date(
      invoice.invoiceDate.getTime() + invoice.paymentTerms * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-US", { dateStyle: "medium" }),
    invoiceDate: invoice.invoiceDate.toLocaleDateString("en-US", {
      dateStyle: "medium",
    }),
    status: invoice.status.toLowerCase(),
    items: invoice.items.map((item) => ({
      ...item,
      total: item.price * item.quantity,
    })),
  }));
  return {
    props: { invoices, user },
  };
};

export default function Home({ invoices, user }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showScreen, setShowScreen] = useState(false);
  const [hideToast, setHideToast] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const { data, error, isLoading } = useGetInvoicesQuery();

  useEffect(() => {
    if (showToast) {
      setHideToast(false);
      setTimeout(() => {
        setHideToast(true);
      }, 2500);
    }
  }, [showToast]);

  useEffect(() => {
    if (hideToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 500);
    }
  }, [hideToast]);

  useEffect(() => {
    if (!showInvoiceForm) {
      setTimeout(() => {
        setShowScreen(false);
      }, 500);
    } else {
      setShowScreen(true);
    }
  }, [showInvoiceForm]);

  const handleAddNewInvoiceClick = () => {
    setShowInvoiceForm(true);
  };

  const handleEditInvoiceClick = () => {
    setShowInvoiceForm(true);
  };

  const hideInvoiceForm = () => {
    setShowInvoiceForm(false);
  };

  const selectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const deselectInvoice = () => {
    setSelectedInvoice(null);
  };

  const showToastMessage = (type, message) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const closeToast = () => {
    setHideToast(true);
  };

  if (!user) {
    return (
      <div className={styles.root}>
        <AppBar user={user} />
        <SignInMessage />
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops, an error occured</div>;
  }

  return (
    <div className={styles.root}>
      <AppBar user={user} />
      {!selectedInvoice && (
        <Invoices
          data={data.invoices}
          selectInvoice={selectInvoice}
          handleAddNewInvoiceClick={handleAddNewInvoiceClick}
          showInvoiceForm={showInvoiceForm}
        />
      )}
      {selectedInvoice && (
        <Invoice
          data={selectedInvoice}
          deselectInvoice={deselectInvoice}
          handleEditInvoiceClick={handleEditInvoiceClick}
          showInvoiceForm={showInvoiceForm}
          showToastMessage={showToastMessage}
        />
      )}
      {showScreen && (
        <Screen>
          <InvoiceForm
            hideInvoiceForm={hideInvoiceForm}
            hidden={!showInvoiceForm}
            selectedInvoice={selectedInvoice}
            showToastMessage={showToastMessage}
          />
        </Screen>
      )}
      {showToast && (
        <Toast
          type={toastType}
          hideToast={hideToast}
          closeToast={closeToast}
          message={toastMessage}
        />
      )}
    </div>
  );
}
