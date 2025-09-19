import MealModel from '../models/MealModel.js';
import mongoose from "mongoose";
let OBJECTID = mongoose.Types.ObjectId;

export const AddMeal=async (req, res) => {

    try{

        let reqBody = req.body;
        let data = await MealModel.create(reqBody);
        return res.status(200).json({status: "success", message: "Meal Add successfully", data: data});

    }
    catch (error) {
        return res.status(200).json({status: "Error", message: error.toString()});
    }

}

export const UpdateMeal=async (req, res) => {
    try{

        let mealID=req.params.mealID;
        let reqBody = req.body;

        let data=await MealModel.findByIdAndUpdate(mealID,reqBody,{new:true});

        if(!data){
            return res.status(401).json({status: "Fail", message: "Meal Not Found"});
        }

        return res.status(200).json({status: "success", message: "Meal updated successfully",data:data});

    }
    catch(error){
        return res.status(200).json({status:"Error",message:error.toString()});
    }

}

export const DeleteMeal=async (req, res) => {
    try{
        let id=req.params.id;
        let data=await MealModel.deleteOne({"_id":id});
        return res.status(200).json({status: "success", message: "Meal Details successfully", data: data});
    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}



export const MealList=async (req, res) => {
    try{


        const data = await MealModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    date: 1,
                    mealCount: 1,
                    userName: "$userInfo.fullName"
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        let totalMeals = data.reduce((sum, meal) => sum + meal.mealCount, 0);

        return res.status(200).json({status: "success", message: "Meal Details successfully", data: data, totalMeals: totalMeals});

    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}


export const FilterMeal=async (req, res) => {

    try{
        let reqBody = req.body;

        let MatchCondition = {};

        // User filter
        if (reqBody.userID) {
            MatchCondition.user_id = new mongoose.Types.ObjectId(reqBody.userID);
        }

        // Date filter (meal date)
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
        let data = await MealModel.aggregate([
            { $match: MatchCondition },
            {$lookup: {from: "users", localField: "user_id", foreignField: "_id", as: "userInfo"}},
            { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
            {$project: {_id: 1,date: 1,mealCount: 1, userName: "$userInfo.fullName"}},
            { $sort: { date: -1 } }
        ]);

        let totalMeals = data.reduce((sum, meal) => sum + meal.mealCount, 0);

        return res.status(200).json({status: "success", message: "Task Filter successfully", data: data, totalMeals: totalMeals});

    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}



// ============Report Part=======================


export const totalMeals=async (req, res) => {
    try{


        let data = await MealModel.aggregate([
            {
                $facet: {
                    // মোট meal + তারিখ রেঞ্জ
                    totalMeals: [
                        {
                            $group: {
                                _id: null,
                                totalMeals: { $sum: "$mealCount" },
                                fromDate: { $min: "$date" },
                                toDate: { $max: "$date" }
                            }
                        }
                    ],

                    // user-wise meal + তারিখ রেঞ্জ
                    userWiseMeals: [
                        {
                            $group: {
                                _id: "$user_id",
                                totalMeals: { $sum: "$mealCount" },
                                fromDate: { $min: "$date" },
                                toDate: { $max: "$date" }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_id",
                                foreignField: "_id",
                                as: "userInfo"
                            }
                        },
                        { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                _id: 1,
                                userName: "$userInfo.fullName",
                                totalMeals: 1,
                                fromDate: 1,
                                toDate: 1
                            }
                        }
                    ]
                }
            }
        ]);



        return res.status(200).json({status: "success", message: "Task Details successfully",data: data});
    }
    catch(error){
        return  res.status(200).json({status: "Error", message: error.toString()});
    }
}




//
// // ====================Admin Part=======================
// export const TaskList=async (req, res) => {
//     try{
//
//         let data=await MealModel.find();
//         return res.status(200).json({status: "success", message: "Task Details successfully", data: data});
//
//     }
//     catch(error){
//         return  res.status(200).json({status: "Error", message: error.toString()});
//     }
// }
//
//
// export const TotalTask=async (req, res) => {
//     try{
//
//         let data = await MealModel.aggregate([
//             {$group:{_id:"$status",sum:{$count:{}}}},
//         ])
//
//
//         return res.status(200).json({status: "success", message: "Task Details successfully", data: data});
//     }
//     catch(error){
//         return  res.status(200).json({status: "Error", message: error.toString()});
//     }
// }
//
//
// export const FilterTask=async (req, res) => {
//
//     try{
//         let reqBody = req.body;
//
//         let MatchCondition = {};
//
//         if (reqBody.userID) {
//             MatchCondition.user_id = new ObjectId(reqBody.userID);
//         }
//
//         if (reqBody.status) {
//             MatchCondition.status = reqBody.status;
//         }
//
//
//         // Date filtering
//         if (reqBody.fromDate || reqBody.toDate) {
//             MatchCondition.createdAt = {};
//
//             if (reqBody.fromDate) {
//                 MatchCondition.createdAt.$gte = new Date(reqBody.fromDate);
//             }
//             if (reqBody.toDate) {
//                 let to = new Date(reqBody.toDate);
//                 to.setHours(23, 59, 59, 999); // দিনের শেষ সময়
//                 MatchCondition.createdAt.$lte = to;
//             }
//         }
//
//
//
//         let data = await MealModel.aggregate([
//             { $match: MatchCondition },
//             {
//                 $facet: {
//                     allTask: [{ $sort: { createdAt: -1 } }],
//                     totalCount: [{ $count: "total" }],
//                     statusCount: [{ $group: { _id: "$status", count: { $sum: 1 }}}]
//                 }
//             }
//         ]);
//
//
//
//         return res.status(200).json({status: "success", message: "Task Filter successfully", data: data});
//
//     }
//     catch(error){
//         return  res.status(200).json({status: "Error", message: error.toString()});
//     }
// }


