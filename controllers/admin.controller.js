import User from "../models/user.model.js";
import createError from '../utils/createError.js';


export const getLawyer = async(req,res,next)=>{
    const data = await User.find({isLawyer:true});
    res.send(data);
}