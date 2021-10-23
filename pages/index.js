import styles from "../styles/Home.module.scss";
import AppBar from "../components/AppBar";
import Invoices from "../components/Invoices";
import Invoice from "../components/Invoice";
import { useState, useEffect } from "react";
import InvoiceForm from "../components/InvoiceForm";
import Screen from "../components/Screen";
import prisma from "../lib/prisma";
import { useSession, getSession } from "next-auth/client";

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    return { props: { invoices: [] } };
  }

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
    props: { invoices },
  };
};

export default function Home({ invoices }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showScreen, setShowScreen] = useState(false);

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

  const handleDiscardNewInvoiceClick = () => {
    setShowInvoiceForm(false);
  };

  const selectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const deselectInvoice = () => {
    setSelectedInvoice(null);
  };

  return (
    <div className={styles.root}>
      <AppBar />
      {!selectedInvoice && (
        <Invoices
          data={invoices}
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
        />
      )}
      {showScreen && (
        <Screen>
          <InvoiceForm
            handleDiscardNewInvoiceClick={handleDiscardNewInvoiceClick}
            hidden={!showInvoiceForm}
            selectedInvoice={selectedInvoice}
          />
        </Screen>
      )}
    </div>
  );
}
