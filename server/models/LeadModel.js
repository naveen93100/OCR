import mongoose from "mongoose";

const leadSchema = mongoose.Schema(
    {
        executiveUserId: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            trim: true,
            default: ""
        },
        customerName: {
            type: String,
            trim: true,
            default: ""
        },
        city: {
            type: String,
            trim: true,
            required: true,
        },
        state: {
            type: String,
            trim: true
        },
        requirement: {
            type: String,
            trim: true,
            default: ""
        },
        email: {
            type: String,
            trim: true,
            // unique: true,
            default: undefined
        },
        mobileNo: {
            type: String,
            trim: true,
            // unique: true,
        },
        contactType: {
            type: String,
            enum: ['supplier', 'non-supplier'],
            default: 'supplier'
        },
        alternateMobileNo: {
            type: String,
            trim: true,
            default: ""
        },
    },
    { timestamps: true },
);

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
