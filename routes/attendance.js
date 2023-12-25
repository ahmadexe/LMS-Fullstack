const express = require("express");
const router = express.Router();
const attendanceCtrl = require("../controllers/attendance");

router.post("/mark-attendance", attendanceCtrl.markAttendance);
router.put("/update-attendance", attendanceCtrl.updateAttendence);
router.get("/get-attendance-day", attendanceCtrl.getAttendanceOfParticularDay);

module.exports = router;
