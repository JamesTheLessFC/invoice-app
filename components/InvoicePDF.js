import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Spartan",
  fonts: [
    {
      src: "/fonts/Spartan-Light.ttf",
      fontStyle: "normal",
      fontWeight: 300,
    },
    {
      src: "/fonts/Spartan-Regular.ttf",
      fontStyle: "normal",
      fontWeight: 400,
    },
    {
      src: "/fonts/Spartan-Medium.ttf",
      fontStyle: "normal",
      fontWeight: 500,
    },
    {
      src: "/fonts/Spartan-SemiBold.ttf",
      fontStyle: "normal",
      fontWeight: 600,
    },
    {
      src: "/fonts/Spartan-Bold.ttf",
      fontStyle: "normal",
      fontWeight: 700,
    },
  ],
});

const blueGray = "#7e88c3";
const lightGray = "#f9fafe";
const darkGray = "#373b53";
const white = "#ffffff";

const styles = StyleSheet.create({
  page: {
    padding: "50px",
    fontFamily: "Spartan",
    fontSize: "12px",
    letterSpacing: "-0.25px",
    fontWeight: 500,
    lineHeight: "1.5px",
  },
  id: {
    fontSize: "18px",
    fontWeight: 700,
  },
  description: {
    marginTop: "4px",
    fontSize: "15px",
    color: blueGray,
  },
  label: {
    color: blueGray,
    marginBottom: "4px",
  },
  hash: {
    color: blueGray,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "32px",
  },
  sender_name: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: "16px",
    //color: blueGray,
  },
  sender_address: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    //color: blueGray,
  },
  invoice_date: {
    //fontWeight: 600,
  },
  payment_due_view: {
    marginVertical: "16px",
  },
  payment_due: {
    //fontWeight: 600,
  },
  client_email: {
    //fontWeight: 600,
  },
  client_name_view: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: "16px",
  },
  client_name: {
    //fontWeight: 600,
  },
  client_address: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  breakdown: {
    backgroundColor: lightGray,
  },
  item_headings: {
    color: blueGray,
    paddingTop: "16px",
    borderBottom: "1px solid " + blueGray,
    marginBottom: "16px",
  },
  item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "16px",
    paddingBottom: "16px",
  },
  item_name: {
    width: "40%",
  },
  item_quantity: {
    width: "10%",
    textAlign: "right",
  },
  item_price: {
    width: "25%",
    textAlign: "right",
  },
  item_total: {
    width: "25%",
    textAlign: "right",
  },
  total_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "16px",
    backgroundColor: darkGray,
    color: white,
    alignItems: "center",
    paddingVertical: "16px",
    fontWeight: 700,
  },
  total: {
    fontSize: "18px",
  },
});

export default function InvoicePDF({ invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          <View>
            <Text style={styles.id}>
              <Text style={styles.hash}>#</Text>
              <Text>{invoice.id.slice(-8).toUpperCase()}</Text>
            </Text>
            <Text style={styles.description}>{invoice.description}</Text>
          </View>
          <View>
            <View style={styles.sender_name}>
              <Text>{invoice.senderName}</Text>
            </View>
            <View style={styles.sender_address}>
              <Text>{invoice.senderStreet}</Text>
              <Text>{invoice.senderStreet2}</Text>
              <Text>
                {invoice.senderCity}
                {invoice.senderState &&
                invoice.senderState != "NA" &&
                invoice.senderState != "BLANK"
                  ? ", " + invoice.senderState
                  : ""}
                {invoice.senderCountry === "United States"
                  ? " " + invoice.senderZip
                  : ""}
              </Text>
              {invoice.senderCountry != "United States" && (
                <Text>{invoice.senderZip}</Text>
              )}
              <Text>{invoice.senderCountry}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Invoice Date</Text>
            <Text style={styles.invoice_date}>{invoice.invoiceDate}</Text>
            <View style={styles.payment_due_view}>
              <Text style={styles.label}>Payment Due</Text>
              <Text style={styles.payment_due}>{invoice.paymentDue}</Text>
            </View>
            <Text style={styles.label}>Send To</Text>
            <Text style={styles.client_email}>{invoice.clientEmail}</Text>
          </View>
          <View>
            <View style={styles.client_name_view}>
              <Text style={styles.label}>Bill To</Text>
              <Text style={styles.client_name}>{invoice.clientName}</Text>
            </View>
            <View style={styles.client_address}>
              <Text>{invoice.clientStreet}</Text>
              <Text>{invoice.clientStreet2}</Text>
              <Text>
                {invoice.clientCity}
                {invoice.clientState &&
                invoice.clientState != "NA" &&
                invoice.clientState != "BLANK"
                  ? ", " + invoice.clientState
                  : ""}
                {invoice.clientCountry === "United States"
                  ? " " + invoice.clientZip
                  : ""}
              </Text>
              {invoice.clientCountry != "United States" && (
                <Text>{invoice.clientZip}</Text>
              )}
              <Text>{invoice.clientCountry}</Text>
            </View>
          </View>
        </View>
        <View style={styles.breakdown}>
          <View>
            <View style={[styles.item_headings, styles.item]}>
              <Text style={styles.item_name}>Item Name</Text>
              <Text style={styles.item_quantity}>QTY.</Text>
              <Text style={styles.item_price}>Price</Text>
              <Text style={styles.item_total}>Total</Text>
            </View>
            {invoice.items.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={styles.item_name}>{item.name}</Text>
                <Text style={styles.item_quantity}>{item.quantity}</Text>
                <Text style={styles.item_price}>
                  {item.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Text>
                <Text style={styles.item_total}>
                  {item.total.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.total_container}>
            <Text>Grand Total</Text>
            <Text style={styles.total}>
              {invoice.total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
