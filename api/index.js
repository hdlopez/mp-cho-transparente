const express = require('express');
const bodyParser = require('body-parser');
const mercadopago = require('mercadopago');
const app = express();
const port = 3001;

// Set the mercadopago credentials
mercadopago.configurations.setAccessToken('TEST-3423648294898849-100404-3ddbe6df8deba5db8ec35f5409c54c61-240497682');

// Attach the body-parser
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/pay', function (req, res) {
  const token = req.body.token;
  const paymentMethodId = req.body.paymentMethodId;
  const email = req.body.email;

  console.log(`Parameters receive ${JSON.stringify(req.body)}`);

  // Creating payment payload
  const paymentData = {
    transaction_amount: 100,
    token: token,
    description: 'Test Payment',
    installments: 1,
    payment_method_id: paymentMethodId,
    payer: {
      email: email,
    },
  };

  // Do payment
  mercadopago.payment.save(paymentData).then((payment) => {
    console.log('Payment done!');
    res.send(payment);
  }).catch(function (error) {
    console.log(`There was an error making the payment ${error}`);
    res.status(500).send({
      message: error.message
    });
  });
});

console.log(`Application listening on port ${port}`);

app.listen(port);