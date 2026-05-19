const User = require("../models/User");

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

        const users = await User.find({
            username: {
                $regex: "^" + q,
                $options: "i"
            }
        }).sort({followers: -1}).limit(10);

        res.json(users);    
    }
    catch(err){
        res.status(500).json({error: "Failed to search users"});
    }
};

module.exports = {Insert,Search};