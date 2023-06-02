// import required modules/packages
const express = require("express");

// router instance
const router = express.Router();

// app endpoints
router.get("/", (req, res)=>{
    res.status(200).send("Routes working");
});

// export router instance
module.exports = router;