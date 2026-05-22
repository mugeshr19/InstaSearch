require("dotenv").config();
require("./config/redis");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoute");

const { connectProducer } = require("./kafka/producer");
const connectConsumer = require("./kafka/consumer");

const MONGO_URL = process.env.MONGO_URL;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("MongoDB connected successfully");
        await connectProducer();
        await connectConsumer();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (err) {

        console.log("database connection error :", err);
    }
};

startServer();
