const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors('*'));


mongoose.connect(process.env.NODE_DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .catch(err => {
        console.log(`MongoDB Connection Error -> `, err);
    })
    .then(result => {
        if (result) {
            const PORT = process.env.PORT || 8080;
            app.listen(parseInt(PORT), () => {
                console.log(`FUTA_Clinic Server is live.`);
            });
        }
    });

const userRouter = require("./src/Routes/User.routes");
app.use(`${process.env.NODE_API_INIT}/users`, userRouter);

const studentRouter = require("./src/Routes/Student.routes");
app.use(`${process.env.NODE_API_INIT}/students`, studentRouter);
