const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(morgan("tiny"));
app.use(express.json());

// connecting Database
mongoose.connect(process.env.MONGO_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("Database connected successfully.");
});

// passing CORS headers
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  next();
});

app.get('/', (req, res) => {
  return res.status(200).json({
    data: [],
    message: 'Server running properly'
  })
})

app.use('/authentication', require('./Routes/AuthenticationRoutes'));
app.use('/users', require('./Routes/UserRoutes'));
app.use('/interview', require('./Routes/InterviewRoutes'));

// Starting the server
app.listen(process.env.PORT, () =>
  console.log(`Server started on PORT`, process.env.PORT)
);
