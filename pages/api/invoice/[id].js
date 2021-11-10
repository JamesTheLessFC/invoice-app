import prisma from "../../../lib/prisma";
import { validateInvoice } from "../../../util/validators";
import { getSession } from "next-auth/client";
import { createAndUploadPDF } from "../../../util/createPDF";
import { emailInvoice } from "../../../util/emailInvoice";
import { deleteFile } from "../../../util/storage";

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
    try {
      await deleteFile(`Invoice_${invoiceId}.pdf`);
      const result = await prisma.invoice.delete({
        where: {
          id: invoiceId,
        },
        select: {
          id: true,
        },
      });
      return res.json(result);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else if (req.method === "PUT") {
    if (!req.body.status) req.body.status = "DRAFT";
    if (req.body.status === "PENDING") {
      const validationResults = validateInvoice(req.body);
      if (!validationResults.valid) {
        return res.status(400).json({ errors: validationResults.errors });
      }
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

    try {
      const uploadResult = await createAndUploadPDF(req);
      await emailInvoice({ ...req.body, id: result.id }, uploadResult);
    } catch (err) {
      await revertStatusToDraft(invoiceId);
      return res.status(500).json(err);
    }

    return res.json(result);
  } else if (req.method === "PATCH") {
    if (req.body.status === "PAID" || req.body.status === "PENDING") {
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

const revertStatusToDraft = async (id) => {
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
