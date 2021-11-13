import prisma from "../../../../lib/prisma";
import { validateInvoice } from "../../../../util/validators";
import { getSession } from "next-auth/client";
import { createPDF } from "../../../../util/pdf";
import { emailInvoice } from "../../../../util/emailInvoice";
import { deleteFile, uploadFile } from "../../../../util/storage";
import { revertStatusToDraft } from "../index";

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "User not signed in" });
  }
  const user = session.user;
  const invoiceId = req.query.id;

  if (req.method === "GET") {
    const invoiceData = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        user: { email: session.user.email },
      },
      include: {
        items: true,
      },
    });
    const invoice = {
      ...invoiceData,
      total:
        invoiceData.items.length > 0
          ? invoiceData.items
              .map((item) => item.price * item.quantity)
              .reduce((a, b) => a + b)
          : 0,
      paymentDue: invoiceData.paymentDue.toLocaleDateString("en-US", {
        dateStyle: "medium",
      }),
      invoiceDate: invoiceData.invoiceDate.toLocaleDateString("en-US", {
        dateStyle: "medium",
      }),
      status: invoiceData.status.toLowerCase(),
      items: invoiceData.items.map((item) => ({
        ...item,
        total: item.price * item.quantity,
      })),
    };
    return res.json({ invoice });
  }
  if (req.method === "DELETE") {
    if (!isAuthorized(invoiceId, session.user.email)) {
      return res.status(401).json({ message: "Unauthorized " });
    }
    const result = await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
      select: {
        id: true,
      },
    });
    return res.json(result);
  } else if (req.method === "PUT") {
    const sendAfterUpdate = req.query.send === "true" ? true : false;
    if (!req.body.status) req.body.status = "DRAFT";
    if (req.body.status === "PENDING") {
      const validationResults = validateInvoice(req.body);
      if (!validationResults.valid) {
        return res.status(400).json({ errors: validationResults.errors });
      }
    }
    if (!isAuthorized(invoiceId, session.user.email)) {
      return res.status(401).json({ message: "Unauthorized " });
    }
    const result = await prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        ...req.body,
        items: {
          deleteMany: {},
          createMany: {
            data: req.body.items,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!sendAfterUpdate) {
      return res.json(result);
    }

    try {
      const doc = createPDF({ ...req.body, id: result.id });
      const fileName = `Invoice_${result.id}.pdf`;
      const invoicePDFUrl = await uploadFile(doc, fileName);
      await emailInvoice({ ...req.body, id: result.id }, invoicePDFUrl);
      await deleteFile(fileName);
      return res.json(result);
    } catch (err) {
      if (err.name && err.name === "PDF Delete Error") {
        //this error doesn't need to be reported to user
        return res.json(result);
      }
      await revertStatusToDraft(invoiceId);
      return res.status(500).json(err);
    }
  } else if (req.method === "PATCH") {
    if (req.body.status === "PAID" || req.body.status === "PENDING") {
      if (!isAuthorized(invoiceId, session.user.email)) {
        return res.status(401).json({ message: "Unauthorized " });
      }
      const result = await prisma.invoice.update({
        where: {
          id: invoiceId,
        },
        data: {
          status: req.body.status,
        },
        select: {
          id: true,
        },
      });
      return res.json(result);
    } else {
      return res.status(400).json({ error: "status must be paid or pending" });
    }
  }
}

const isAuthorized = async (invoiceId, userEmail) => {
  const requestedInvoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      user: true,
    },
  });
  if (requestedInvoice.user.email !== userEmail) {
    return false;
  } else {
    return true;
  }
};
