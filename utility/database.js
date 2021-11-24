const mongodb = require('mongodb');
const { get } = require('../routes/user');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect
        ('mongodb+srv://furkanalptokac:1112@argeoneri.muqig.mongodb.net/ArgeOneri?retryWrites=true&w=majority')
        .then(client => {
            console.log('Connected successfully.');
            _db = client.db();
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getdb = () => {
    if (_db) {
        return _db;
    }
    
    throw 'No database.'
}

exports.mongoConnect = mongoConnect;
exports.getdb = getdb;