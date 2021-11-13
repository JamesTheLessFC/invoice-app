import PDFDocument from "pdfkit";
import { uploadFile } from "./storage";
import getStream from "get-stream";

const black = "black";
const blueGray = "#7e88c3";
const lightGray = "#f9fafe";
const white = "#ffffff";
const darkGray = "#373b53";

const formatDateString = (isoDate) => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
};

const formatUSD = (num) => {
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

const generateItemRow = (doc, yVal, item) => {
  doc.text(item.name, 60, yVal);
  doc.text(item.quantity, 250, yVal, {
    align: "right",
    width: 50,
  });
  doc.text(formatUSD(item.price), 315, yVal, {
    align: "right",
    width: 100,
  });
  doc.text(formatUSD(item.quantity * item.price), 50, yVal, {
    align: "right",
    width: doc.page.width - 110,
  });
  doc.moveDown(0.25);
};

const generateHr = (doc, yVal, color) => {
  doc
    .strokeColor(color)
    .lineWidth(1)
    .moveTo(50, yVal)
    .lineTo(doc.page.width - 50, yVal)
    .stroke();
};

export const createPDF = (invoice) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  let total = 0;
  for (let i = 0; i < invoice.items.length; i++) {
    total += invoice.items[i].price * invoice.items[i].quantity;
  }

  //invoice ID
  doc
    .font("Helvetica-Bold")
    .fontSize(15)
    .fillColor(black)
    .text("Invoice ", {
      continued: true,
    })
    .fillColor(blueGray)
    .text("#", {
      continued: true,
    })
    .fillColor(black)
    .text(invoice.id.slice(-8).toUpperCase());

  //invoice description
  doc
    .moveDown(0.25)
    .font("Helvetica-Oblique")
    .fontSize(12)
    .fillColor(blueGray)
    .text(invoice.description);

  //sender name & address
  doc
    .moveUp(1.25)
    .font("Helvetica")
    .fontSize(15)
    .moveUp()
    .fontSize(12)
    .fillColor(black)
    .text(invoice.senderName, {
      align: "right",
    });

  doc
    .moveDown()
    .text(invoice.senderStreet, {
      align: "right",
    })
    .text(invoice.senderStreet2, {
      align: "right",
    });

  if (invoice.senderCountry === "United States") {
    doc.text(
      invoice.senderCity + ", " + invoice.senderState + " " + invoice.senderZip,
      {
        align: "right",
      }
    );
  } else {
    doc
      .text(invoice.senderCity, {
        align: "right",
      })
      .text(invoice.senderZip, {
        align: "right",
      });
  }

  doc.text(invoice.senderCountry, {
    align: "right",
  });

  //invoice date
  doc.moveDown(2).fillColor(blueGray).text("Invoice Date");
  doc
    .moveDown(0.25)
    .fillColor(black)
    .text(formatDateString(invoice.invoiceDate));

  //payment due
  doc.moveDown().fillColor(blueGray).text("Payment Due");
  doc
    .moveDown(0.25)
    .fillColor(black)
    .text(formatDateString(invoice.paymentDue));

  //send to
  doc.moveDown().fillColor(blueGray).text("Send To");
  doc.moveDown(0.25).fillColor(black).text(invoice.clientEmail);

  doc.moveUp(8.75);

  //client name & address
  doc.fillColor(blueGray).text("Bill To", {
    align: "right",
  });
  doc.moveDown(0.25).fillColor(black).text(invoice.clientName, {
    align: "right",
  });

  doc
    .moveDown()
    .text(invoice.clientStreet, {
      align: "right",
    })
    .text(invoice.clientStreet2, {
      align: "right",
    });

  if (invoice.clientCountry === "United States") {
    doc.text(
      invoice.clientCity + ", " + invoice.clientState + " " + invoice.clientZip,
      {
        align: "right",
      }
    );
  } else {
    doc
      .text(invoice.clientCity, {
        align: "right",
      })
      .text(invoice.clientZip, {
        align: "right",
      });
  }

  doc.text(invoice.senderCountry, {
    align: "right",
  });

  //item list
  doc.moveDown(4.5);

  doc
    .rect(doc.x, doc.y, doc.page.width - 100, 47 + invoice.items.length * 18)
    .fill(lightGray);

  doc.moveDown();

  const x = doc.x;
  const y = doc.y;

  doc.fillColor(blueGray).text("Item Name", 60);
  doc.text("QTY.", x + 200, y, {
    align: "right",
    width: 50,
  });
  doc.text("Price", x + 265, y, {
    align: "right",
    width: 100,
  });
  doc.text("Total", x, y, {
    align: "right",
    width: doc.page.width - 110,
  });

  generateHr(doc, doc.y + 5, blueGray);

  doc.moveDown().fillColor(black);

  for (let j = 0; j < invoice.items.length; j++) {
    generateItemRow(doc, doc.y, invoice.items[j]);
  }

  doc.moveDown(0.3);

  doc.rect(doc.x, doc.y, doc.page.width - 100, 40).fill(darkGray);

  doc.moveDown().fillColor(white).text("Grand Total", 60);
  doc
    .moveUp(1.05)
    .font("Helvetica-Bold")
    .fontSize(15)
    .text(formatUSD(total), {
      align: "right",
      width: doc.page.width - 120,
    });

  doc.end();

  return doc;
};

export const getPDFAsBase64String = async (invoice) => {
  try {
    const doc = createPDF(invoice);
    const stream = await getStream.buffer(doc);
    const b64 = Buffer.from(stream).toString("base64");
    return b64;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createAndUploadPDF = async (req) => {
  const fileName = `Invoice_${req.query.id}.pdf`;
  const invoice = { ...req.body, id: req.query.id };
  const doc = createPDF(invoice);
  //upload to google cloud storage and return public url or error
  return await uploadFile(doc, fileName);
};
