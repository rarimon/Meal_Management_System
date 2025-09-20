import MealModel from '../models/MealModel.js';
import mongoose from "mongoose";
import ExpenseModel from "../models/ExpenseModel.js";
import UserModel from "../models/UserModel.js";
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




// ==============Report Section=================

export const totalExpense=async (req, res) => {
    try{


        let expenses = await ExpenseModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    fromDate: { $min: "$date" },
                    toDate: { $max: "$date" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    fromDate: { $dateToString: { format: "%Y-%m-%d", date: "$fromDate" } },
                    toDate: { $dateToString: { format: "%Y-%m-%d", date: "$toDate" } },
                    total: 1
                }
            }
        ]);

        // totalExpense
        let totalExpense = expenses.reduce((acc, curr) => acc + curr.total, 0);


        return res.status(200).json({status: "success", message: "Expense Details successfully",data: expenses,totalExpense:totalExpense});
    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}


export const ExpenseDetails=async (req, res) => {
    try{
        let categoryName = req.params.categoryName; // URL থেকে category নাম/ID নাও

        let expenses = await ExpenseModel.aggregate([
            { $match: { category: categoryName } },  // শুধু ঐ category
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    fromDate: { $min: "$date" },
                    toDate: { $max: "$date" },
                    allData: { $push: "$$ROOT" }  // সব expense document
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    fromDate: { $dateToString: { format: "%Y-%m-%d", date: "$fromDate" } },
                    toDate: { $dateToString: { format: "%Y-%m-%d", date: "$toDate" } },
                    total: 1,
                    allData: 1
                }
            }
        ]);


        return res.status(200).json({status: "success", message: "Expense Details successfully",data: expenses,totalExpense:totalExpense});
    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}


export const dashboarOverview=async (req, res) => {
    try{
        // 1️⃣ Total Meals
        let totalMealsAgg = await MealModel.aggregate([
            { $group: { _id: null, totalMeals: { $sum: "$mealCount" } } }
        ]);
        let totalMeals = totalMealsAgg[0]?.totalMeals || 0;

        // 2️⃣ Total Expenses & Category-wise
        let expenseAgg = await ExpenseModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    amount: { $sum: "$amount" }
                }
            }
        ]);
        let totalExpenses = expenseAgg.reduce((acc, curr) => acc + curr.amount, 0);
        let categoryWiseExpenses = expenseAgg.map(c => ({
            category: c._id,
            amount: c.amount
        }));

        // 3️⃣ Per Meal Cost
        let perMealCost = totalMeals > 0 ? Math.round(totalExpenses / totalMeals) : 0;

        // 4️⃣ Total Members
        let totalMembers = await UserModel.countDocuments();

        // 5️⃣ Member-wise Meals + Cost
        let memberWiseMealsAgg = await MealModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $group: {
                    _id: "$user_id",
                    member: { $first: "$userInfo.fullName" },
                    meals: { $sum: "$mealCount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    member: 1,
                    meals: 1,
                    cost: { $multiply: ["$meals", perMealCost] } // Mil rate অনুযায়ী cost
                }
            }
        ]);

      return res.status(200).json({
            status: "success",
            message: "Dashboard Overview",
            data: {
                totalMeals,
                totalExpenses,
                perMealCost,
                totalMembers,
                memberWiseMeals: memberWiseMealsAgg,
                categoryWiseExpenses
            }
        });

    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}

export const AllReport=async (req, res) => {
    try{
        let { fromDate, toDate } = req.body;

        // date filter
        let matchMeals = {};
        let matchExpenses = {};
        if (fromDate && toDate) {
            let start = new Date(fromDate);
            let end = new Date(toDate);
            end.setHours(23, 59, 59, 999);

            matchMeals.date = { $gte: start, $lte: end };
            matchExpenses.date = { $gte: start, $lte: end };
        }

        // 1️⃣ Total Meals in date range
        let totalMealsAgg = await MealModel.aggregate([
            { $match: matchMeals },
            { $group: { _id: null, totalMeals: { $sum: "$mealCount" } } }
        ]);
        let totalMeals = totalMealsAgg[0]?.totalMeals || 0;

        // 2️⃣ Total Expenses & Category-wise in date range
        let expenseAgg = await ExpenseModel.aggregate([
            { $match: matchExpenses },
            { $group: { _id: "$category", amount: { $sum: "$amount" } } }
        ]);
        let totalExpenses = expenseAgg.reduce((acc, curr) => acc + curr.amount, 0);
        let categoryWiseExpenses = expenseAgg.map(c => ({
            category: c._id,
            amount: c.amount
        }));

        // 3️⃣ Per Meal Cost
        let perMealCost = totalMeals > 0 ? Math.round(totalExpenses / totalMeals) : 0;

        // 4️⃣ Total Members
        let totalMembers = await UserModel.countDocuments();

        // 5️⃣ Member-wise Meals + Cost
        let memberWiseMealsAgg = await MealModel.aggregate([
            { $match: matchMeals },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: "$userInfo" },
            {
                $group: {
                    _id: "$user_id",
                    member: { $first: "$userInfo.fullName" },
                    meals: { $sum: "$mealCount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    member: 1,
                    meals: 1,
                    cost: { $multiply: ["$meals", perMealCost] }
                }
            }
        ]);

      return   res.status(200).json({
            status: "success",
            message: "Dashboard Date Range Report",
            data: {
                fromDate: fromDate || null,
                toDate: toDate || null,
                totalMeals,
                totalExpenses,
                perMealCost,
                totalMembers,
                memberWiseMeals: memberWiseMealsAgg,
                categoryWiseExpenses
            }
        });
    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}




