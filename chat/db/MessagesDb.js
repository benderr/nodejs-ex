class UserDb {

    constructor(db) {
        this._db = db;
    }

    get messages() {
        return this._db.collection('messages');
    }

    async create(message) {
        return await this.messages.insertOne(message);
    }

    async getAll() {
        return this.users.find({}).limit(5000);
    }

    // async remove(token) {
    //     return await this.users.deleteMany({token: token});
    // }
}

module.exports = UserDb;