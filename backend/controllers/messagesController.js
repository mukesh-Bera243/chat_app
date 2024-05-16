const messageModel = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try{
        console.log("LLLLLLL")
        const {from, to, message} =req.body;
        const data = await messageModel.create({
            message: {text: message},
            users: [from, to],
            sender: from,
        });
        if(data) return res.json({msg: "Messageadded successfully."});
        return res.json({msg: "Faild to add message to the database."})

    } catch(ex){
        next(ex)
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try{
        console.log("kkkkkkkk")
        const {from, to} = req.body;
        const messages = await messageModel.find({
            users:{
                $all: [from, to],
            }
        }).populate('sender').sort({updatedAt: 1});
        // }).sort({updatedAt: 1});
        const projectMessages = messages.map((msg)=>{
            return {
                fromSelf: msg.sender._id.toString() === from,
                message: msg.message.text,
                senderName: msg.sender?.username,
                updatedAt: msg.updatedAt,
            };
        });
        res.json(projectMessages)
    } catch(ex){
        next(ex)
    }
}