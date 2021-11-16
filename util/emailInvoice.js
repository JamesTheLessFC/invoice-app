import SibApiV3Sdk from "sib-api-v3-sdk";

export const emailInvoice = async (invoice, invoiceUrl) => {
  try {
    let defaultClient = SibApiV3Sdk.ApiClient.instance;

    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.SEND_IN_BLUE_API_KEY;

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "{{params.subject}}";
    sendSmtpEmail.htmlContent =
      "<html><body><p>Hello {{params.clientName}},</p><p>You have a new invoice from {{params.senderName}}. You can find it attached to this email.</p><p>Thank you!<p><em>From the Team at Invoicer</em></p></body></html>";
    sendSmtpEmail.sender = {
      name: "No Reply",
      email: process.env.EMAIL_FROM,
    };
    sendSmtpEmail.to = [
      { email: invoice.clientEmail, name: invoice.clientName },
    ];
    sendSmtpEmail.params = {
      senderName: invoice.senderName,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      subject: `New Invoice (Due ${new Date(
        invoice.paymentDue
      ).toLocaleDateString("en-US", {
        dateStyle: "medium",
      })})`,
    };
    sendSmtpEmail.attachment = [
      {
        url: invoiceUrl,
        name: `Invoice_${invoice.id}.pdf`,
      },
    ];
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent!");
  } catch (err) {
    console.error(err);
    throw {
      name: "Email Client Error",
      message: `Unable to send invoice to ${invoice.clientEmail}`,
    };
  }
};
