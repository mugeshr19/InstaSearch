const kafka = require("../config/kafka");

const producer = kafka.producer();

const connectProducer = async () => {
    await producer.connect();
    console.log("Kafka Producer Connected");
};

const getPartition = (username) => {

    const firstLetter = username[0].toUpperCase();

    if (firstLetter >= "A" && firstLetter <= "M") {
        return 0;
    }

    return 1;
};

module.exports = {
    producer,
    connectProducer
};