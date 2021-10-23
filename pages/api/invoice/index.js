import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const session = await getSession({ req });
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
