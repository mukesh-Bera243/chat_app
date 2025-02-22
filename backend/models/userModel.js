const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        min: 3,
        max: 50,
        unique: true,
    } ,
    email:{
        type: String,
        require: true,
        max: 50,
        unique: true,
    } ,
    password:{
        type: String,
        require: true,
        min: 8,
    },
    isAvatarImageSet:{
        type: Boolean,
        default:false,
    },
    avatarImage:{
        type: String,
        default:"",
    }
})

// module.exports = mongoose.model("Users", userSchema);
// Register the User model with mongoose
const User = mongoose.model("User", userSchema);

module.exports = User;