const { Schema, model, default: mongoose } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  address: { type: String, trim: true },
  phone: { type: String, required: true, trim: true }, 
  passwordHash: { type: String, required: true, match:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, trim: true},
  img: { type: String, default: "https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png" },
  role: { type: String, enum: ["PROFISSIONAL", "CLIENTE"], default: "CLIENTE" },
  isActive: { type: Boolean, default: true },
  disabledOn: { type: Date },
  jobs: [{type: mongoose.Types.ObjectId, ref: "Jobs"}]
});

const UserModel = model("User", userSchema);

module.exports = UserModel;
