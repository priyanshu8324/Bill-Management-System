const mongoose = require('mongoose');  // connecting monogodb
const express = require('express');// connecting express
const cors = require('cors');//connecting crosss origin
const app = express();
const port = process.env.PORT || 5000;
//connecting with  mongodb compass 
mongoose.connect('mongodb://127.0.0.1:27017/vcet')
    //connectivity string =adress+data
    .then(() => {
        console.log('Connected to vcet database');
    })
    .catch((err) => {
        console.error(err);
    });

const UserSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    items: [
        {
            itemName: { type: String },
            quantity: { type: Number },
            itemCode: { type: String },
            price: { type: Number },
            total: { type: Number },
        }
    ]
});


const Collections = mongoose.model('homes', UserSchema);

app.use(express.json());
app.use(cors());

// app.get('/getting', async (req, resp) => {
//     try {
//         const users = await Collections.find({}, 'name email date');
//         resp.json(users);
//     } catch (e) {
//         console.error(e);
//         resp.status(500).send('Failed to retrieve user data');
//     }
// });
//post method
app.post('/register', async (req, resp) => {
    try {  //postman-- req  - guru and mail // response
        const user = new Collections(req.body);
        const result = await user.save();
        const datasending = result.toObject();
        // converting all datas to obj
        resp.send(datasending);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Something Went Wrong');
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});