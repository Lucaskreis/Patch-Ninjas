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

router.patch("/update-job/:jobid", isAuth, attachCurrentUser, isClient, async (req, res) => {
    try {
    const updateJob = await JobsModel.findOneAndUpdate(
        {_id: req.params.jobid},
        {...req.body},
        {runValidators: true, new: true}
        
    );
    console.log(req.body)

    return res.status(200).json(updateJob);
    }catch(error){
        return res.status(500).json(error);
    }
})

router.get("/jobs", isAuth, attachCurrentUser, isClient, async (req, res) => {

    try {
        const getJob = await JobsModel.find()
        return res.status(200).json(getJob);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    } 
  });

  router.get("/jobsById",  isAuth, attachCurrentUser, isClient, async (req, res) => {

    try {
        const getJob = await JobsModel.findById(req.body.user).populate("user")
        
        return res.status(200).json(getJob);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

    
  });
  router.delete("/delete-job/:jobid", async (req,res) => {
    try {
        
            const deletedJob = await JobsModel.deleteOne({
                _id:req.params.jobid
            });
            return res.status(200).json({});

    }catch (error){
        console.log(error);
        return res.status(500).json(error);
    }
})

  router.get("/job/:idJob", async (req, res) =>{
      try {
          const jobById = await JobsModel.find({
              _id: req.params.idJob

          })
          return res.status(200).json(jobById);

      } catch (err) {
          res.status(500).json(err);
      }
  } )

//Soft Delete

/*router.delete("/delete-jobs", isAuth, attachCurrentUser, isClient, async (req, res) => {
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
});*/

module.exports = router;
