import React, { Component } from 'react';
import './App.css';

class App extends Component {
  componentDidMount() {
    window.Mercadopago.setPublishableKey('TEST-fe993d79-6212-4cab-be80-c6457ba004b0');
  }

  render() {
    return (
      <form action="" method="post" id="pay" name="pay">
  <fieldset>
    <ul>
      <li>
        <label htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          defaultValue="test_user_71425066@testuser.com"
          type="email"
          placeholder="your email"
        />
      </li>
      <li>
        <label htmlFor="cardNumber">
          Credit card number:
        </label>
        <input
          type="text"
          id="cardNumber"
          data-checkout="cardNumber"
          placeholder="4509953566233704"
          autoComplete="off"
          maxLength={16}
        />
      </li>
      <li>
        <label htmlFor="securityCode">
          Security code:
        </label>
        <input
          type="text"
          id="securityCode"
          data-checkout="securityCode"
          placeholder="123"
          autoComplete="off"
        />
      </li>
      <li>
        <label htmlFor="cardExpirationMonth">
          Expiration month:
        </label>
        <input
          type="text"
          id="cardExpirationMonth"
          data-checkout="cardExpirationMonth"
          placeholder="12"
          autoComplete="off" />
      </li>
      <li>
        <label htmlFor="cardExpirationYear">
          Expiration year:
        </label>
        <input
          type="text"
          id="cardExpirationYear"
          data-checkout="cardExpirationYear"
          placeholder="2015"
          autoComplete="off"
        />
      </li>
      <li>
        <label
          htmlFor="cardholderName">
          Card holder name:
        </label>
        <input
          type="text"
          id="cardholderName"
          data-checkout="cardholderName"
          placeholder="APRO"
        />
      </li>
      <li>
        <label htmlFor="docType">
          Document type:
        </label>
        <select id="docType" data-checkout="docType"></select>
      </li>
      <li>
        <label htmlFor="docNumber">Document number:</label>
        <input
          type="text"
          id="docNumber"
          data-checkout="docNumber"
          placeholder="12345678"
        />
      </li>
    </ul>
    <input
      type="hidden"
      name="paymentMethodId"
    />
    <input type="submit" value="Pay!" />
  </fieldset>
</form>
    )
  };
}

export default App;
