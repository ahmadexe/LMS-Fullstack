const express = require("express");
const router = express.Router();
const teacherCtrl = require("../controllers/teacher");

router.post("/addTeacher", teacherCtrl.addTeacherToACourse);
router.delete("/deleteTeacher", teacherCtrl.removeTeacherFromACourse);
router.get("/viewTeachers", teacherCtrl.getTeachersTeachingACourse);
router.get("/getAllTeachers", teacherCtrl.getAllTeachers);
router.get("/getTeacherById/:id", teacherCtrl.getTeacherById);
router.get("/getTeacherCourses/:tid", teacherCtrl.getAllCoursesOfATeacher);

module.exports = router;
