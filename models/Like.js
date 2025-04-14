import {Schema,model,models} from "mongoose";

const LikeSchema = new Schema({
    likeBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    video : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    }
},{
    timestamps : true
})

export const Like = models?.Like || model("Like",LikeSchema);