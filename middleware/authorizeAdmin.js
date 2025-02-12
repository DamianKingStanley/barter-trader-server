import jwt from "jsonwebtoken";
import decode from "jwt-decode";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET;

const authorizeAdmin = (req, res, next) => {
  try {
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default authorizeAdmin;
