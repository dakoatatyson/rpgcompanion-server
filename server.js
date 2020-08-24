// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
const { raw } = require('express');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/rpgcompanion");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Model
var User = mongoose.model('User', {
    email: String,
    password: String
});

// Get all user with email and password.
app.get('/api/users', function (req, res) {

    console.log("Listing users...");
    //use mongoose to get all user in the database
    User.findOne({ email: req.params.email, password: req.params.password }, function (err, user) {
        if (err) {
            res.send(err);
        }

        res.json(user);
    });
});

// Create a user Item
app.post('/api/users', function (req, res) {

    console.log("Creating user...");

    User.create({
        email: req.body.email,
        password: req.body.password,
        done: false
    }, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});

// Update a user
app.put('/api/users/:id', function (req, res) {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    console.log("Updating user - ", req.params.id);
    User.update({_id: req.params.id}, user, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});


// Delete a user
// app.delete('/api/groceries/:id', function (req, res) {
//     Grocery.remove({
//         _id: req.params.id
//     }, function (err, grocery) {
//         if (err) {
//             console.error("Error deleting grocery ", err);
//         }
//         else {
//             Grocery.find(function (err, groceries) {
//                 if (err) {
//                     res.send(err);
//                 }
//                 else {
//                     res.json(groceries);
//                 }
//             });
//         }
//     });
// });


// Start app and listen on port 8080  
app.listen(process.env.PORT || 8080);
console.log("Grocery server listening on port  - ", (process.env.PORT || 8080));