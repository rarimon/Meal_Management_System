import UserModel from  '../models/UserModel.js';
import {TokenEncode} from "../utility/TokenUtility.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

let OBJECTID = mongoose.Types.ObjectId;



export const Registration=async (req, res) => {
    try {

        let reqBody=req.body;
        // Check if email && phone already exists
        let existingEmail = await UserModel.findOne({ email: reqBody.email });
        let existingPhone = await UserModel.findOne({ phone: reqBody.phone });

        if (existingEmail && existingPhone) {
            return res.status(400).json({status: "fail", message: "Email & Phone Number already registered"});
        }
        else if(existingEmail){
            return res.status(400).json({status: "fail", message: "Email  already registered"});
        }
        else if(existingPhone){
            return res.status(400).json({status: "fail", message: "Phone Number  already registered"});
        }

        // create user
        let data=await UserModel.create(reqBody);
        return res.status(200).json({ status:"success",message:"User registration successful"});

    }
    catch (error) {
        res.status(200).json({ status:"Internal server error",message:error.toString() });
    }
}


export const Login=async (req, res) => {

    try {
        let reqBody = req.body;

        //Check if user exists
        const data = await UserModel.findOne({
            $or:[
                { email: reqBody.email  },
                { phone: reqBody.phone  }
            ]
        });

        if (data == null) {
            return res.status(401).json({ status: "error", message: "User Not Found !" });
        }


        //Compare password
        const isMatch = await bcrypt.compare(reqBody['password'], data['password']);
        if (!isMatch) {
            return res.status(401).json({ status: "error", message: "Invalid Password!" });
        }

        //check user role
        if(data['role']!==reqBody.role){
            return res.status(401).json({ status: "error", message: "Access denied" });
        }

        //Generate Token
        let token=TokenEncode(data['email'],data['_id'],data['role']);
        res.status(200).json({ status:"success",message:"Login Successfully",token:token });


    } catch (error) {
        res.status(200).json({ status: "Internal server error", message: error.toString() });
    }
}


export const ProfileDetails=async (req, res) => {

    try {
        let email = req.headers['email'];
        let user_id = req.headers['user_id'];
        let data = await UserModel.findOne({email:email,_id:user_id});
        return res.status(200).json({ status: "success", message: "Profile details fetched successfully", data:data });
    }
    catch (err){
        return res.status(200).json({ status: "error", message: err.toString() });
    }


}


export const ProfileUpdate=async (req, res) => {
    try{
        let email = req.headers['email'];
        let user_id = req.headers['user_id'];
        let reqBody = req.body;
        let data = await UserModel.updateOne({email:email,_id:user_id},reqBody);
        return res.status(200).json({ status: "success", message: "Profile updated successfully", data:data });
    }
    catch(err){
        return res.status(200).json({ status: "error", message: err.toString() });
    }
}


export const ResetPassword=async (req, res) => {

    try {
        let reqBody = req.body;

        //Check if user exists
        const data = await UserModel.findOne({
            $or:[
                { email: reqBody.email  },
                { phone: reqBody.phone  }
            ]
        });

        if (data == null) {
            return res.status(401).json({ status: "error", message: "User Not Found !" });
        }

        //Compare password
        const isMatch = await bcrypt.compare(reqBody['old_password'], data['password']);
        if (!isMatch) {
            return res.status(401).json({ status: "error", message: "Invalid old Password!" });
        }

        //Update Password
        data.password = reqBody['new_password'];
        await data.save();


        res.status(200).json({ status:"success",message:"Password Reset Successfully"});


    } catch (error) {
        res.status(200).json({ status: "Internal server error", message: error.toString() });
    }
}




// =======================Admin Only=======================

export const UserList=async (req, res) => {

    try {


        let projectStage ={$project:{password:0}}
        let data = await UserModel.aggregate([
            {$match:{}},
            projectStage
        ]);


        res.status(200).json({ status:"success",message:"Password Reset Successfully",data:data});


    } catch (error) {
        res.status(200).json({ status: "Internal server error", message: error.toString() });
    }
}

export const DeleteUser=async (req, res) => {

    try {

        let UserID =new OBJECTID(req.params.UserID);
        let data=await UserModel.deleteOne({_id:UserID});

        res.status(200).json({ status:"success",message:"User Delete Successfully",data:data});


    } catch (error) {
        res.status(200).json({ status: "Internal server error", message: error.toString() });
    }
}

export const UpdateUserRole=async (req, res) => {

    try {

        let UserID =new OBJECTID(req.params.UserID);
        let reqBody=req.body;


        let data=await UserModel.updateOne({_id:UserID},{$set:{role:reqBody.role}});

        res.status(200).json({ status:"success",message:"User Role update Successfully",data:data});


    } catch (error) {
        res.status(200).json({ status: "Internal server error", message: error.toString() });
    }
}

export const ProfileUpdateByUser=async (req, res) => {
    try{
        let user_id = new OBJECTID(req.params.UserID);
        let reqBody = req.body;
        let data = await UserModel.updateOne({_id:user_id},reqBody);
        return res.status(200).json({ status: "success", message: "Profile updated successfully", data:data });
    }
    catch(err){
        return res.status(200).json({ status: "error", message: err.toString() });
    }
}

