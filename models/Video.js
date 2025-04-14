import { models ,Schema,model} from "mongoose";

const VideoSchema = new Schema({
    videoUrl : {
        type : String,
        required : true,
        unique : true
    },
    thumbnailUrl : {
        type : String,
        required : true,
        unique : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type : String,
        requred : true
    },
    description : {
        type : String,
        requred : true
    },
    duration : {
        type : Number
    },
    views : {
        type : Number,
        default : 0
    },
    isPublish : {
        type : Boolean,
        default : true,
        required : true,
    },

},{
    timestamps : true
});

export const Video = models?.Video || model("Video",VideoSchema);