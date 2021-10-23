import prisma from "../../../lib/prisma";

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
    res.json(result);
  }
}
