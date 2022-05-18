const router = require("express").Router();
const MsgModel = require("../models/Msg.model");
const JobsModel = require("../models/Jobs.model.js");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");


router.post("/new-msg", isAuth, attachCurrentUser, async (req, res) => {

    try{
        const loggedInUser = req.currentUser
        const newMsg = await MsgModel.create({
            ...req.body,
            user: loggedInUser._id,
        });
        

        const idMsg = await JobsModel.findByIdAndUpdate(
            {_id: newMsg.jobs},
            {$push: {msg: newMsg._id }},
            {runValidators: true, new: true}  
        )
    }catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
})
router.get("/all-msg", isAuth, attachCurrentUser, async (req, res) => {

    try{ 
        console.log(req.body)
        const getMsg = await JobsModel.find().populate("msg").populate("user")
        //fazer dois finds. Um com o Id do dono da msg e outro com o Id dono do jobs(fazer populate no job)
        console.log(getMsg)
        return res.status(200).json(getMsg);

    }catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

})
router.get("user-msg", isAuth, attachCurrentUser, async (req, res) => {

    try{ 
        
        const getMsg = await MsgModel.findById(req.currentUser._id)
        
        console.log(getMsg)
        return res.status(200).json(getMsg);

    }catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

})

router.delete("/delete-msg", isAuth, attachCurrentUser, async (req, res) => {
    try{
        const disabledMsg = await MsgModel.findByIdAndUpdate(
            { _id: req.body._id },
            { isActive: false, disabledOn: Date.now() },
            { runValidators: true, new: true }
        );
        return res.status(200).json(disabledMsg);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);

    }
});



module.exports = router;