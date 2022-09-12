const express = require('express');
const DBConnection = require('./Database');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5500;
const routes = require('./Routes');

app.use(express.json());
app.use(routes);

DBConnection();

app.listen(PORT,()=>{
    console.log(`Server is listning on PORT ${PORT}`);
})