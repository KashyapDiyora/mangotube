import {Schema,model,models} from "mongoose";

const CommentSchema = new Schema({
    commentMessage : {
        type : String,
        required : true,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    video : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    }
},{
    timestamps : true
});

export const Comment = models?.Comment || model("Comment",CommentSchema);