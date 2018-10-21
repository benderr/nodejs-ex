//dbDetails = new Object();

const MongoConnector = function ({mongoURL, mongoURLLabel}) {
    console.log('=============MongoDB=============', mongoURL);
    if (mongoURL == null) return Promise.reject('no mongo url');

    const mongodb = require('mongodb');
    if (mongodb == null) return Promise.reject('no mongo lib');

    return new Promise((resolve, reject) => {
        mongodb.connect(mongoURL, function (err, conn) {
            if (err) {
                reject(err);
                return;
            }

            //db = conn;
            //dbDetails.databaseName = db.databaseName;
            //dbDetails.url = mongoURLLabel;
            //dbDetails.type = 'MongoDB';

            console.log('Connected to MongoDB at: %s', mongoURL);

            resolve(conn);
        });
    });
};

module.exports = MongoConnector;