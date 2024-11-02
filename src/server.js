const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/billingSystem', { useNewUrlParser: true, useUnifiedTopology: true });

const billSchema = new mongoose.Schema({
  billNumber: Number,
  items: [{ itemName: String, quantity: Number, itemCode: String, price: Number, total: Number }],
});

const Bill = mongoose.model('Bill', billSchema);

app.post('/api/bills', async (req, res) => {
  const { billNumber, items } = req.body;

  try {
    const newBill = new Bill({ billNumber, items });
    await newBill.save();
    res.status(201).json(newBill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/bills', async (req, res) => {
  const { billNumber } = req.query;

  try {
    if (billNumber) {
      const bill = await Bill.findOne({ billNumber });
      if (bill) {
        res.json(bill);
      } else {
        res.status(404).json({ error: 'Bill not found' });
      }
    } else {
      const bills = await Bill.find();
      res.json(bills);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
