import { Request, Response } from "express";
import User from "../models/user";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // Look for the user by the ID from the JWT
    const currentUser = await User.findOne({ _id: req.userId });

    // If user is not found, return a 404 status
    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return; // no need to return the response object, just exit
    }

    // If user is found, return the user data in the response
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    // In case of any error, send a 500 status with an error message
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createCurrentuser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;

    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      res.status(200).send();
      return;
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  getCurrentUser,
  createCurrentuser,
  updateCurrentUser,
};
