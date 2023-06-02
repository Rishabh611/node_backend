# deploying app to internet

-   Will be deploying to render.

# Saving Data to MongoDB

-   Debugging: Read Later

-   MongoDB - Document Database - NoSQL - MongoDB stores data records as documents (specifically BSON documents) which are gathered together in collections. A database stores one or more collections of documents. - Collections
    MongoDB stores documents in collections. Collections are analogous to tables in relational databases. - MongoDB stores data records as BSON documents. BSON is a binary representation of JSON documents, though it contains more data types than JSON. - username rishabsinghrock password YcsVMoNUihHkfBGX - connection string: mongodb+srv://rishabsinghrock:<password>@cluster0.obgbsat.mongodb.net/?retryWrites=true&w=majority - We could use the database directly from our JavaScript code with the official MongoDB Node.js driver library, but it is quite cumbersome to use. We will instead use the **Mongoose library** that offers a higher-level API. - `npm install mongoose` - `const mongoose = require('mongoose')` <= require mongoose - `const url =
`mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/?retryWrites=true&w=majority`` <+= mongo db connection url -
