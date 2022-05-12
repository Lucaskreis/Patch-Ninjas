const router = require("express").Router();
const JobsModel = require("../models/Jobs.model");
const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const isClient = require("../middlewares/isClient");
const UserModel = require("../models/User.model");

router.post("/createjob",  isAuth, attachCurrentUser, isClient, async (req, res) => {
    try{
        const loggedInUser = req.currentUser
        const createdjob = await JobsModel.create({
            ...req.body,
            user: loggedInUser._id
        });
        const idJob = await UserModel.findByIdAndUpdate(
            {_id:loggedInUser._id },
            {$push:{jobs: createdjob._id}} ,
            {runValidators: true, new: true}    
        )

        return res.status(201).json(createdjob)

    }catch(error) {
        console.log(error);
        return res.status(500).json(error);
    }
   
})

router.patch("/update-job", isAuth, attachCurrentUser, isClient, async (req, res) => {
    try {
    const updateJob = await JobsModel.findByIdAndUpdate(
        {_id: req.body._id},
        {...req.body},
        {runValidators: true, new: true}
    );
    return res.status(200).json(updateJob );
    }catch(error){
        return res.status(500).json(error);
    }
})

router.get("/jobs", isAuth, attachCurrentUser, isClient, (req, res) => {
    return res.status(200).json(req.body);
  });

//Soft Delete

router.delete("/delete-jobs", isAuth, attachCurrentUser, isClient, async (req, res) => {
    try{
        const disabledJob = await JobsModel.findByIdAndUpdate(
            { _id: req.body._id },
            { isActive: false, disabledOn: Date.now() },
            { runValidators: true, new: true }
        );
        return res.status(200).json(disabledJob);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);

    }
})

module.exports = router;