import MealModel from '../models/MealModel.js';
import mongoose from "mongoose";
import ExpenseModel from "../models/ExpenseModel.js";
let OBJECTID = mongoose.Types.ObjectId;

export const AddExpense=async (req, res) => {

    try{
        let UserID=req.headers["user_id"];
        let reqBody = req.body;
        reqBody.addedBy=new OBJECTID(UserID);
        let data = await ExpenseModel.create(reqBody);

        return res.status(200).json({status: "success", message: "Expense Add successfully", data: data});

    }
    catch (error) {
        return res.status(200).json({status: "Error", message: error.toString()});
    }

}

export const UpdateExpense=async (req, res) => {
    try{

        let ExpenseID=req.params.ID;
        let UserID=req.headers["user_id"];
        let reqBody = req.body;
        reqBody.addedBy=new OBJECTID(UserID);

        let data=await ExpenseModel.findByIdAndUpdate(ExpenseID,reqBody,{new:true});

        if(!data){
            return res.status(401).json({status: "Fail", message: "Expense Not Found"});
        }

        return res.status(200).json({status: "success", message: "Expense updated successfully",data:data});

    }
    catch(error){
        return res.status(200).json({status:"Error",message:error.toString()});
    }

}

export const DeleteExpense=async (req, res) => {

    try{
        let ExpenseID=req.params.id;
        let data=await ExpenseModel.deleteOne({"_id":ExpenseID});

        return res.status(200).json({status: "success", message: "Meal Details successfully", data: data});
    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}



export const ExpenseList=async (req, res) => {
    try{


        const data = await ExpenseModel.aggregate([
            // Lookup for userID
            {
                $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            // Lookup for addedBy
            {
                $lookup: {
                    from: "users",
                    localField: "addedBy",
                    foreignField: "_id",
                    as: "addedByInfo"
                }
            },

            // Unwind arrays
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$addedByInfo", preserveNullAndEmptyArrays: true } },

            // Project required fields
            {
                $project: {
                    _id: 1,
                    date: 1,
                    title: 1,
                    category: 1,
                    amount: 1,
                    UserName: "$userInfo.fullName",
                    AddedBy: "$addedByInfo.fullName"
                }
            },

            // Sort latest first
            { $sort: { date: -1 } }
        ]);

        let totalExpense = data.reduce((sum, expense) => sum + expense.amount, 0);



        return res.status(200).json({status: "success", message: "Meal Details successfully", data: data, totalExpense: totalExpense});

    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}


export const FilterExpense=async (req, res) => {

    try{
        let reqBody = req.body;

        let MatchCondition = {};

        // User filter
        if (reqBody.userID) {
            MatchCondition.userID = new mongoose.Types.ObjectId(reqBody.userID);
        }

        // Date filter (expense date)
        if (reqBody.fromDate || reqBody.toDate) {
            MatchCondition.date = {};

            if (reqBody.fromDate) {
                MatchCondition.date.$gte = new Date(reqBody.fromDate);
            }
            if (reqBody.toDate) {
                let to = new Date(reqBody.toDate);
                to.setHours(23, 59, 59, 999); // দিনের শেষ সময়
                MatchCondition.date.$lte = to;
            }
        }

        // Aggregate query
        let data = await ExpenseModel.aggregate([
            { $match: MatchCondition },

            // user info join
            {
                $lookup: {
                    from: "users",
                    localField: "userID",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    _id: 1,
                    date: 1,
                    title: 1,
                    category: 1,
                    amount: 1,
                    userName: "$userInfo.fullName"
                }
            },

            { $sort: { date: -1 } }
        ]);

        let totalExpense = data.reduce((sum, expense) => sum + expense.amount, 0);

        return res.status(200).json({status: "success", message: "Task Filter successfully",data: data, totalExpense: totalExpense});

    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}





