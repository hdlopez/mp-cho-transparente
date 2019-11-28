> Traducción a portugués está pendiente. Se aceptan PRs :)

# Como desenvolver uma integração de pagamentos em menos de 30 minutos

La idea de este repositorio es brindar una guía paso a paso de cómo hacer una integración por API (también conocido como checkout transparente) de [MercadoPago](https://developers.mercadopago.com).

> En esta guía todos los comandos están orientados Mac OS X. Se deberán adaptar los mismos para otros sistemas operativos

## Tecnologías utilizadas

En este ejemplo se utiliza [nodejs](https://www.freecodecamp.org/news/what-exactly-is-node-js-ae36e97449f5/) para el desarrollo tanto del frontend como el backend de la apicación.

Algunos links útiles:

* [create-react-app](https://www.npmjs.com/package/create-react-app) - Frontend Application
* [express](https://npmjs.com/package/express) - Framework para el desarrollo de nuestro backend
* [mercadopago](https://npmjs.com/package/mercadopago) - Mercado Pago official SDK


## Tabla de contenido
 1. [Creando la aplicación](#Paso-1---Creando-la-aplicación)
 2. [Agregando la SDK de MercadoPago](#Paso-2---Agregando-la-SDK-de-MercadoPago)
 3. [Formulario de pagos](#Paso-3---Formulario-de-pagos)
 4. [Agregando dinamismo a nuestro formulario de pago](#Paso-4---Agregando-dinamismo-a-nuestro-formulario-de-pago)
 5. [Creando el Card Token](#Paso-5---Creando-el-Card-Token)
 6. [Creando API para realizar el pago](#Paso-6---Creando-API-para-realizar-el-pago)

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

## Paso 4 - Agregando dinamismo a nuestro formulario de pago

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

En este paso encriptaremos los datos de tarjeta de forma segura desde nuestro frontend directo contra el entorno de MercadoPago respetando el estándar (PCI)[https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard].

Para lograrlo nuevamente la *SDK de MercadoPago* provee una función llamada `createToken` que nos permite realizar esta tarea. En nuestro caso, una vez que el usuario realice el *submit* realizaremos la encriptación y posteriormente en pasos siguientes dejaremos continuar para poder realizar el pago

Agregamos el evento `onSubmit` a nuestro formulario junto con una función dentro de nuestro componente llamada igual.

```javascript
<form action="" method="post" id="pay" name="pay" onSubmit={this.onSubmit}>
```

Dentro de la función `onSubmit` utilizaremos `createToken` y para manejar la respuesta implementamos un *callback* llamado `sdkResponseHandler`.

```javascript
class App extends Component {
  constructor(props){
    ...
    ...
    this.sdkResponseHandler = this.sdkResponseHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      submit: false,
    };

  }
  ...
  ...

  onSubmit(event) {
    event.preventDefault();

    const form = document.querySelector('#pay');

    window.Mercadopago.createToken(form, this.sdkResponseHandler); // The function "sdkResponseHandler" is defined below

    return false;
  }

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
  }
```

## Paso 6 - Creando API para realizar el pago

El formulario de pago anterior tiene la responsabilidad de recolectar la información del pago, pero falta la parte *más importante! hacer el pago! :)*

Cuando el usuario realice "click" en pagar, la siguiente información será enviada en via POST del formulario

* email - Payer email
* paymentMethodId - Payment Method Id
* token - Card Token

Para finalizar el tutorial se deja como ejemplo cómo recibir el pago en un backend muy sencillo realizado con nodejs + express.

### Creando la API

Creemos una carpeta llamada `/api` y realicemos un init utilizando NPM.

```
$ npm init
```

Ahora instalemos algunas dependencias que serán útiles:

* [express](https://npmjs.com/package/express) - Web Framework
* [body-parser](https://npmjs.com/package/body-parser) - Útil para manejar el *body message*
* [mercadopago](https://npmjs.com/package/mercadopago) - SDK nodejs de MercadoPago

Ejecutar el siguiente comando para instalarlos:

```
$ npm install express body-parser mercadopago --save
```

### Realizando el pago

Dentro de la carpeta `app` crear un archivo vacío llamado *index.js*. 

A continuación se deja un ejemplo completo de cómo manejar el pago desde el backend. Copiar y pegar el código debajo en el archivo `app/index.js`.

``` javascript
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
    console.log(`There was an error making the payment ${error.message}`);
    res.status(500).send({
      message: error.message
    });
  });
});

console.log(`Application listening on port ${port}`);

app.listen(port);
```

*Importante* nuevamente aquí substituir el texto *YOUR_SANDBOX_ACCESS_TOKEN* por tu **access token** y asegurarse que sea válido.

## Questions

Sígueme en Twitter [@elhloco‹](https://twitter.com/elhloco‹). PRs are welcome :)
