import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "User not signed in" });
  }

  const user = session.user;

  if (req.method === "GET") {
    const invoicesData = await prisma.invoice.findMany({
      where: {
        user: { email: session.user.email },
      },
      include: {
        items: true,
      },
    });
    console.log(invoicesData);
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
        invoice.invoiceDate.getTime() +
          invoice.paymentTerms * 24 * 60 * 60 * 1000
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
    return res.json({ invoices });
  }
}
