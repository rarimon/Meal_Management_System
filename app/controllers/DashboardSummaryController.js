import MealModel from "../models/MealModel.js";


export const TaskSummary=async (req, res) => {

    try{

      let UserInfo=  {$lookup: {from: "users", localField: "_id", foreignField: "_id", as: "user"}};
      let UnWinStage= { $unwind: "$user" };
      let projectStage={$project: {_id: 0, userName: "$user.firstname",status: "$_id.status", count: 1}};

        const TaskSummary = await MealModel.aggregate([
            {
                $facet: {
                    // Total tasks
                    totalTasks: [{ $count: "total" }],

                    // Status-wise tasks
                    statusWise: [{$group: {_id: "$status", count: { $sum: 1 }}}],

                    //User Status wise tasks
                    userStatusWise: [{$group: {_id: {user_id: "$user_id", status: "$status"}, count: { $sum: 1 }}},
                        {$lookup: {from: "users", localField: "_id.user_id",foreignField: "_id", as: "user"}},
                        { $unwind: "$user" },
                        {$project: {_id: 0, user: "$user.firstname", status: "$_id.status", count: 1}}
                    ],

                    //User wise Total tasks
                    userWiseTotal:[{$group: {_id: "$user_id", count: { $sum: 1 }}},
                        UserInfo,
                        UnWinStage,
                        projectStage
                    ]


                }
            }
        ]);




        return res.status(200).json({status: "success", message: "Task created successfully",data:TaskSummary});

    }
    catch (error) {
        return res.status(200).json({status: "Error", message: error.toString()});
    }

}