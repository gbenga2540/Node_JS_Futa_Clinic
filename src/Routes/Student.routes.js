const router = require('express').Router();
require('dotenv').config();
const verifyJWTbody = require('../Utils/Verify_JWT_Body');
const verifyJWTHeader = require('../Utils/Verify_JWT_Header');
const none_null = require('../Utils/None_Null_Checker');
const Student = require('../Models/Student_Model');
const ObjectId = require('mongodb').ObjectId;


// Creates a new Student
router.post('/create', verifyJWTbody, async (req, res) => {
    try {
        const user = req.uid;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const email = req.body.email;
        const matric_no = req.body.matric_no;
        const gender = req.body.gender;
        const age = req.body.age;
        const phone_no = req.body.phone_no;
        const address = req.body.address;
        const blood_type = req.body.blood_type;
        const blood_group = req.body.blood_group;
        const phc = req.body.phc;
        if (user) {
            if (!none_null(first_name) && !none_null(last_name) && !none_null(email) && !none_null(matric_no) && !none_null(gender) && !none_null(age) && !none_null(phone_no) && !none_null(address) && !none_null(blood_type) && !none_null(blood_group)) {
                const student = new Student({
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    matric_no: matric_no,
                    gender: gender,
                    age: age,
                    phone_no: phone_no,
                    address: address,
                    blood_type: blood_type,
                    blood_group: blood_group,
                    phc: phc
                });
                try {
                    await student.save()
                        .catch(err => {
                            res.json({
                                status: "error",
                                code: err
                            });
                        })
                        .then(async result => {
                            if (result) {
                                res.json({
                                    status: "success"
                                });
                            } else {
                                res.json({
                                    status: "error",
                                    code: "An error occured while trying to upload Student's Information to the Server!"
                                });
                            }
                        });
                } catch (error) {
                    res.json({
                        status: "error",
                        code: "An error occured while trying to upload Student's Information to the Server!"
                    });
                }
            } else {
                res.json({
                    status: "error",
                    code: "Some fields are Empty!"
                });
            }
        } else {
            res.json({
                status: "error",
                code: "You are not authorized to upload this Data!"
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: "error",
            code: "An error occured while trying to create Student's Data!"
        });
    }
});


// Load a specific Student Post
router.get('/:studentid', verifyJWTHeader, async (req, res) => {
    const uid = req.uid;
    if (uid){
        const studentid = req.params.studentid;
        try {
            await Student.aggregate([
                {
                    $match: {
                        _id: ObjectId(studentid)
                    }
                },
                {
                    $project: {
                        _id: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        matric_no: 1,
                        gender: 1,
                        age: 1,
                        phone_no: 1,
                        address: 1,
                        blood_type: 1,
                        blood_group: 1,
                        phc: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ])
                .catch(err => {
                    res.json({
                        status: "error",
                        code: err
                    });
                })
                .then(async result => {
                    if (result !== null || result !== undefined) {
                        if (result?.length > 0) {
                            res.json({
                                status: "success",
                                response: { ...result?.[0] }
                            })
                        } else {
                            res.json({
                                status: "error",
                                code: "An error occured while trying to validate Student's ID!"
                            });
                        }
                    } else {
                        res.json({
                            status: "error",
                            code: "An error occured while trying to validate Student's ID!"
                        });
                    }
                });
        } catch (error) {
            res.json({
                status: "error",
                code: "Student's Account cannot be found!"
            });
        }
    } else {
        res.json({
            status: "error",
            code: "You are not authorized to view this Data!"
        });
    }
});

// Load Student Posts
router.get('/', verifyJWTHeader, async (req, res) => {
    const uid = req.uid;
    if (uid) {
        try {
            await Student.aggregate([
                {
                    $match: {}
                },
                {
                    $project: {
                        _id: 1,
                        first_name: 1,
                        last_name: 1,
                        email: 1,
                        matric_no: 1,
                        gender: 1,
                        age: 1,
                        phone_no: 1,
                        address: 1,
                        blood_type: 1,
                        blood_group: 1,
                        phc: 1,
                        createdAt: 1,
                        updatedAt: 1
                    }
                }
            ])
                .sort({ createdAt: -1 })
                .catch(err => {
                    res.json({
                        status: "error",
                        code: err
                    });
                })
                .then(async result => {
                    if (result !== null || result !== undefined) {
                        if (result?.length > 0) {
                            res.json({
                                status: "success",
                                response: [ ...result ]
                            });
                        } else {
                            res.json({
                                status: "success",
                                response: []
                            });
                        }
                    } else {
                        res.json({
                            status: "success",
                            response: []
                        });
                    }
                });
        } catch (error) {
            res.json({
                status: "error",
                code: "An error occured while trying to load all Student's Information!"
            });
        }
    } else {
        res.json({
            status: "error",
            code: "You are not authorized to view this Data!"
        });
    }
});




module.exports = router;