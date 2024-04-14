const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/message', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});