import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    token: {
        type: String,
    },
    confirm: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.checkPassword = async function (passwordform){
    return await bcrypt.compare(passwordform, this.password)
}

const user = mongoose.model("User", userSchema)
export default user