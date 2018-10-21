class FakeMessagesDb {

    constructor() {
        this._messages = []
    }

    get messages() {
        return this._messages;
    }

    async create(message) {
        return await this.messages.push(message);
    }

    async getAll() {
        return await this.messages;
    }

    // async remove(token) {
    //     const userIndex = this.users.findIndex(s => s.token === token);
    //     if (userIndex > -1)
    //         this._users.splice(userIndex, 1);
    //     return await Promise.resolve();
    // }
}

module.exports = FakeMessagesDb;