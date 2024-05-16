const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: {
        text: {
            type: String,
            require: true,
        },
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
},
    {
        timestamps: true,
    }
);

const Messages = mongoose.model("Messages", messageSchema);
module.exports = Messages;