const Course = require("../models/course");
const getAllCourses = (req,res) =>
{
    Course.find().then( ( data ) =>
    {
        res.json( data );
    } ).catch( ( err ) =>
    {
        res.json( err );
    })
};
const addMarks = async (req, res) => {
  try {
    const result = await Course.findOneAndUpdate(
      {
        _id: req.params.cid,
        "students.id": req.params.sid,
      },
      {
        $set: {
          "students.$.marks": req.body.marks,
          },
      },
      { new: true }
    );
    res.status(200).send(result);
  } catch (error) {
    console.warn(error);
}
};

const addCourse = async (req, res) => {
  try {
    const existing = await Course.findOne({ code: req.body.code });
    if (existing) {
      res.status(409).send("course  already exists");
      return;
    }
    const course = new Course(req.body);
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    console.warn(error);
  }
};

const getStudents = async (req, res) => {
  try {
    const course = await Course.findOne({ code: req.params.code }).populate(
      "students.id"
    );
    if (course) {
      const students = course.students;
      res.status(200).send(students);
      return;
    }
  } catch (error) {
    console.warn(error);
  }
};

const addStudent = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.cid },
      {
        $push: {
          students: {
            id: req.params.sid,
          },
        },
      },
      { new: true }
    );
    res.status(200).send(course);
  } catch (error) {
    console.warn(error);
  }
};

const removeStudent = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.cid },
      {
        $pull: {
          students: {
            id: req.params.sid,
          },
        },
      },
      { new: true }
    );
    res.status(200).send(course);
  } catch (error) {
    console.warn(error);
  }
};
    

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const existingCourse = await Course.findById(courseId);

    if (!existingCourse) {
      res.status(404).send("Course not found");
      return;
    }
    await existingCourse.deleteOne();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const viewCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const updateMarks = (req,res,next) => {
  Course.findOneAndUpdate({_id:req.params.cid, "students.id":req.params.sid},
    {$set:{"students.$.marks":req.body.marks}}).then((result)=>{
      res.json(result)
    }).catch((err)=>{
      res.json(err)
    })
}

const deleteMarks = (req,res,next)=>{
  Course.deleteOne({_id:req.params.cid},{$pull:{
      students:{
        id: req.params.sid
      }}}).then((result)=>{
        res.json(result)
      }).catch((err)=>{
        res.json(err)
      })
}


module.exports = {
  addCourse,
  getStudents,
  addStudent,
  removeStudent,
  deleteCourse,
  viewCourses,
  updateCourse,
  getAllCourses,
  addMarks,
  updateMarks,
  deleteMarks,
};
