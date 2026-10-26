import mongoose from "mongoose";

const cardLeadSchema = mongoose.Schema({
    executiveUserId: {
        type: String,
        required: true,
        index: true
    },
    imagePath: {
        type: String,
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
    mobileNo: {
        type: String,
        trim: true,
        default: ""
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true
    },
    alternateMobileNo: {
        type: String,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        trim: true,
        default: undefined
    },
    requirement: {
        type: String,
        trim: true,
        default: ""
    },
    contactType: {
        type: String,
        enum: ['supplier', 'non-supplier'],
        default: 'supplier'
    },
    status: {
        type: String,
        enum: ['pending', 'rejected', 'verified', 'un-verified', 'failed'],
        default: 'pending'
    },
    rejectionReason: {
        type: String,
        trim: true,
        default: null
    }
}, { timestamps: true });


const CardLead = mongoose.model('CardLead', cardLeadSchema);
export default CardLead;