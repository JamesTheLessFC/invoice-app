import prisma from "../../../lib/prisma";
import { validateInvoice } from "../../../util/validators";

export default async function handle(req, res) {
  const invoiceId = req.query.id;
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
