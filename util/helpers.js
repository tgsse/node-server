const config = require('dotenv').config()

function getMongoConnectionUri() {
    const mongoUsername = encodeURIComponent(process.env.MONGO_USER)
    const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD)
    const mongoCluster = process.env.MONGO_CLUSTER
    return `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoCluster}.mongodb.net/products?retryWrites=true&w=majority`
}

module.exports = {
    getMongoConnectionUri,
}
