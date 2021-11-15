import { getToken } from "next-auth/jwt";
import prisma from "../../../lib/prisma";

const secret = process.env.SECRET;

export default async function handle(req, res) {
  const token = await getToken({ req, secret });

  if (!token) {
    return res.status(401).json({ message: "User not signed in" });
  }

  const userId = token.sub;

  if (req.method === "GET") {
    const countQuery = {
      where: {
        user: { id: userId },
      },
    };
    const dataQuery = {
      take: 10,
      skip: (Number(req.query.page) - 1) * 10,
      where: {
        user: { id: userId },
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
