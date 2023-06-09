import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";
export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);
  let gig = await Gig.findById(req.params.id);
  if (!gig) {
    const order = await Order.findById(req.params.id);
    gig = await Gig.findById(order.gigId);
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.fee * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    clientId: req.userId,
    lawyerId: gig.userId,
    fee: gig.fee,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
    success: true,
  });
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isLawyer ? { lawyerId: req.userId } : { clientId: req.userId }),
    });

    res.status(200).send(orders);
  } catch (err) {
    console.log("error in get");
    next(err);
  }
};
export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
        _id: req.body.id,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};
