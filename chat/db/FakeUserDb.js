class FakeUserDb {

    constructor() {
        this._users = []
    }

    get users() {
        return this._users;
    }

    async create(user) {
        return await this.users.push(user);
    }

    async getByLogin(login) {
        return await this.users.find(s => s.login === login);
    }

    async getAll() {
        return await this.users;
    }

    async getByToken(token) {
        return await this.users.find(s => s.token === token);
    }

    async remove(token) {
        const userIndex = this.users.findIndex(s => s.token === token);
        if (userIndex > -1)
            this._users.splice(userIndex, 1);
        return await Promise.resolve();
    }
}

module.exports = FakeUserDb;