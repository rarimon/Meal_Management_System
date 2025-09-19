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
//
// export const TaskListByStatus=async (req, res) => {
//     try{
//         let status=req.params.status;
//         let user_id=req.headers['user_id'];
//         let data=await MealModel.find({"status":status,"user_id":user_id});
//         return res.status(200).json({status: "success", message: "Task Details successfully", data: data});
//
//     }
//     catch(error){
//         return  res.status(200).json({status: "Error", message: error.toString()});
//     }
// }
//
// export const DeleteTask=async (req, res) => {
//     try{
//         let id=req.params.id;
//         let user_id=req.headers['user_id'];
//         let data=await MealModel.deleteOne({"_id":id,"user_id":user_id});
//         return res.status(200).json({status: "success", message: "Task Details successfully", data: data});
//     }
//     catch(error){
//         return  res.status(200).json({status: "Error", message: error.toString()});
//     }
// }
//
// export const CountTask=async (req, res) => {
//     try{
//
//         let user_id=req.headers['user_id'];
//         let ObjectID=mongoose.Types.ObjectId;
//         let user_id_object=new ObjectID(user_id);
//         let data = await MealModel.aggregate([
//             {$match:{user_id:user_id_object}},
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


