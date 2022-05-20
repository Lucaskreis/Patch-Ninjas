const router = require("express").Router();
const bcrypt = require("bcrypt");
const UserModel = require("../models/User.model");
const generateToken = require("../config/jwt.config");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const JobsModel = require("../models/Jobs.model");
const MsgModel = require("../models/Msg.model")


const saltRounds = 10;

router.post("/signup", async (req, res) => {
  try {
    // Primeira coisa: Criptografar a senha!

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: passwordHash,
    });

    delete createdUser._doc.passwordHash;

    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ msg: "Wrong password or email." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      const token = generateToken(user);

      return res.status(200).json({
        token: token,
        user: { ...user._doc },
      });
    } else {
      return res.status(400).json({ msg: "Wrong password or email." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
  const user = await UserModel.findById(req.currentUser._id).populate("jobs").populate("isFav")
  return res.status(200).json(user);
});

router.patch("/update-profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: loggedInUser._id },
      { ...req.body },
      {$push: {isFav: req.body}},
      { runValidators: true, new: true }
    );

    delete updatedUser._doc.passwordHash;

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.patch("/favorites", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    console.log(req.body.jobId, "aqui")
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: loggedInUser._id },
      {$push: {isFav: req.body.jobId}},
      { runValidators: true, new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.delete("/deleteFav", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    console.log(req.body.jobId, "eu")
    const deleteFav = await UserModel.findByIdAndUpdate(
      {_id: loggedInUser._id},
      {$pull:{isFav: req.body.jobId}},
      {runValidators: true, new: true}
    );
    return res.status(200).json(deleteFav);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.delete("/delete-user", isAuth, attachCurrentUser, async (req,res) => {
  console.log(req.currentUser._id, "eu")
  try {
    const deletedUser = await UserModel.deleteOne({_id: req.currentUser._id});
    const deleteJobFromUser = await JobsModel.deleteMany({user: req.currentUser._id});
    const deleteMsgFromUser = await MsgModel.deleteMany({user: req.currentUser._id});
         
      return res.status(200).json({deletedUser, deleteJobFromUser, deleteMsgFromUser});
    
          
  }catch (error){
      console.log(error);
      return res.status(500).json(error);
  }
})


//SOFT DELETE

router.delete(
  "/disable-profile",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const disabledUser = await UserModel.findOneAndUpdate(
        { _id: req.currentUser._id },
        { isActive: false, disabledOn: Date.now() },
        { runValidators: true, new: true }
      );

      delete disabledUser._doc.passwordHash;

      return res.status(200).json(disabledUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
