import createError from "../utils/createError.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const createConversation = async (req, res, next) => {
  const lawyeridd = req.isLawyer ? req.userId : req.body.to;
  const resultLawyer = await User.findById(lawyeridd);
  const clientidd = req.isLawyer ? req.body.to : req.userId;
  const resultClient = await User.findById(clientidd);
  const newConversation = new Conversation({
    id: req.isLawyer ? req.userId + req.body.to : req.body.to + req.userId,
    lawyerId: req.isLawyer ? req.userId : req.body.to,
    lawyerName: resultLawyer.name,
    clientId: req.isLawyer ? req.body.to : req.userId,
    clientName: resultClient.name,
    readByLawyer: req.isLawyer,
    readByClient: !req.isLawyer,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).send(savedConversation);
  } catch (err) {
    next(err);
  }
};

export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          ...(req.isLawyer ? { readByLawyer: true } : { readByClient: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id });
    if (!conversation) return next(createError(404, "Not found!"));
    res.status(200).send(conversation);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find(
      req.isLawyer ? { lawyerId: req.userId } : { clientId: req.userId }
    ).sort({ updatedAt: -1 });
    res.status(200).send(conversations);
  } catch (err) {
    next(err);
  }
};
