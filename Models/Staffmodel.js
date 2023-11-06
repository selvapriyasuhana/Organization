/*var mongoose = require("mongoose");

var Schema = mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },

  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  Casualleave: {
    type: Number,
    required: true,
  },
  Medicalleave: {
    type: Number,
    required: true,
  },
});

Schema.path("username").validate(async (username) => {
  const usernameCount = await mongoose.models.staffdetails.countDocuments({
    username,
  });
  return !usernameCount;
}, "UserName Already Exists");

var user_signin = (module.exports = mongoose.model("Staffdetails", Schema));
module.exports.get = function (limit) {
  return user_signin.find().limit(limit).exec();
};*/

/*const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
  Casualleave: {
    type: Number,
    required: true,
  },
  Medicalleave: {
    type: Number,
    required: true,
  },
  // Add any other fields specific to your staff model here
});

const Staff = mongoose.model("Staffdetails", staffSchema);

module.exports = Staff;*/

/*const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
    unique: true,
  },
  Casualleave: {
    type: Number,
    required: true,
  },
  Medicalleave: {
    type: Number,
    required: true,
  },
});

Schema.path("username").validate(async function (username) {
  if (!username) {
    // If username is not provided, validation passes
    return true;
  }

  try {
    const usernameCount = await mongoose.model("Staffdetails").countDocuments({
      username,
    });
    return usernameCount === 0;
  } catch (err) {
    // Handle any potential errors here
    console.error("Error during username validation:", err);
    return false;
  }
}, "UserName Already Exists");

const Staffdetails = mongoose.model("Staffdetails", Schema);

module.exports = Staffdetails;*/
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  Dateofjoining: {
    type: Date,
  },
  Name: {
    required: false,
    type: String,
  },
  Age: {
    required: false,
    type: String,
  },
  Gender: {
    type: String,
  },
  DOB: {
    type: String,
  },
  Contact: {
    required: false,
    unique: true,
    type: Number,
    length: 10,
  },

  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  /*newpassword: {
    type: String,
    required: true,
  },*/
  username: {
    type: String,
    required: true,
    unique: true,
  },
  Casualleaves: { type: Number },
  Medicalleaves: { type: Number },
  Menstrualleaves: {
    type: Number,
  },
  /*Otherleaves: {
    type: Number,
    required: false,
  },*/
  usertype: {
    type: String,
    enum: ["Admin", "Staff"],
    default: "Staff",
    required: true,
  },
  ORGName: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
});

const Staffdetails = mongoose.model("Staffdetails", staffSchema);

module.exports = Staffdetails;
