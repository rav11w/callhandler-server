const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

let latestMessage = null;

app.use(cors());
app.use(express.json());

app.get('/messages', (req, res) => {
  res.json({ message: latestMessage });
});

app.post('/messages', (req, res) => {
  latestMessage = req.body.message;
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
