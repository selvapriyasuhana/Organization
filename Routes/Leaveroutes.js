const router = require("express").Router();
const Leave = require("../Models/Leavemodel.js");
const Staffdetails = require("../Models/Staffmodel.js");

router.get("/Leavepage", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Staff leave API",
  });
});

router.post("/apply", async (req, res) => {
  try {
    const {
      username,
      Name,
      Leavetype,
      StartDate,
      EndDate,
      Numberofdays,
      Reason,
      // menstrualLeaveRequests,
      Command,
      Status,
    } = req.body;
    const staffMember = await Staffdetails.findOne({ username });

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    if (
      Leavetype !== "Casualleaves" &&
      Leavetype !== "Medicalleaves" &&
      Leavetype !== "Menstrualleaves" &&
      Leavetype !== "Otherleaves"
    ) {
      return res.status(400).json({ message: "Invalid leave type." });
    }
    if (Leavetype === "Casualleaves") {
      // Check if a Casualleaves request was made in the last month
      const lastMonthCasualLeave = await Leave.findOne({
        username,
        Leavetype: "Casualleaves",
        StartDate: {
          $gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1
          ),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      });
      if (lastMonthCasualLeave) {
        return res.status(400).json({
          message: "Only one Casualleaves request is allowed per month.",
        });
      }
    }
    /*if (Numberofdays !== 1) {
        return res.status(400).json({ message: "Casualleaves can only be requested for a single day." });
      }
    }*/

    if (Leavetype === "Casualleaves") {
      // Get the current date
      const currentDate = new Date();
      // Convert StartDate from string to Date object
      const leaveStartDate = new Date(StartDate);

      // Calculate the difference in milliseconds between the leave start date and the current date
      const differenceInTime = leaveStartDate.getTime() - currentDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);

      // Check if the difference is less than 7 days for a casual leave request
      if (differenceInDays < 7) {
        return res.status(400).json({
          message:
            "Casual leave requests should be made at least a week in advance.",
        });
      }
    }

    if (Leavetype === "Menstrualleaves" && staffMember.Gender !== "female") {
      return res.json({
        status: "Error",
        message: "Menstrual leave is only applicable for women",
      });
    }

    if (Leavetype !== "Menstrualleaves") {
      // If it's not a Menstrual leave request, proceed as before
      // Check available leave balance
      if (staffMember[Leavetype] < Numberofdays) {
        return res.status(400).json({
          message: `Insufficient ${Leavetype} balance for leave request.`,
        });
      }
    } else {
      // For Menstrual leave request, check if it's already requested for the current month
      const existingRequest = await Leave.findOne({
        username,
        Leavetype: "Menstrualleaves",
        StartDate: {
          $gte: new Date(StartDate),
          $lt: new Date(StartDate).setMonth(new Date(StartDate).getMonth() + 1),
        },
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "One Menstrual leave request per month is allowed.",
        });
      }
    }
    /*if (Numberofdays > 1) {
      return res.status(400).json({
        message: "You can only request one day for Menstrual leave per month.",
      });
    }*/

    const staff = Leave({
      username,
      Name,
      Leavetype,
      StartDate,
      EndDate,
      Numberofdays,
      Reason,
      //menstrualLeaveRequests,
      Command,
      Status,
    });
    console.log("staff:", staff);

    await staff.save();
    //staffMember[Leavetype] -= Numberofdays;
    console.log("staffMember after save:", staffMember);
    // await staffMember.save();

    return res.json({
      message: "New staff leaverequest",
      data: staff,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate leave request detected." });
    }
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

const Leavecontroller = require("../Controller/Leavecontroller.js");
router.route("/get_all").get(Leavecontroller.index);
router.route("/user/status/:Status").get(Leavecontroller.saw);
router.route("/username/:username").get(Leavecontroller.look);
router.route("/user/id/:user_id").get(Leavecontroller.view);
router.route("/:user_id").put(Leavecontroller.update);
router.route("/:user_id").patch(Leavecontroller.update);
router.route("/:user_id").delete(Leavecontroller.Delete);

module.exports = router;
