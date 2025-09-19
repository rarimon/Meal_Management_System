import {TokenDecode} from "../utility/TokenUtility.js";

export default (req, res, next) => {

    let token = req.headers['token'];

    let decode=TokenDecode(token);

    if(decode===null){
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
    else{

        // pic email and user_id from decode function
        let email = decode['email'];
        let user_id = decode['user_id'];
        let role = decode['role'];

        // email and user_id ,role,set to req headers
        req.headers.email = email;
        req.headers.user_id = user_id;
        req.headers.role = role;

        next()

    }

}