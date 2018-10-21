class UserDb {

    constructor(db) {
        this._db = db;
    }

    get users() {
        return this._db.collection('chatusers');
    }

    async create(user) {
        await this.users.insertOne(user);
        return user;
    }

    async getByLogin(login) {
        return this.users.find({login: login}).limit(1);
    }

    async getAll() {
        return this.users.find({});
    }

    async getByToken(token) {
        return this.users.find({token: token}).limit(1);
    }

    async remove(token) {
        return await this.users.deleteMany({token: token});
    }
}

module.exports = UserDb;