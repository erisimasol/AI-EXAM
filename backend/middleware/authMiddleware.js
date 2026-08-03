import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  // because of cookie parser we able to use this here
  let token = req.cookies.jwt;

  // cookie present
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // this userID come from generate token
      // when we use jwt.sign we pass payload as userId and now we can access it here
      // this user will contain full bj including password we dont want to send it so we
      // remove it using -passowrd
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized , Invalid Token ");
    }
  } else {
    // no token present
    res.status(401);
    throw new Error("Not Authorized , no Token ");
  }
});

// Role-Based Access Control: department heads create/assign exams, supervisors
// monitor progress and review incidents, employees only see their own department's exams.
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not Authorized, no user context");
    }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.user.role}' is not permitted to perform this action`
      );
    }
    next();
  };
};

export { protect, authorizeRoles };
