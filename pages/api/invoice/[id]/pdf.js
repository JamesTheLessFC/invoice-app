import { getToken } from "next-auth/jwt";
import { getPDFAsBase64String } from "../../../../util/pdf";

export default async function handle(req, res) {
  const token = await getToken({ req, secret });

  if (!token) {
    return res.status(401).json({ message: "User not signed in" });
  }

  const invoiceId = req.query.id;

  if (req.method === "POST") {
    try {
      const b64 = await getPDFAsBase64String({ ...req.body, id: invoiceId });
      return res.json({ base64: "data:application/pdf;base64," + b64 });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Unable to fetch PDF" });
    }
  }
}
