import prisma from "../../../lib/prisma";
import { validateInvoice } from "../../../util/validators";
import { getSession } from "next-auth/client";

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
        invoiceData.items.length > 1
          ? invoiceData.items.reduce(
              (a, b) => a.price * a.quantity + b.price * b.quantity
            )
          : invoiceData.items.length === 1
          ? invoiceData.items[0].price * invoiceData.items[0].quantity
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
    const result = await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
      select: {
        id: true,
      },
    });
    res.json(result);
  } else if (req.method === "PUT") {
    if (!req.body.status) req.body.status = "DRAFT";
    if (req.body.status === "PAID") {
      const result = await prisma.invoice.update({
        where: {
          id: invoiceId,
        },
        data: {
          status: "PAID",
        },
        select: {
          id: true,
        },
      });
      return res.json(result);
    }
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
    return res.json(result);
  }
}
