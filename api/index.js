const express = require('express');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');
const app = express();
const port = 3001;

// Set the mercadopago credentials
mercadopago.configurations.setAccessToken('YOUR_SANDBOX_ACCESS_TOKEN');

// Attach the body-parser
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/pay', function (req, res) {
    res.send(req.body);
});

console.log(`Application listening on port ${port}`);

app.listen(port);