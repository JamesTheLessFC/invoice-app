import { getSession } from "next-auth/client";
import { getPDFAsBase64String } from "../../../../util/pdf";

export default async function handle(req, res) {
  const invoiceId = req.query.id;
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "User not signed in" });
  }

  if (req.method === "POST") {
    const b64 = await getPDFAsBase64String({ ...req.body, id: invoiceId });
    return res.json({ base64: "data:application/pdf;base64," + b64 });
  }
}
