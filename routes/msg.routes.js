const router = require("express").Router();
const MsgModel = require("../models/Msg.model");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");


router.post("/new-msg", isAuth, attachCurrentUser, async (req, res) => {

    try{
        const loggedInUser = req.currentUser
        const newMsg = await MsgModel.create({
            ...req.body,
            user: loggedInUser._id,
            //jobs: pegar com o params no backend?
        });


    }catch(error) {
        console.log(error)
        return res.status(500).json(error)
    }
})
router.get("/all-msg", isAuth, attachCurrentUser, async (req, res) => {

    try{ 
        const getMsg = await MsgModel.findn()
        //fazer dois finds. Um com o Id do dono da msg e outro com o Id dono do jobs(fazer populate no job)
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