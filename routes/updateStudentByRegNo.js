const express = require('express');
const router = express.Router();
const Student = require('../models/student');

router.put('/updateStudent/:regNo', async (req, res) => {
    const regNo = req.params.regNo;
    const updatedData = req.body;

    try {
        const updatedStudent = await Student.findOneAndUpdate({ regNo: regNo }, updatedData, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error: error });
    }
});

module.exports = router;