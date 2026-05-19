const User = require("../models/User");
const redisClient = require("../config/redis");
const elasticClient = require("../config/elasticsearch");

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
        await elasticClient.index({
            index: "users",
            document: {
                username: user.username,
                followers: user.followers
            }
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

       /*  const users = await User.find({
            username: {
                $regex: "^" + q,
                $options: "i"
            }
        }).sort({followers: -1}).limit(10); */

        const result = await elasticClient.search({
            index: "users",
            /* query:{
                match:{
                    username:q
                }
            } */
           query: {
                bool: {
                    should: [
                        {
                            match_phrase_prefix: {
                                username: q
                            }
                        },
                        {
                            fuzzy: {
                                username: {
                                    value: q,
                                    fuzziness: "AUTO"
                                }
                            }
                        }
                    ]
                }
            },
           sort: [
                {
                    followers: {
                        order: "desc"
                    }
                }
            ]
        });

        const users = result.hits.hits.map(
            item => item._source
        );


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