> Traducción a portugués está pendiente. Se aceptan PRs :)
> 
# Como desenvolver uma integração de pagamentos em menos de 30 minutos

La idea de este repositorio es brindar una guía paso a paso de cómo hacer una integración por API (también conocido como checkout transparente) de [MercadoPago](https://developers.mercadopago.com).

## Tecnologías utilizadas

En este ejemplo se utiliza [nodejs](https://www.freecodecamp.org/news/what-exactly-is-node-js-ae36e97449f5/) para el desarrollo tanto del frontend como el backend de la apicación.

Algunos links útiles:

* [create-react-app](https://www.npmjs.com/package/create-react-app) - Frontend Application
* [express](https://npmjs.com/package/express) - Framework para el desarrollo de nuestro backend
* [mercadopago](https://npmjs.com/package/mercadopago) - Mercado Pago official SDK


--- AGREGAR TABLA DE CONTENIDOS ---


## Paso 1 - Creando la aplicación

Creemos una carpeta para almacenar nuestra aplicación. En este tutorial le llamaremos *mp-cho-transparente*.

```
$ mkdir mp-cho-transparente && cd mp-cho-transparente
```

Luego, simplemente creemos una aplicación básica utilizando [create-react-app](https://www.npmjs.com/package/create-react-app)

```
$ npx create-react-app .
```

Luego de la ejecución del comando, podremos correr nuestra aplicación

```
$ npm run start
```

![Empty-React-Page](https://user-images.githubusercontent.com/4379982/63639819-ad6fd380-c66e-11e9-8a54-88ca33576583.png)

## Paso 2 - Agregando la SDK de MercadoPago

Siguiendo el [sitio de desarrolladores](https://developers.mercadopago.com) oficial de MercadoPago, la documentación que seguiremos es [Receba um pagamento com cartão](https://www.mercadopago.com.br/developers/pt/guides/payments/api/receiving-payment-by-card/).

### Agregando la SDK de javascript

Agregar `mercadopago.js` a tu html principal. En nuestro ejemplo, es el arcchivo `public/index.html`.

```html
<body>
    <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>
    ...
```

### Configurando tus credenciales

Para configurar [tus credenciales](https://www.mercadopago.com/mlb/account/credentials) de MercadoPago en la SDK, dirigirse a nuestro componente de React de ejemplo `src/App.js`. Este componente al finalizar nuestro trabajo será el responsable de dibujar el formulario de tarjeta para recibir pagos.

Lo primero que debemos hacer es convertir nuestro componente `App` a un *class component*. Luego utilizaremos el método `componentDidMount` para configurar nuestras credenciales. Debajo se muestra un ejemplo de cómo debería quedar el archivo archivo `src/App.js`:

```javascript
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      submit: false,
    };
  }

  componentDidMount() {
    window.Mercadopago.setPublishableKey('YOUR_SANDBOX_PUBLIC_KEY');
  }

  render() {
    return (
      <div className="App">
        <h1>Checkout</h1>
      </div>
    )
  };
}

export default App;
```

Como se puede observar en el ejemplo de código anterior, en el método `componentDidMount` se debe configurar tu public key. Es importante substituir el texto *YOUR_SANDBOX_PUBLIC_KEY* por una **public key válida**, ya sea de *sandbox* si estamos realizando pruebas o de producción si queremos subir nuestro código a producción.

## Paso 3 - Formulario de pagos

Utilizaremos el formulario de pagos de la sección *Capturar dados do cartão* del [Developers Site](https://www.mercadopago.com.br/developers/pt/guides/payments/api/receiving-payment-by-card/).

Pero algo **importante** es que **debemos adaptarlo a React** ya que los eventos javascript inline exitentes no son compatibles con React.

``` html
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
````

> Notar que el selector de documento está vacío, pero hablaremos de ello más adelante

Ya tenemos un formulario! Pero se ve bastante feo, no? Así que simplemente para mejorar la UI, sobreescribamos nuestro archivo de estilos `src/App.css`.

```css
body {
  background: #f5f6f8;
  font-size: 14px;
}

.App {
  margin: 0 auto;
}

h1 {
  padding: 10px;
  margin-bottom: 0px;
}

form {
  margin: 0 auto;
  padding: 10px;
}

fieldset {
  padding: 0px;
  border: 0px;
}

ul {
  padding: 0px;
  margin: 0px;
  list-style: none;
}

label {
  display: block;
  margin: 5px 0px 5px 0px;
}

input,
select {
  padding: 12px 10px;
  min-width: 100%;
  box-sizing: border-box;
  border: 2px solid #eee;
  border-radius: 0px;
  height: 40px;
}

input[type=submit] {
  margin-top: 10px;
  padding: 5px 15px;
  color: white;
  background: #009ee3;
  border: 1px solid #009ee3;
  cursor: pointer;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  height: 50px;
  font-size: 14px;
}

input[type=submit]:hover {
  background: #32b3ff;
  border-color: #32b3ff;
}
```

## Paso 3 - Agregando dinamismo a nuestro formulario de pago

Hasta ahora hemos realizado lo siguiente:
- Creamos la aplicación react
- Agregamos y configuramos la SDK javascript de MercadoPago
- Creamos un formulario de ingreso de tarjetas para recibir el pago (actualmente de comportamiento estático)

En esta sección agregaremos lógica al formulario de pagos para hacer su funcionamiento dinámico. Agregaremos al formulario soporte a tipos de documentos (CPF, CNPF) y luego agregaremos soporte al *guessing* del medio de pago.

### Tipos de documento

Los tipos de documento (o inglés *identification types*) son los tipos de documentos válidos de cada país.

Para popular el selector de documento podemos utilizar la función `getIdentificationTypes` de la *SDK de MercadoPago*. Debemos colocar la llamada en el momento que el componente se monta utilizando la función `componentDiMount`.

``` javascript
class App extends Component {
  ...
  ...

  componentDidMount() {
    ...
    ...
    window.Mercadopago.getIdentificationTypes();
  }
```

Listo! Con esta acción ya tenemos el selector de tipo de documentos funcionando.

### Card Guessing

Uno de los datos más importantes para podamos procesar el pago, es conocer cuál es el medio de pago que ingresará el usuario (visa, master, american express, etc).

Para obtener el medio de pago de forma dinámica también usaremos la *SDK de MercadoPago*. Para obtener el medio de pago utilizaremos el evento `onChange` del input del formulario llamado `cardNumber` y la función `getPaymentMethod` de la SDK. La función `getPaymentMethod` requiere como parámetro los primeros 6 dígitos de la tarjeta (también llamado *BIN*).

Agreguemos el evento `onChange` al input `cardNumber`:

```javascript
<input
  type="text"
  id="cardNumber"
  data-checkout="cardNumber"
  placeholder="4509953566233704"
  autoComplete="off"
  onChange={this.guessingPaymentMethod}
/>
```

Y agreguemos la función para obtener el medio de pago que llamamos `guessingPaymentMethod` y su correspondiente callback `setPaymentMethodInfo`

```javascript
class App extends Component {
  constructor(props){
    ...
    ...

    // Binding methods to class component
    this.guessingPaymentMethod = this.guessingPaymentMethod.bind(this)
    this.setPaymentMethodInfo = this.setPaymentMethodInfo.bind(this);
  }

  guessingPaymentMethod(event) {
    const bin = event.currentTarget.value;

    if (bin.length >= 6) {
      window.Mercadopago.getPaymentMethod({
        "bin": bin.substring(0, 6),
      }, this.setPaymentMethodInfo);
    }
  }

  setPaymentMethodInfo(status, response) {
    if (status === 200) {
      const paymentMethodElement = document.querySelector('input[name=paymentMethodId]');

      if (paymentMethodElement) {
        paymentMethodElement.value = response[0].id;
      } else {
        const form = document.querySelector('#pay');
        const input = document.createElement('input');

        input.setAttribute('name', 'paymentMethodId');
        input.setAttribute('type', 'hidden');
        input.setAttribute('value', response[0].id);

        form.appendChild(input);
      }
    } else {
      alert(`Payment Method not Found`);
    }
  }

  ...
  ...
}
```

## Paso 5 - Creando el Card Token



This is the process when all of the payer information is converted into a safe id to prevent hackers to stole of your information.

How we do this? The SDK Provides a method call `createToken` to convert this information into the safe id (token)

To achieve this we need to attach a `onSubmit` event for the checkout form

```javascript
<form action="" method="post" id="pay" name="pay" onSubmit={this.onSubmit}>
```

Then we need to add the `onSubmit` method that is going to use the `createToken` provided by the SDK

```javascript
  onSubmit(event) {
    event.preventDefault();

    const form = document.querySelector('#pay');

    window.Mercadopago.createToken(form, this.sdkResponseHandler); // The function "sdkResponseHandler" is defined below

    return false;
  }
```

This method is going to generate the safe id (`token`) to be added on the on the `<form>`. To do this we need copy the example from the [Developers Site](https://www.mercadopago.com.br/developers/pt/guides/payments/api/receiving-payment-by-card/).

```javascript
  sdkResponseHandler(status, response) {
    if (status !== 200 && status !== 201) {
      alert("verify filled data");
    } else {
      const form = document.querySelector('#pay');
      const card = document.createElement('input');
      
      card.setAttribute('name', 'token');
      card.setAttribute('type', 'hidden');
      card.setAttribute('value', response.id);
      
      form.appendChild(card);
      form.submit();
    }
  };
```

If you see this example, once the `token` is generated is going to submit the form. This is causing that the `token` is generated again and before its generated again the form is submitted again. We need to add a variable on the state to stop this.

```javascript
  constructor(props){
    super(props);

    this.setPaymentMethodInfo = this.setPaymentMethodInfo.bind(this);
    this.guessingPaymentMethod = this.guessingPaymentMethod.bind(this);
    this.sdkResponseHandler = this.sdkResponseHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      submit: false,
    };
  }
```

Then we need to prevent the re generation of the `token` on the `onSubmit` method

```javascript
  onSubmit(event) {
    event.preventDefault();

    if (!this.state.submit) {
      const form = document.getElementsByTagName('form')[0];
      window.Mercadopago.createToken(form, this.sdkResponseHandler);
    }
  }
```

Now we just need to update this state variable in order to work correctly

```javascript
  sdkResponseHandler(status, response) {
    if (status !== 200 && status !== 201) {
      alert("verify filled data");

      this.setState({
        submit: false,
      });
    } else {
      this.setState({
        submit: true,
      });

      const form = document.querySelector('#pay');
      const card = document.createElement('input');

      card.setAttribute('name', 'token');
      card.setAttribute('type', 'hidden');
      card.setAttribute('value', response.id);

      form.appendChild(card);
      form.submit();
    }
  };
```

#### Party!

You just did the payment form and capture all the necessary information to process the payment

![Party Gif](https://user-images.githubusercontent.com/4379982/62431004-00064180-b6fa-11e9-83a0-c05fae609ba4.gif)

### Step 5 - Backend Side (API)

The payment form created previously is going to be making a `POST` to our Backend with the next information:

* email - Payer email
* paymentMethodId - Payment Method Id from Guessing
* token - Safe Id (`token`) generated from the Mercado Pago API

Now we need to create our Backend to receive this information and make the payment

#### Creating the Backend

Let's start creating a `/api` folder on the `root` of our project and initialize a [NPM](https://npmjs.com) project with the next command:

```
$ npm init
```

> The previous command generated a `package.json` file

Now we can install the following dependencies:

* [express](https://npmjs.com/package/express) - Web Framework
* [body-parser](https://npmjs.com/package/body-parser) - Used to capture the `body` sent from the payemnt `<form>`
* [mercadopago](https://npmjs.com/package/mercadopago) - Official NodeJS Mercado Pago SDK

We can install them with the next command:

```
$ npm install express body-parser mercadopago --save
```

Once the dependencies were install, we can start writting our server. First we need an application entry point. We can create it with the next command:

```
$ touch index.js
```

### Step 6 - Creating Server & Configuring SDK

Now we need to create a basic `express` server

```javascript
const express = require('express');
const app = express();

app.listen(3001);
```

Next you need to attach the `body-parser` to be able to interpret the information sent via `POST` from the `<form>`

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Attach the body-parser
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3001);
```

Now we need to add the [mercadopago](https://npmjs.com/package/mercadopago) SDK dependency and configure it.

```javascript
const mercadopago = require('mercadopago');

mercadopago.configurations.setAccessToken('TEST-169606388010973-082414-1c20929a9443e6f84e4f7a855affe0a8-464359136');
```

Now we are ready to receive the information and make the payment

### Step 7 - Making the Payment

The first thing to do is creating the route for receiving the information from the `<form>` via `POST` HTTP method

```javascript
app.post('/pay', function (req, res) {
  // Route handler
});
```

We can get the payment information from the `request` object inside the `body` attribute

```javascript
const token = req.body.token;
const paymentMethodId = req.body.paymentMethodId;
const email = req.body.email;
```

Then we can construct the payload to be sent to the Mercado Pago Payments API

```javascript
  const paymentData = {
    transaction_amount: 100,
    token: token,
    description: 'MeliXP 2019 - Test Payment',
    installments: 1,
    payment_method_id: paymentMethodId,
    payer: {
      email: email,
    },
  };
```

The SDK provides a way to create a payment call `save` using the `payment` object

```javascript
  mercadopago.payment.save(paymentData).then(function (payment) {
    res.send(payment);
  }).catch(function (error) {
    res.status(500).send({
      message: error.message
    });
  });
```

The only thing missing is changing the `action` property on the `<form>` previously created

```javascript
<form action="http://localhost:3001/pay" method="post" id="pay" name="pay" onSubmit={this.o+nSubmit}>
```

You are all set!

![Thumbs Up](https://user-images.githubusercontent.com/4379982/63641767-2cbed080-c68a-11e9-97fe-5350d4dc0d0c.gif)

## Questions

Follow me on Twitter [@elhloco‹](https://twitter.com/elhloco‹)
