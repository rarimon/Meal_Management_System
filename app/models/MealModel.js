import mongoose from 'mongoose';

let DataSchema = mongoose.Schema({
        date: { type: Date, required: true },
        mealCount: { type: Number, required: true, default: 1 },
        user_id:{type:mongoose.Schema.Types.ObjectId, required: true,ref: "users"}
},
    {
        timestamps: true,
        versionKey: false,
    }
    )

const MealModel=mongoose.model('tasks', DataSchema);
export default MealModel;