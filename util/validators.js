const isValidState = (state) => {
  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  return states.includes(state);
};

const isEmpty = (field) => {
  return String(field).trim() === "";
};

const isValidDateString = (dateString) => {
  return (
    dateString &&
    Object.prototype.toString.call(new Date(dateString)) === "[object Date]" &&
    !isNaN(new Date(dateString))
  );
};

const isValidEmail = (emailAddress) => {
  const sQtext = "[^\\x0d\\x22\\x5c\\x80-\\xff]";
  const sDtext = "[^\\x0d\\x5b-\\x5d\\x80-\\xff]";
  const sAtom =
    "[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+";
  const sQuotedPair = "\\x5c[\\x00-\\x7f]";
  const sDomainLiteral = "\\x5b(" + sDtext + "|" + sQuotedPair + ")*\\x5d";
  const sQuotedString = "\\x22(" + sQtext + "|" + sQuotedPair + ")*\\x22";
  const sDomain_ref = sAtom;
  const sSubDomain = "(" + sDomain_ref + "|" + sDomainLiteral + ")";
  const sWord = "(" + sAtom + "|" + sQuotedString + ")";
  const sDomain = sSubDomain + "(\\x2e" + sSubDomain + ")*";
  const sLocalPart = sWord + "(\\x2e" + sWord + ")*";
  const sAddrSpec = sLocalPart + "\\x40" + sDomain; // complete RFC822 email address spec
  const sValidEmail = "^" + sAddrSpec + "$"; // as whole string

  const reValidEmail = new RegExp(sValidEmail);

  return reValidEmail.test(emailAddress);
};

export const validateInvoice = (invoice) => {
  const errors = {};
  const emptyErrMsg = "Required";
  if (isEmpty(invoice.senderStreet)) errors.senderStreet = emptyErrMsg;
  if (isEmpty(invoice.senderCity)) errors.senderCity = emptyErrMsg;
  if (isEmpty(invoice.senderState) || invoice.senderState === "BLANK") {
    errors.senderState = emptyErrMsg;
  } else if (
    invoice.senderCountry === "United States" &&
    !isValidState(invoice.senderState)
  ) {
    errors.senderState = "Must be a valid state";
  }
  if (isEmpty(invoice.senderZip)) errors.senderZip = emptyErrMsg;
  if (isEmpty(invoice.senderCountry)) errors.senderCountry = emptyErrMsg;
  if (isEmpty(invoice.clientName)) errors.clientName = emptyErrMsg;
  if (isEmpty(invoice.clientEmail)) {
    errors.clientEmail = emptyErrMsg;
  } else if (!isValidEmail(invoice.clientEmail)) {
    errors.clientEmail = "Invalid email";
  }
  if (isEmpty(invoice.clientStreet)) errors.clientStreet = emptyErrMsg;
  if (isEmpty(invoice.clientCity)) errors.clientCity = emptyErrMsg;
  if (isEmpty(invoice.clientState) || invoice.clientState === "BLANK") {
    errors.clientState = emptyErrMsg;
  } else if (
    invoice.clientCountry === "United States" &&
    !isValidState(invoice.clientState)
  ) {
    errors.clientState = "Must be a valid state";
  }
  if (isEmpty(invoice.clientZip)) errors.clientZip = emptyErrMsg;
  if (isEmpty(invoice.clientCountry)) errors.clientCountry = emptyErrMsg;
  if (isEmpty(invoice.description)) errors.description = emptyErrMsg;
  if (isEmpty(invoice.paymentTerms)) {
    errors.paymentTerms = emptyErrMsg;
  } else if (![1, 7, 14, 30].includes(invoice.paymentTerms)) {
    errors.paymentTerms = "Must be 1, 7, 14, or 30";
  }
  if (!isValidDateString(invoice.invoiceDate))
    errors.invoiceDate = "Invalid date";
  if (invoice.items.length < 1) {
    errors.items = "Must include at least 1 item";
  } else {
    invoice.items.forEach((item, index) => {
      if (isEmpty(item.name)) {
        if (!errors[`item${index}`]) errors[`item${index}`] = {};
        errors[`item${index}`].name = emptyErrMsg;
      }
      if (isEmpty(item.quantity)) {
        if (!errors[`item${index}`]) errors[`item${index}`] = {};
        errors[`item${index}`].quantity = emptyErrMsg;
      } else if (!(item.quantity > 0)) {
        if (!errors[`item${index}`]) errors[`item${index}`] = {};
        errors[`item${index}`].quantity = "Must be > 0";
      } else if (item.quantity % 1 != 0) {
        if (!errors[`item${index}`]) errors[`item${index}`] = {};
        errors[`item${index}`].quantity = "Wrong format"; //number is decimal
      }
      if (isEmpty(item.price)) {
        if (!errors[`item${index}`]) errors[`item${index}`] = {};
        errors[`item${index}`].price = emptyErrMsg;
      } else if (!(item.price >= 0)) {
        if (!errors[`item${index}`]) errors[`item${index}`] = {};
        errors[`item${index}`].price = "Must be >= 0";
      } else if (item.price.toFixed(2) != item.price) {
        if (!errors[`item${index}`]) errors[`item${index}`] = {};
        errors[`item${index}`].price = "Wrong format"; // number has more than 2 decimal places
      }
    });
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};
