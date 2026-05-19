const User = require("../models/User");
const redisClient = require("../config/redis");

const Insert = async(req,res)=>{
    try{
        const {username,followers} = req.body;
        const exists = await User.findOne({username});
        if(exists){
            return res.status(400).json({message:"User already exists"});
        }
        const user = await User.create({
            username,
            followers
        });

        res.json(user);
    }
    catch(err){
        res.status(500).json({error: "Failed to create user"});
    }
};

const Search = async(req,res)=>{
    try{
        const q = req.query.q;

        if (!q) {
            return res.status(400).json({
                message: "Search query required"
            });
        }

        const cacheKey = `search:${q}`;
        const cachedUsers = await redisClient.get(cacheKey);
        if(cachedUsers){
            console.log("Cache Hit");
            return res.json(JSON.parse(cachedUsers));
        }
        console.log("Cache Miss");

        const users = await User.find({
            username: {
                $regex: "^" + q,
                $options: "i"
            }
        }).sort({followers: -1}).limit(10);
        
        await redisClient.setEx(
            cacheKey,
            60,
            JSON.stringify(users)
        );

        res.json(users);    
    }
    catch(err){
        res.status(500).json({error: "Failed to search users"});
    }
};

module.exports = {Insert,Search};