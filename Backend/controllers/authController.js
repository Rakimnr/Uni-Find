import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Full name, email, password, and confirm password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR FULL:", error);
    return res.status(500).json({
      message: "Server error while registering user",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    req.session.user = {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Server error while logging in",
      error: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({
          message: "Logout failed",
        });
      }

      res.clearCookie("unifind.sid");

      return res.status(200).json({
        message: "Logout successful",
      });
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({
      message: "Server error while logging out",
      error: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const user = await User.findById(req.session.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ME ERROR:", error);
    return res.status(500).json({
      message: "Server error while fetching user",
      error: error.message,
    });
  }
};