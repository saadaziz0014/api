import User from "../models/user.model.js";

export const verifyBarcard = async (req, res, next) => {
  try {
    const id = req.userId;
    const result = await User.findById(id);
    if (result) {
      if (result.isVerify == true) {
        next();
      } else {
        res.status(401).send("Must be Verifled");
      }
    } else {
      res.status(401).send("User not exist");
    }
  } catch (error) {
    console.log(error);
  }
};
