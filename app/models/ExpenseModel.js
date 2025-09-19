import mongoose from 'mongoose';

let DataSchema = mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }

},
    {
        timestamps: true,
        versionKey: false,
    }
    )

const ExpenseModel=mongoose.model('expenses', DataSchema);
export default ExpenseModel;