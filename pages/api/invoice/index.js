import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";
import { validateInvoice } from "../../../util/validators";

export default async function handle(req, res) {
  const session = await getSession({ req });
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
  res.status(201).json(result);
}
