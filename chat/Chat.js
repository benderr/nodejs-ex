const MongoConnector = require('./db/MongoConnector');
const Messages = require('./Messages');
const Users = require('./Users');
const Connections = require('./Connections');

class Chat {

    constructor(options) {
        this._options = options;
        this._messageSubscribers = [];

        /**
         * @type {Users}
         */
        this._users = null;
        this._messages = null;
        this._connections = null;
    }

    async run({socketOptions}) {
        const db = await this._tryConnectToMongo();
        this._users = new Users(db);
        this._messages = new Messages(db);
        this._connections = new Connections(socketOptions);

        this.subscribeSent(message => this._messages.create(message));
        this.subscribeSent(message => this._connections.broadcastMessage(message));
    }

    subscribeSent(func) {
        this._messageSubscribers.push(func);
    }

    publishSent(message, user) {
        this._messageSubscribers.forEach(func => func(message, user));
    }

    async _tryConnectToMongo() {
        try {
            if (!this._options.mongoURL)
                throw 'no mongo config';
            const db = await MongoConnector(this._options);
            return await db;
        } catch (err) {
            console.log("couldn't connect mongo, fake used");
            return null;
        }
    }

    async rejectIfAnonymous(token) {
        const isExist = await this._users.isExist(token);
        // if (!isExist)
        //     throw  401;
    }

    async sendMessage(token, message) {
        await this.rejectIfAnonymous(token);
        const user = await this._users.getByToken(token);
        const messageModel = this._messages.createMessageModel(message, user);
        this.publishSent(messageModel, user);
        return messageModel;
    }

    async getHistory(token) {
        await this.rejectIfAnonymous(token);
        const messages = await this._messages.getAll();
        return await messages;
    }

    async registerUser(userData) {
        const user = await  this._users.create(userData);
        return await user;
    }

    async getUsers(token) {
        const users = await  this._users.getAll();
        //todo merge active
        return await users.map(s => {
            s.active = !!this._connections.getConnection(token);
            return s;
        });
    }
}

module.exports = Chat;