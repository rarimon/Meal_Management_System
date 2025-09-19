import express from 'express';
import * as UserController from  '../controllers/UserController.js';
import * as MealController from '../controllers/MealController.js';
import * as ExpenseController from '../controllers/ExpenseController.js';
import * as DashboardSummaryController from  '../controllers/DashboardSummaryController.js';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';
import {VerifyRole} from "../middlewares/RoleMiddleware.js";


const routers = express.Router();


// User [After Login]
routers.post('/Registration',UserController.Registration);
routers.post('/Login',UserController.Login);

// User [Before Login]
routers.get('/ProfileDetails',AuthMiddleware,UserController.ProfileDetails);
routers.post('/ProfileUpdate',AuthMiddleware,UserController.ProfileUpdate);
routers.post('/ResetPassword',AuthMiddleware,UserController.ResetPassword);


// Admin [After Login]
routers.get('/UserList',AuthMiddleware,VerifyRole(["admin"]),UserController.UserList);
routers.post('/DeleteUser/:UserID',AuthMiddleware,VerifyRole(["admin"]),UserController.DeleteUser);
routers.post('/UpdateUserRole/:UserID',AuthMiddleware,VerifyRole(["admin"]),UserController.UpdateUserRole);
routers.post('/ProfileUpdateByUser/:UserID',AuthMiddleware,VerifyRole(["admin"]),UserController.ProfileUpdateByUser);

// // Admin [Task After Login]
// routers.get('/TaskList',AuthMiddleware,VerifyRole(["admin"]),TaskController.TaskList);
// routers.get('/TotalTask',AuthMiddleware,VerifyRole(["admin"]),TaskController.TotalTask);
// routers.post('/FilterTask',AuthMiddleware,VerifyRole(["admin"]),TaskController.FilterTask);
//
// // Admin [Dashboard Summary]
// routers.get('/TaskSummary',AuthMiddleware,VerifyRole(["admin"]),DashboardSummaryController.TaskSummary);
//


// Meal [Before Login]
routers.post('/AddMeal',AuthMiddleware,MealController.AddMeal);
routers.post('/UpdateMeal/:mealID',AuthMiddleware,MealController.UpdateMeal);
routers.delete('/DeleteMeal/:id',AuthMiddleware,MealController.DeleteMeal);
routers.get('/MealList',AuthMiddleware,MealController.MealList);
routers.post('/FilterMeal',AuthMiddleware,MealController.FilterMeal);


// Expense [Before Login]
routers.post('/AddExpense',AuthMiddleware,ExpenseController.AddExpense);
routers.post('/UpdateExpense/:ID',AuthMiddleware,ExpenseController.UpdateExpense);
routers.delete('/DeleteExpense/:id',AuthMiddleware,ExpenseController.DeleteExpense);
// routers.get('/MealList',AuthMiddleware,ExpenseController.MealList);
// routers.post('/FilterMeal',AuthMiddleware,ExpenseController.FilterMeal);













export default routers;