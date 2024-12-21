const { MongoClient, ObjectId } = require('mongodb')

const { uri } = require('../secrets/mongodb.json')

const client = new MongoClient(uri)

//ensure the getCollection function isn't called repeatedly
let isConnected = false

const getCollection = async (dbName, collectionName) => {
    if (!isConnected) {
        await client.connect()
        isConnected = true
    }
    return client.db(dbName).collection(collectionName)
}
module.exports = { getCollection, ObjectId }