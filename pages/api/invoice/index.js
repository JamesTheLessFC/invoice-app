import { getSession } from "next-auth/client";
import prisma from "../../../lib/prisma";
import { validateInvoice } from "../../../util/validators";
import { createAndUploadPDF } from "../../../util/createPDF";
import { emailInvoice } from "../../../util/emailInvoice";

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "User not signed in" });
  }
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
  if (req.body.status === "DRAFT") {
    return res.status(201).json(result);
  } else {
    try {
      const uploadResult = await createAndUploadPDF(req);
      await emailInvoice({ ...req.body, id: result.id }, uploadResult);
    } catch (err) {
      await revertStatusToDraft(invoiceId);
      return res.status(500).json(err);
    }
    return res.status(201).json(result);
  }
}

export const revertStatusToDraft = async (id) => {
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
