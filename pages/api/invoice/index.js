import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const {
    description,
    senderStreet,
    senderCity,
    senderZip,
    senderCountry,
    clientName,
    clientEmail,
    clientStreet,
    clientCity,
    clientZip,
    clientCountry,
    invoiceDate,
    paymentTerms,
    items,
  } = req.body;
  const session = await getSession({ req });
  const result = await prisma.invoice.create({
    data: {
      description,
      senderStreet,
      senderCity,
      senderZip,
      senderState: "VA",
      clientName,
      clientEmail,
      clientStreet,
      clientCity,
      clientZip,
      clientState: "VA",
      invoiceDate,
      paymentTerms,
      user: { connect: { email: session?.user?.email } },
    },
  });
  res.json(result);
}
