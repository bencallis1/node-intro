// RESTFUL api's should be state less, use HTTP verbs,
// expose a directory like url pattern and transfer json and or XML

// Include express, lodash, bodyParser, morgan
// we use express for routing and middleware

var express = require('express'),  // require express
    _ = require('lodash'),  // utility library that makes working with objects and arrays easier
    bodyParser = require('body-parser'), // body parser makes it possible to post json to the server
    morgan = require('morgan'),
    app = express(); // create an express app




// MIDDLEWARE is just a function (req,res,next) its just a bunch of callbacks
// We could make api calls query databases whatever we need to do before we go to the next middleware. we either need to end the response cycle  by calling  res.send() or call next()

// There are 5 different types of middleware
// 3rd party, Router Level, Application Level, Error-handeling and built-in

// when ever a request comes in
// it will run through this stack of middleware in the order
// we register them
// using the .use() method, we can setup application middleware
// We can configure express to serve static files
// We could use ejs,jade or some other templating framework for our views. Or just send html file

// Built in MIDDLEWARE

app.use(express.static('client'));

// HTTP request logger middleware for node.js.

app.use(morgan('dev'));


// By default express doesnt know how to handle JSON so we need to handle that
// A new body object containing the parsed data is populated on the request object after the middleware
// This object will contain key-value pairs when extended is true the value can be any type


// body-parser extracts the entire body portion of an incoming request stream and
// exposes it on req.body as something easier to interface with

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// HTTP Verb ,POST,GET,PUT,DELETE
// (CRUD Create,Read,Update,Destroy)

// Create a user to make sure everything is working
// As soon as we restart our server we will lose this data

var users = [
    {
        name:"Sally Rally",
        intro: "hello my name is sally",
        age: "24",
        gender:"female",
        id:"67"
    }
];

//app.param('id', function(req, res, next, id) {
//    var user = _.find(users, {id: id})
//    if (user) {
//        req.user = user;
//        next();
//    } else {
//        res.send();
//    }
//});

var id = 0;

var updateId = function(req, res, next) {
    if (!req.body.id) {
        id++;
        req.body.id = id + '';
    }
    next();
};

var posts = [
    {text:"this is so awesome I am writing awesome node stuff", id:"78"},
    {text:"this is so awesome I am writing awesome node stuff", id:"71"}

];

// make route that gets all /posts respond all posts

app.get('/posts', function(req,res) {
    res.json(posts)
});


app.post('/posts', updateId, function(req,res) {
    var post = req.body;
    posts.push(post);
    res.json(posts)
});


app.get('/posts/:id', function(req,res) {
   var post = _.find(posts, {id:req.params.id});
    res.json(post);
});

app.get('/users', function(req, res){
    res.json(users);
});


// we could pass in middleware on our routes also or an array of middleware
app.post('/users', updateId, function(req, res) {
    var user = req.body;
    users.push(user);
    res.json(user)
});


app.get('/users/:id', function(req, res){
    var user =  req.user;
    res.json(user || {});
});


app.put('/users/:id', function(req, res) {
    var update = req.body;
    console.log(req.body);

    if (update.id) {
        delete update.id
    }

    var user = _.findIndex(users, {id: req.params.id});
    if (!users[user]) {
        res.send();
    } else {
        var updateduser = _.assign(users[user], update);
        res.json(updateduser);
    }

});



app.listen(3000);


