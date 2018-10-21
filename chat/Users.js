const uuidv1 = require('uuid/v1');
const FakeUserDb = require('./db/FakeUserDb');
const UserDb = require('./db/UserDb');


class Users {
    constructor(db) {
        if (db) {
            this._manager = new UserDb(db);
        }
        else {
            this._manager = new FakeUserDb();
        }
    }

    async isExist(token) {
        return await !!this.getByToken(token);
    }

    async getByToken(token) {
        return await this._manager.getByToken(token);
    }

    async getByLogin(login) {
        return await this._manager.getByLogin(login);
    }

    async getAll() {
        return await this._manager.getAll();
    }

    async create({login}) {
        if (!login || login.length < 4)
            throw 'invalid login';

        const existUser = await this.getByLogin(login);

        if (existUser)
            throw 'already used';

        const user = {login, token: uuidv1()};
        return await this._manager.create(user);
    }

    async remove(token) {
        return await this._manager.remove();
    }


}

module.exports = Users;