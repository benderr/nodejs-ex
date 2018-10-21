const uuidv1 = require('uuid/v1');
const FakeMessagesDb = require('./db/FakeMessagesDb');
const MessagesDb = require('./db/MessagesDb');


class Messages {

    constructor(db) {
        if (db) {
            this._manager = new MessagesDb(db);
        }
        else {
            this._manager = new FakeMessagesDb();
        }
    }

    async getAll() {
        return await this._manager.getAll();
    }

    async create(message) {
        return await this._manager.create(message);
    }

    createMessageModel({text}, user) {
        if (!text || text.length < 3)
            throw 'invalid text';
        return {
            id: uuidv1(),
            text,
            time: new Date().getTime(),
            from: user.login
        };
    }

    async remove(token) {
        return await this._manager.remove();
    }


}

module.exports = Messages;