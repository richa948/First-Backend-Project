import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.TypesOf.ObjectId,
        ref: "User"
    },

      channel:{
        type: Schema.TypesOf.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const subscription = mongoose.model("subscription", subscriptionSchema)