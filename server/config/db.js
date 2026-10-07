import mongoose from "mongoose"

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected..")

    } catch (er) {
        console.log(er)
    }
}

export default connectDB