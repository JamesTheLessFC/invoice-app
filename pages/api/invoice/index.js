import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { validateInvoice } from "../../../util/validators";
import { emailInvoice } from "../../../util/emailInvoice";
import { createPDF } from "../../../util/pdf";
import { deleteFile, uploadFile } from "../../../util/storage";

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "User not signed in" });
  }
  if (!req.body.status) req.body.status = "DRAFT";
  if (req.body.status !== "DRAFT") {
    const validationResults = validateInvoice(req.body);
    if (!validationResults.valid) {
      return res.status(400).json({ errors: validationResults.errors });
    }
  }
  const result = await prisma.invoice.create({
    data: {
      ...req.body,
      user: { connect: { email: session?.user?.email } },
      items: {
        createMany: {
          data: req.body.items,
        },
      },
    },
    select: {
      id: true,
    },
  });
  if (req.body.status === "DRAFT") {
    return res.status(201).json(result);
  } else {
    try {
      const doc = createPDF({ ...req.body, id: result.id });
      const fileName = `Invoice_${result.id}.pdf`;
      const invoicePDFUrl = await uploadFile(doc, fileName);
      await emailInvoice({ ...req.body, id: result.id }, invoicePDFUrl);
      await deleteFile(fileName);
    } catch (err) {
      if (err.name && err.name === "PDF Delete Error") {
        //this error doesn't need to be reported to user
        return res.json(result);
      }
      await revertStatusToDraft(result.id);
      return res.status(500).json(err);
    }
    return res.status(201).json(result);
  }
}

export const revertStatusToDraft = async (id) => {
  const fixStatusResult = await prisma.invoice.update({
    where: {
      id: id,
    },
    data: {
      status: "DRAFT",
    },
    select: {
      id: true,
    },
  });
  return fixStatusResult;
};
