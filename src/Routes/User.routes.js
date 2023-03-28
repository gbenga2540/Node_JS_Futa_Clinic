const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const none_null = require("../Utils/None_Null_Checker");
const User = require("../Models/User_Model");

// Creates a new User Account
// INFO REQUIRED:
// full_name
// email
// password
router.post("/auth/signup", async (req, res) => {
    try {
        const full_name = req.body.full_name;
        const email = req.body.email;
        const password = req.body.password;

        if (
            !none_null(full_name) &&
            !none_null(email) &&
            !none_null(password)
        ) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                await User.aggregate([
                    {
                        $match: {
                            email: email,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                        },
                    },
                ])
                    .catch((err) => {
                        res.json({
                            status: "error",
                            code: err,
                        });
                    })
                    .then(async (result) => {
                        if (result !== null || result !== undefined) {
                            if (result?.length === 0) {
                                const user = new User({
                                    email: email,
                                    password: hashedPassword,
                                    full_name: full_name,
                                });
                                try {
                                    await user
                                        .save()
                                        .catch((err) => {
                                            res.json({
                                                status: "error",
                                                code: "An error occured while trying to save user's info to Server!",
                                            });
                                        })
                                        .then(async (result) => {
                                            if (result) {
                                                const uid =
                                                    result?._id?.toString();
                                                const token = jwt.sign(
                                                    { uid: uid },
                                                    process.env
                                                        .NODE_AUTH_SECRET_KEY
                                                );
                                                res.json({
                                                    status: "success",
                                                    response: {
                                                        token: token,
                                                        uid: uid,
                                                    },
                                                });
                                            } else {
                                                res.json({
                                                    status: "error",
                                                    code: "An error occured while trying to save user's info to Server!",
                                                });
                                            }
                                        });
                                } catch (error) {
                                    res.json({
                                        status: "error",
                                        code: "An error occured while trying to save user's info to Server!",
                                    });
                                }
                            } else {
                                res.json({
                                    status: "error",
                                    code: "Email already in use!",
                                });
                            }
                        } else {
                            res.json({
                                status: "error",
                                code: "Email already in use!",
                            });
                        }
                    });
            } catch (err) {
                res.json({
                    status: "error",
                    code: "Error creating User Account!",
                });
            }
        } else {
            res.json({
                status: "error",
                code: "Some fields are Empty!",
            });
        }
    } catch (err) {
        res.json({
            status: "error",
            code: "Error creating User Account!",
        });
    }
});

// Logs in a user
// INFO REQUIRED:
// email
// password
router.post("/auth/signin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!none_null(email) && !none_null(password)) {
            try {
                await User.aggregate([
                    {
                        $match: {
                            email: email,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            password: 1,
                        },
                    },
                ])
                    .catch((err) => {
                        res.json({
                            status: "error",
                            code: err,
                        });
                    })
                    .then((result) => {
                        if (result !== null || result !== undefined) {
                            if (result?.length > 0) {
                                try {
                                    bcrypt.compare(
                                        password,
                                        result[0]?.password,
                                        (error, response) => {
                                            if (error) {
                                                res.json({
                                                    status: "error",
                                                    code: "An error occured while trying to confirm User's Password!",
                                                });
                                            } else {
                                                if (response) {
                                                    const uid =
                                                        result[0]?._id?.toString();
                                                    const token = jwt.sign(
                                                        { uid: uid },
                                                        process.env
                                                            .NODE_AUTH_SECRET_KEY
                                                    );
                                                    res.json({
                                                        status: "success",
                                                        response: {
                                                            token: token,
                                                            uid: uid,
                                                        },
                                                    });
                                                } else {
                                                    res.json({
                                                        status: "error",
                                                        code: "Password is Incorrect!",
                                                    });
                                                }
                                            }
                                        }
                                    );
                                } catch (error) {
                                    res.json({
                                        status: "error",
                                        code: "An error occured while trying to confirm User's Password!",
                                    });
                                }
                            } else {
                                res.json({
                                    status: "error",
                                    code: "User's Account does not Exist!",
                                });
                            }
                        } else {
                            res.json({
                                status: "error",
                                code: "User's Account does not Exist!",
                            });
                        }
                    });
            } catch (error) {
                res.json({
                    status: "error",
                    code: "An error occured while trying to Sign In User!",
                });
            }
        } else {
            res.json({
                status: "error",
                code: "Some fields are Empty!",
            });
        }
    } catch (error) {
        res.json({
            status: "error",
            code: "An error occured while trying to Sign In User!",
        });
    }
});

module.exports = router;
