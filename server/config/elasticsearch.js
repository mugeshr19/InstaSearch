const { Client } = require("@elastic/elasticsearch");

const elasticClient = new Client({
    node: "https://localhost:9200",
    auth: {
        username: "elastic",
        password: "GXPuRn5XnnY_kBG9ep07"
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = elasticClient;