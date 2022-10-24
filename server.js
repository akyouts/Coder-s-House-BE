const express = require('express');
const DBConnection = require('./Database');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5500;
const routes = require('./Routes');
const cors = require('cors');
const corsOptions = {

    origin: 'http://localhost:3000',
    credentials: true, // access-control-allow-credentials:true
    optionSuccessStatus: 200
};


app.use(cors(corsOptions));


app.use(express.json());
app.use(routes);
DBConnection();

app.listen(PORT, () => {
    console.log(`Server is listning on PORT ${PORT}`);
})
