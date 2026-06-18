const express = require("express");
const app = express();
const router = require('./routes/webRoutes')

app.use(router);

app.listen(3001, () => {
    console.log("Server running on port 3001");
});