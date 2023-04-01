# Bridgewayjs

Bridgewayjs is an open source library that simplifies the creation and management of endpoints
in web applications. Configure your endpoints as objects and easily create methods in a quick
and simple way.

### Installation

To install this library, you can use NPM:

```bash
npm install bridgewayjs
```

To install this library, you can use YARN:

```bash
yarn add bridgewayjs
```

To install this library, you can use PNPM:

```bash
pnpm add bridgewayjs
```

### Usage

Here's a basic example of how to import and use the library in your code:

```javascript
import Bridgewayjs from 'bridgewayjs'

const bridgeway = new Bridgewayjs({
  baseURL: '/v2'
})

const endpoints = [
  {
    method: 'POST',
    route: '/user/:id/edit',
    name: 'userEdit',
    metadata: {
      body: {
        name: {
          required: true,
          type: 'string'
        },
        age: {
          required: false,
          type: 'number'
        }
      },
      headers: {
        token: true
      },
      responseType: 'json',
      query: {
        page: {
          required: true,
          type: 'number'
        }
      }
    }
  }
]

bridgeway.create(endpoints)

bridgeway.methods.userEdit({
  params: { id: 20 },
  body: { name: 'John Doe', age: 37 },
  query: { page: 1 }
})

/**
 * Example of the configuration object generated for a request:
 *
 * {
 *  "data": {
 *    "name": "John Doe",
 *    "age": 37
 *  },
 *  "method": "POST",
 *  "params": {
 *    "page": 1
 *  },
 *  "url": "/user/20/edit"
 * }
 **/
```

### Documentation

To learn more about the library and its capabilities, please refer to the documentation in the "docs"
folder of the repository. The documentation contains detailed information on how to use the library,
as well as code examples and explanations.

### Packages

| Package     | Version |
| ----------- | ------- |
| bridgewayjs | 0.0.1   |

### License

MIT
