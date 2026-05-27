const crypto = require("crypto");

// This function generates a timestamp string in the format YYYYMMDDHHmmss
function getReqTime() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

// This function creates a digital signature to prove the request is legitimate and came from you
function signPayWay(raw) {
    console.log("raw:", raw);  
  return crypto
    .createHmac("sha512", process.env.ABA_PAYWAY_API_KEY)
    .update(raw)
    .digest("base64");
}

//  This function combines all order fields into one string then signs it.
// It's basically building the raw string that gets passed to signPayWay:
function buildPurchaseHash(payload) {
  const raw =
    payload.req_time +
    payload.merchant_id +
    payload.tran_id +
    payload.amount +
    payload.items +
    payload.firstname +
    payload.lastname +
    payload.email +
    payload.phone +
    payload.type +
    payload.payment_option +
    payload.return_url +
    payload.cancel_url +
    payload.continue_success_url +
    payload.currency;

  return signPayWay(raw);
}

// format it to base64
const encodeBase64 = (url) => {
  return Buffer.from(url).toString("base64");
};

const  buildCheckTransactionHash = ({ req_time, merchant_id, tran_id }) => {
  const raw = req_time + merchant_id + tran_id;
  return signPayWay(raw);
};

module.exports = {
  getReqTime,
  buildPurchaseHash,
  encodeBase64,
  buildCheckTransactionHash
};
