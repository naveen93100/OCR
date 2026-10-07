import mongoose from "mongoose";
import Counter from "./counterModel.js";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'executive'],
        default: 'executive'
    }
}, { timestamps: true })

userSchema.pre('validate', async function () {
    if (!this.userId && this.name) {
        const baseName = this.name
            .trim()
            .split(/\s+/)[0]
            .replace(/[^a-zA-Z]/g, "")
            .toUpperCase();
        if (!baseName) {
            throw new Error("Invalid name for userId generation");
        }

        let counter = await Counter.findOneAndUpdate(
            { name: "userId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true },
        );

        const number = String(counter.seq).padStart(2, "0");

        this.userId = `${baseName}-${number}`;
    }
})

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
})

const User = mongoose.model('User', userSchema);

export default User;