const express = require('express');
const DBConnection = require('./Database');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5500;
const routes = require('./Routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {

    origin: 'http://localhost:3000',
    credentials: true, // access-control-allow-credentials:true
    optionSuccessStatus: 200
};


app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/storage',express.static('storage'))


app.use(express.json({limit:'8mb'}));
app.use(routes);
DBConnection();

app.listen(PORT, () => {
    console.log(`Server is listning on PORT ${PORT}`);
})
