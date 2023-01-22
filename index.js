/* for Staging */
// hostname: 'securegw-stage.paytm.in',

/* for Production */
const https = require("https");
require("dotenv").config();
const axios = require("axios");
const PaytmChecksum = require("./PaytmChecksum");

var paytmParams = {};

const express = require("express");

const app = express();
const PORT = 4000;
app.use(express.json());
app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `);
});

app.post("/", async (req, res) => {
  const amount = req.body.amount;
  paytmParams.body = {
    mid: process.env.MID,
    orderId: "OREDRID98765" + Math.random() + "PAYTMGOPU" + Math.random(),
    amount: amount,
    businessType: "UPI_QR_CODE",
    posId: "S12_123",
  };
  const checksum = await PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    process.env.MKEY
  );

  paytmParams.head = {
    channelId: "WEB",
    clientId: "C11",
    version: "v1",
    signature: checksum,
  };

  var post_data = JSON.stringify(paytmParams);

  var options = {
    hostname: "securegw.paytm.in",
    port: 443,
    path: "/paymentservices/qr/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": post_data.length,
    },
  };
  var response = "";
  var post_req = https.request(options, function (post_res) {
    post_res.on("data", function (chunk) {
      response += chunk;
    });

    post_res.on("end", function () {
      res.send(JSON.parse(response));

      //  console.log(response)
    });
  });

  post_req.write(post_data);
  post_req.end();
});

app.post("/web", async (req, res) => {
  axios
    .post(
      "https://304a-2405-201-3008-611c-94f2-1083-4c2c-99da.in.ngrok.io/paytm_webhook",
      {
        response: req.body,
      }
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

  res.send({ status: req.body });
});

// Export the Express API
module.exports = app;
