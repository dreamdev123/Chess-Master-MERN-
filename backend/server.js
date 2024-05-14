const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morganBody = require('morgan-body');
require('dotenv').config();

// bring routes
const seeks = require('./routes/seeks');
const game = require('./routes/game');


const app = express();

// db
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true,
}).then(() => console.log('db connected')).catch(err => console.log(err));
// middleware

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
morganBody(app, { logReqUserAgent: false });


if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// routes middleware
app.use('/api', seeks);
app.use('/api', game);


// port
const port = process.env.PORT || 8000;


app.listen(port, () => {
  console.log(`server is running on port ${port} `);
});
