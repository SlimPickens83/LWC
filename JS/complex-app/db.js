const {MongoClient} = require("mongodb")

const client = new MongoClient("mongodb+srv://mr1983:mercy246@cluster0.lxqplbq.mongodb.net/BlogApp?retryWrites=true&w=majority")

async function start() {
    await client.connect()
    module.exports = client.db()
    const app = require("./app")
    app.listen(3000)
}

start()