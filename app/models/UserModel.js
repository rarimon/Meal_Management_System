import  mongoose  from 'mongoose'
import bcrypt from "bcrypt";

const DataSchema= mongoose.Schema({
    fullName:{type:String,required:true},
    phone:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,default:"user" },
},
    {
    timestamps: true,
    versionKey: false
    }

)


//Pre-save hook to hash password
DataSchema.pre('save', async function (next) {
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});




const UserModel = mongoose.model('users', DataSchema);
export  default UserModel;