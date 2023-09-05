require('dotenv').config({ path: './secrets/.env'})

function getMongoConnectionUri() {
    const mongoUsername = encodeURIComponent(process.env.MONGO_USER)
    const mongoPassword = encodeURIComponent(process.env.MONGO_PASSWORD)
    const mongoCluster = process.env.MONGO_CLUSTER
    const mongoCollection = process.env.MONGO_COLLECTION
    return `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoCluster}.mongodb.net/${mongoCollection}?retryWrites=true&w=majority`
}

module.exports = {
    getMongoConnectionUri,
}
