import jwt from 'jsonwebtoken';
import {JWT_EXPIRE_TIME, JWT_KEY} from "../config/config.js";


export const TokenEncode = (email,user_id,role) => {
    let KEY=JWT_KEY
    let EXPIRE={expiresIn:JWT_EXPIRE_TIME}
    let PAYLOAD = {email: email, user_id: user_id,role:role};
    return jwt.sign(PAYLOAD, KEY, EXPIRE);
}


export const TokenDecode = (token) => {

    try{
        return jwt.verify(token, JWT_KEY);

    }
    catch(error){
        return null;
    }

}