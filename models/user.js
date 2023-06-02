// import required modules/packages
const mongoose = require("mongoose");

// user schema instance
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },    
});

// userSchema model instance
const User = mongoose.model("user", userSchema);

// export model instance
module.exports = User;