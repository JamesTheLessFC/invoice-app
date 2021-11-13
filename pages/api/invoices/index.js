import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "User not signed in" });
  }

  if (req.method === "GET") {
    const countQuery = {
      where: {
        user: { email: session.user.email },
      },
    };
    const dataQuery = {
      take: 10,
      skip: (Number(req.query.page) - 1) * 10,
      where: {
        user: { email: session.user.email },
      },
      include: {
        items: true,
      },
      orderBy: {
        paymentDue: "asc",
      },
    };
    if (req.query.filter) {
      dataQuery.where = {
        ...dataQuery.where,
        status: {
          in: req.query.filter.split(",").map((fil) => fil.toUpperCase()),
        },
      };
      countQuery.where = {
        ...countQuery.where,
        status: {
          in: req.query.filter.split(",").map((fil) => fil.toUpperCase()),
        },
      };
    }
    const count = await prisma.invoice.count(countQuery);
    const invoicesData = await prisma.invoice.findMany(dataQuery);
    const invoices = invoicesData.map((invoice) => ({
      ...invoice,
      total:
        invoice.items.length > 0
          ? invoice.items
              .map((item) => item.price * item.quantity)
              .reduce((a, b) => a + b)
          : 0,
      paymentDue: invoice.paymentDue.toLocaleDateString("en-US", {
        dateStyle: "medium",
      }),
      invoiceDate: invoice.invoiceDate.toLocaleDateString("en-US", {
        dateStyle: "medium",
      }),
      status: invoice.status.toLowerCase(),
      items: invoice.items.map((item) => ({
        ...item,
        total: item.price * item.quantity,
      })),
    }));
    return res.json({ invoices, count });
  }
}
