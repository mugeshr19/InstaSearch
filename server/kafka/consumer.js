const kafka = require("../config/kafka");
const elasticClient = require("../config/elasticsearch");

const consumer = kafka.consumer({groupId: "user-events-group"});

const connectConsumer = async()=>{
    await consumer.connect();

    await consumer.subscribe({
        topic: "user-events",
        fromBeginning: true
    });
    console.log("kafka Consumer Connected");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(
                `Received from partition ${partition}`
            );

            const data = JSON.parse(
                message.value.toString()
            );

            console.log("Received Event:", data);

            if (data.type === "USER_CREATED") {

                await elasticClient.index({
                    index: "users",
                    document: {
                        username: data.payload.username,
                        followers: data.payload.followers
                    }
                });

                console.log("Inserted into Elasticsearch");
            }
        }
    });
}

module.exports = connectConsumer;