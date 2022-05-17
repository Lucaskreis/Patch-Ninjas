const { Schema, model, default: mongoose } = require("mongoose");

const msgSchema = new Schema({
  user: {type: mongoose.Types.ObjectId, ref: "User"},
  name: {type: String, required: true},
  jobs: {type: mongoose.Types.ObjectId, ref: "Jobs"},
  data: {type: Date, default: Date.now},
  msg: {type: String, required: true, maxlength: 100, minlength: 1},
  isActive: { type: Boolean, default: true },
  disabledOn: { type: Date },
});

const MsgModel = model("Msg", msgSchema);

module.exports = MsgModel;
