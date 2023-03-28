const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        matric_no: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        age: {
            type: String,
            required: true
        },
        phone_no: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        blood_type: {
            type: String,
            required: true
        },
        blood_group: {
            type: String,
            required: true
        },
        phc: {
            type: String,
            required: false
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: true
        }
    }
);

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;