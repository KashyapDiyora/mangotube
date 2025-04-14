import {Schema,model,models} from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    fullname : {
        type : String,
        required : true,
        trim : true,
        index : true,
    },
    password : {
        type : String,
        trim : true,
        min : 8,
        max : 10
    },
    provider : {
        type : String,
    },
    avatar : {
        type : String,
    },
    coverImage : {
        type : String
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ]
},{
    timestamps : true,
});

UserSchema.pre("save",async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

UserSchema.methods.comparePassword = async function(userPassword){
    return await bcrypt.compare(userPassword,this.password)
}

export const User = models?.User || model("User", UserSchema);