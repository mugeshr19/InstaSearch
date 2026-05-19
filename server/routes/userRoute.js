const express = require("express");
const router = express.Router();
const {Insert,Search} = require("../controllers/userController");

router.post("/user",Insert);
router.get("/search", Search);

module.exports = router;