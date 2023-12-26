const Attendance = require("../models/attendance");
const Student = require("../models/student");
const Course = require("../models/course");

const markAttendance = async (req, res) => {
  try {
    const { courseId, studentRegNo, present } = req.body;
    const student = await Student.findOne({ regNo: studentRegNo });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const attendanceRecord = new Attendance({
      courseId,
      studentRegNo,
      present,
    });

    await attendanceRecord.save();

    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (err) {
    console.warn(err);
  }
};

const updateAttendence = async (req, res) => {
  try {
    const { studentId, courseId, date, isPresent } = req.body;

    // Check if student and course exist
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or course not found." });
    }

    // Check if attendance record already exists for the student on the given date
    let attendance = await Attendance.findOne({
      student: studentId,
      course: courseId,
      date: date,
    });

    // If attendance record doesn't exist, create a new one
    if (!attendance) {
      attendance = new Attendance({
        student: studentId,
        course: courseId,
        date: date,
      });
    }

    // Update the attendance status
    attendance.isPresent = isPresent;

    // Save the attendance record
    await attendance.save();

    res.status(200).json({ message: "Attendance updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getAttendanceOfParticularDay = async (req, res) => {
  try {
    const { courseId, date, studentRegNo } = req.body;
    const student = await Student.findOne({ regNo: studentRegNo });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const attendance = await Attendance.findOne({
      courseId,
      date,
      student: student.studentRegNo,
    });

    if (!attendance) {
      return res.status(404).json({ error: "Attendance not found" });
    }

    // Return the attendance details
    res.status(200).json({ attendance });
  } catch (err) {
    console.warn(err);
  }
};

const getAttendanceOfLastWeek = async (req, res) => {
  try {
    const { studentRegNo } = req.body;

    // Find the student
    const student = await Student.findOne({ regNo: studentRegNo });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Calculate the date one week ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Find attendance records for the student within the last week
    const attendanceRecords = await Attendance.find({
      student: studentRegNo,
      date: { $gte: oneWeekAgo },
    });

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res.status(404).json({ error: "No attendance records found for the last week" });
    }

    // Return the attendance details
    res.status(200).json({ attendanceRecords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  markAttendance,
  updateAttendence,
  getAttendanceOfParticularDay,
};
