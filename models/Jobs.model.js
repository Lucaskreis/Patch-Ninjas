const { Schema, model, default: mongoose } = require("mongoose");

const jobsSchema = new Schema({
    user: {type: mongoose.Types.ObjectId, ref: "User"},
    title: {type: String, required: true, minlength: 1},
    description: {type: String, required: true, maxlength: 200, minlength: 5},
    tags: {type: String, required: true, enum:["WD", "UXUI", "DI"]},
    prazo: {type: String, required: true},
    data: {type: Date, default: Date.now},
    local: {type: String, required: true},
    msg: [{type: mongoose.Types.ObjectId, ref: "Msg"}]
});

const JobsModel = model("Jobs", jobsSchema);

module.exports = JobsModel


