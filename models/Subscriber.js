import {Schema,model,models} from "mongoose";

const SubscriberSchema = new Schema({
    subscriber : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    channel : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},{
    timestamps : true
});

export const Subscriber = models?.Subscriber || model("Subscriber",SubscriberSchema);