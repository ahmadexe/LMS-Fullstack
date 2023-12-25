const Teacher = require("../models/teacher");
const Course = require("../models/course");

const addTeacherToACourse = async (req, res, next) => {
  const { courseCode, teacherId } = req.body;

  try {
    const course = await Course.findOne({ code: courseCode });
    const teacher = await Teacher.findOne({ id: teacherId });

    if (!course || !teacher) {
      return res.status(404).json({ message: "Course or Teacher not found" });
    }

    const isTeacherAssigned = course.teacher.some(
      (t) => t.id.toString() === teacher._id.toString()
    );

    if (isTeacherAssigned) {
      return res
        .status(400)
        .json({ message: "Teacher is already assigned to the course" });
    }

    course.teacher.push({ id: teacher._id });
    await course.save();

    res.json({ message: "Teacher added to the course successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const removeTeacherFromACourse = async (req, res, next) => {
  const { courseCode, teacherId } = req.body;

  try {
    const course = await Course.findOne({ code: courseCode });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.teacher = course.teacher.filter(
      (t) => t.id.toString() !== teacherId
    );
    await course.save();

    res.json({ message: "Teacher removed from the course successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTeachersTeachingACourse = async (req, res, next) => {
  const { courseCode } = req.body;

  try {
    const course = await Course.findOne({ code: courseCode }).populate(
      "teacher.id"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const teachers = course.teacher.map((t) => ({
      id: t.id._id,
      name: t.id.name,
      email: t.id.email,
      dept: t.id.dept,
    }));

    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      res.status(404).send("Teacher not found");
      return;
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.warn(error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllCoursesOfATeacher = async (req, res) => {
  const teacherId = req.params.tid;
  try {
    const courses = await Course.find({
      teacher: { $elemMatch: { id: teacherId } },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addTeacherToACourse,
  removeTeacherFromACourse,
  getTeachersTeachingACourse,
  getAllTeachers,
  getTeacherById,
  getAllCoursesOfATeacher,
};
