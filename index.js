const https = require('https');
/*
* import checksum generation utility
* You can get this utility from https://developer.paytm.com/docs/checksum/
*/
const PaytmChecksum = require('./PaytmChecksum');

var paytmParams = {};

paytmParams.body = {
    "mid"           : "oWuMiQ74209684560838",
    "orderId"       : "OREDRID98765"+Math.random()+"sdsds"+Math.random(),
    "amount"        : "1303.00",
    "businessType"  : "UPI_QR_CODE",
    "posId"         : "S12_123"
};

/*
* Generate checksum by parameters we have in body
* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
*/
PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), "XFDyQGt1kEJEUnhU").then(function(checksum){

    paytmParams.head = {
        "channelId" : "WEB",
        "clientId"	: "C11",
        "version"	: "v1",
        "signature"	: checksum
    };

    var post_data = JSON.stringify(paytmParams);

    var options = {

        /* for Staging */
        // hostname: 'securegw-stage.paytm.in',

        /* for Production */
        hostname: 'securegw.paytm.in',

        port: 443,
        path: '/paymentservices/qr/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });

    post_req.write(post_data);
    post_req.end();
});


// index.js
const express = require('express')

const app = express()
const PORT = 4000

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})

// Export the Express API
module.exports = app
