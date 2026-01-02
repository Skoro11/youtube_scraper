import { createUser, findUser, deleteUser } from "../services/userService.js";

export async function registerUser(req, res) {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Create user in database
    const user = await createUser(email);

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    res.status(200).json({ message: "User found", user });
  } catch (error) {
    throw error;
  }
}

export async function removeUser(req, res) {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const deletedUser = await deleteUser(email);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
