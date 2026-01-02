import {
  removeUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";

import express from "express";

const router = express.Router();

router.post("/", registerUser);
router.post("/:email", loginUser);
router.delete("/:email", removeUser);
export default router;
