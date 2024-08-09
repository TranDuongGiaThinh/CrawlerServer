require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

const DataModel = require ('./models/data_model')

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, async ()  => {
  console.log(`Server is running at http://localhost:${port}`);

  const data = await DataModel.findAll()

  console.log(data)
});