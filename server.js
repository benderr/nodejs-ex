//  OpenShift sample Node application
var express = require('express'),
    app = express(),
    Chat = require('./chat/Chat'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');

Object.assign = require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(cors());

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null) {
    var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
    // If using plane old env vars via service discovery
    if (process.env.DATABASE_SERVICE_NAME) {
        var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
        mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
        mongoUser = process.env[mongoServiceName + '_USER'];

        // If using env vars from secret from service binding
    } else if (process.env.database_name) {
        mongoDatabase = process.env.database_name;
        mongoPassword = process.env.password;
        mongoUser = process.env.username;
        var mongoUriParts = process.env.uri && process.env.uri.split("//");
        if (mongoUriParts.length == 2) {
            mongoUriParts = mongoUriParts[1].split(":");
            if (mongoUriParts && mongoUriParts.length == 2) {
                mongoHost = mongoUriParts[0];
                mongoPort = mongoUriParts[1];
            }
        }
    }

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    }
}


/**
 * @type {Chat}
 */
const chat = new Chat({mongoURL, mongoURLLabel});

chat.run();

app.get('/', function (req, res) {
    res.render('index.html', {pageCountMessage: null});
});

app.get('/test', async function (req, res) {
    try {
        const user = await chat.registerUser({login: 'test'});
        const user2 = await chat.registerUser({login: 'test2'});
        await chat.sendMessage(user.token, {text: 'test message'});
        await chat.sendMessage(user2.token, {text: 'test message 2'});
        const messages = await chat.getHistory();
        res.json(messages);
    } catch (er) {
        res.status(500).json({error: er});
    }
});

app.post('/users', async function (req, res) {
    try {
        console.log('====REQUEST=========', req.body);
        const user = await chat.registerUser({login: 'test'});
        res.json(user);
    } catch (er) {
        res.status(500).json({error: er});
    }
});

app.get('/users', async function (req, res) {
    try {
        const users = await chat.getUsers();
        res.json(users);
    } catch (er) {
        res.status(500).json({error: er});
    }
});

app.get('/messages', async function (req, res) {
    try {
        const messages = await chat.getHistory();
        res.json(messages);
    } catch (er) {
        res.status(500).json({error: er});
    }
});

app.post('/messages', async function (req, res) {
    try {
        const users = await chat.getUsers();
        const message = await chat.sendMessage(users[0].token, {text: 'test message'});
        res.json(message);
    } catch (er) {
        res.status(500).json({error: er});
    }
});

// error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
});

app.listen(port, ip);

module.exports = app;
