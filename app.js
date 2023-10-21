const express = require('express');
const bodyParser = require('body-parser');
const mangoose = require('mongoose');
const ContentRoute = require('./routes/Content-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const { default: mongoose } = require('mongoose');

const app = express();

app.use(bodyParser.json());

app.use('/api/content', ContentRoute);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({ message: error.message || 'An unknown error occurred!' });
});
mongoose.connect("mongodb+srv://farhad:farhad@cluster0.d5fo7w0.mongodb.net/mern?retryWrites=true&w=majority").then(res => {
  app.listen(9000);
  console.log("connected Successfully")
}).catch(err => {
  console.log(err)
})
