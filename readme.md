#### Rest api for CRUD with authentication:

###### Steps to run the project :

- clone the project first

```bash
npm i // to install all module node_modules
npm start // to run the app.

```

- before starting the app
  - create a .env file
  - add the following data in it.

```bash
MONGO_URI = mongodb://localhost:27017/rudraInnovative

JWT_SEC = jwtsecretkey

AES_SEC = cryptoJSsecretkey


USER_EMAIL = <ENTER YOUR EMAIL ID>
USER_PASS = <ENTER YOUR PASSWORD>

```

- only authenticated user can update and delete user
- so for that you need to add token inside teh header section of thunderClient or postman like this
  token Bearer <token>
- the token you will get during the login.

check the route appropriately and test.
i.e

```bash
http:localhost:8000/api/auth/register  # for register
http:localhost:8000/api/auth/login  # for login
# and so on ...
```
