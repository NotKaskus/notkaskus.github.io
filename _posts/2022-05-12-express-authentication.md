---
layout: post # Posts should use the post layout
title: How to create a authentication middleware with ENMAP in NodeJS # Post title
date: 2022-05-12 # Publish date in YYYY-MM-DD format
tags: [nodejs, api, security] # A list of tags
splash_img_source: /assets/img/authentication.png
splash_img_caption: 
pin: false
listed: true
---

In this tutorial, I will going to walk you through everything you need to know in order to build a very simeple secure API server with Express.js and Enmap.

It’s pretty simple to write code and develop applications. Yet, how do we deal with authentication, and most likely, authorization?

# What is authentication and authorization
Authentication and authorization are used in security, especially when gaining access to a system. However, there is a considerable difference between gaining access to a property (authentication) and what you can do while inside (authorization).

# What is Enmap
Enmap stands for "Enhanced Map", and is a data structure based on the native JavaScript Map() structure with additional helper methods from the native Array() structure. Enmap also offers persistence, which means it will automatically save everything to save to it in a database, in the background, without any additional code or delays.

# Prerequisites
To follow along with this tutorial, you will need:
* A working knowledge of JavaScript.
* A good understanding of Node.js.
* [Meet Enmap pre-requisites requirements](https://enmap.evie.dev/install/#pre-requisites){:target="_blank"}

# Building a Simple Express.js API
Before we get into the authentication part, let’s build a simple Express.js API server that we can use to secure later.

## Step 1 - Create a directory and initialize
To get started, create a new folder somewhere and initialize npm, we’ll use this for our example:

* Windows power shell

```powershell
mkdir example

cd example

npm init -y
```

## Step 2 - Create files and directories
First of all we’ll create ou source directory with the name `src`. This directory will contain the following files and folders that we’ll create in coming steps.

```
├── src/                * all source code in here
| └── database/         * all models schema file here
| |   └── models/       * all models file
| |   |   └── user.js   * the user schema
| |   └── main.js       * the enmap database
| └── middleware/       * all middleware file here, for check before next to api
| |   └── auth.js       * the authentication middleware to check if the user/key is valid
| └── app.js            * the app main file
└── .env                * the app environment variable
```

## Step 3 - Installing dependencies
We’ll install several dependencies like enmap, uuid, express, dotenv, body-parser and development dependency like nodemon to restart the server as we make changes automatically.

We'll install uuid because we'll need it later for authentication.

```powershell
npm install express enmap uuid body-parser dotenv

npm install nodemon -D 
```

## Step 4 - Create a Node.js server and connect your database
Now, let’s create our Node.js server and connect our database by adding the following code to your `app.js` , `database/main.js` and `.env` in that order.

In our `src/database/main.js`:

```js
const Enmap = require('enmap');

// non-cached, auto-fetch enmap: 
const database = new Enmap({
  name: "EnmapDatabase",
  autoFetch: true,
  fetchAll: false
});

module.exports = database;
```

In our `src/app.js`:
```js
'use strict';

// Global Variable
require('dotenv').config();
const PORT = process.env.PORT;
// Main Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// App configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.get('/api/test', function(req, res) {
  res.json({ test: 'successful!' });
});

// server listening 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

If you notice, our file needs some environment variables. You can create a new `.env` file if you haven’t and add your variables before starting our application.

In our `.env`:

```
PORT=4545
```

To start our server, edit the scripts object in our `package.json` to look like the one shown below.

```json
"scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```

Execute the command `npm run dev`.
Both the server and the database should be up and running without crashing.

## Step 5 - Create our user model and route
We'll create schema for the user credentials when registering and validate them against the saved credentials when logging in.

Add the following code to `user.js` inside the `src/database/models/` folder.

In our `src/database/models/user.js`:

```js
const userSchema = (username, email, token) => {
    return {
        username: username,
        email: email,
        token: token
    }
};

module.exports = userSchema;
```

Now let’s create the routes for register and login, respectively.

In `app.js` in the `src/` directory, add the following code for the registration and login.

In `src/app.js`

```js
// import uuid module
const { v4: uuidv4, validate } = require('uuid');

// importing user model and enmap
const enmap = require('./database/main');
const userSchema = require("./database/models/user");

// Register
app.post("/register", (req, res) => {
// our register logic goes here...
});

// Login
app.post("/login", (req, res) => {
// our login logic goes here
});
```
## Step 6 - Implement register and login functionality
We’ll be implementing these two routes in our application. We will be using uuid to generate a token for our user before storing them in our enmap database.

In the `/register` route, we will:
* Get user input.
* Validate user input
* Check if the user already exists.
* Generate a unique uuid for the user token
* Create a user in our database.

Modify the `/register` route structure we created earlier to look as shown below.

In our `app.js`:

```js
// ...

// Register
app.post("/register", (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const { email, username } = req.body;

        // Validate user input
        if (!email && username)
            return res.status(400).send("email and username input is required");
        if (!email) 
            return res.status(400).send("email input is required");
        if (!username)
            return res.status(400).send("username input is required");

        // Validate if user already exist in our database
        if (enmap.has(email))
            return res.status(409).send("User Already Exist. Please Login");

        // Create token for our user
        const token = uuidv4();

        // Save the user schema in the memory
        const User = userSchema(username, email, token);
        
        // Create user in our database
        enmap.ensure(email, User);

        // return new user
        res.status(201).json(User);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send(err.message);
    }
    // Our register logic ends here
});

// ...
```

Using [ReqBin HTTP API Client](https://reqbin.com/){:target="_blank"} to test the endpoint, we’ll get the response shown below after successful registration.

![Register Response 1](/assets/img/request-test-1.png)
![Register Respoins 2](/assets/img/request-test-2.png)

For the `/login` route, we will:
* Get user input.
* Validate user input.
* Check if the user exists.
* Verify user password against the password we saved earlier in our database.

Modify the `/login` route structure we created earlier to look like shown below.

```js
// ...

app.post("/login", (req, res) => {

    try {
        // Our login logic starts here
        // Get user input
        const { email } = req.body;

        // Validate user input
        if (!email) {
            return res.status(400).send("email input is required");
        }
    
        // Validate if user exist in our database
        if (!enmap.has(email)) {
            return res.status(409).send("User Doesn't Exist. Please Register");
        } else {
            // Get the user data
            const userData = enmap.get(email);
            
            // Return it to the user
            return res.status(201).json(userData);
        }
    } catch (err) {
        console.log(err.stack);
        return res.status(500).send(err.message);
    }
    
    // Our login logic ends here
});

// ...
```

Again using [ReqBin HTTP API Client](https://reqbin.com/){:target="_blank"} to test, we’ll get the response shown below after a successful login.

![Login Response 1](/assets/img/login-test-1.png)
![Login Respoins 2](/assets/img/login-test-2.png)

## Step 7 - Create middleware for authentication
We can successfully create and log in a user. Now, we’ll create a route that requires a user token in the header, which is the uuid token we generated for the user.

Add the following code inside `auth.js`.

In our `src/middleware/auth.js`

```js
// import enmap database
const enmap = require('../database/main');

const authentication = (req, res, next) => {
    // Get token from X-Access-Token header
    const token = req.get('X-Access-Token');

    // Check if there is X-Access-Token header
    if (!token)
        return res.status(403).send("X-Access-Token header is required for authentication");

    // Validate token
    if (!enmap.find(val => val.token === token))
        return res.status(401).send("Invalid Token");

    return next();
};

module.exports = authentication;
```

Now let’s create the `/welcome` route and update `app.js` with the following code to test the middleware.

```js
const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
```

See the result below when we try to access the `/welcome` route we just created without passing a token in the header with the `X-Access-Token` key.

![Middleware Respoins 1](/assets/img/middleware-test-1.png)
![Middleware Respoins 2](/assets/img/middleware-test-2.png)

We can now add a token in the header with the key `X-Access-Token` and re-test.

See the image below for the response.

![Middleware Respoins 3](/assets/img/middleware-test-3.png)
![Middleware Respoins 4](/assets/img/middleware-test-4.png)

You can [click here](https://github.com/NotKaskus/simple-express-auth){:target="_blank"} to check the complete code on GitHub.

# Conclusion
It’s quite simple to secure a REST API using HTTP Basic Auth. By writing middleware which inspects the HTTP Authorization header and looks for user credentials, then authenticates the incoming request properly, you can build a secure API server without too much trouble. 

If you’d like to learn more about how the [Enmap](https://enmap.evie.dev/){:target="_blank"} library works, and how to use it, be sure to check out the [official documentation](https://enmap.evie.dev/){:target="_blank"}.

Happy coding!

# Resources
* [Enmap](https://enmap.evie.dev/){:target="_blank"}
* [Uuid](https://www.npmjs.com/package/uuid){:target="_blank"}
* [Node.js](https://nodejs.org/){:target="_blank"}
* [ExpressJS](https://expressjs.com/){:target="_blank"}