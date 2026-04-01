import User from "../models/User.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;
const studentIdRegex = /^[A-Za-z0-9/-]{4,20}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  studentId: user.studentId,
  faculty: user.faculty,
  department: user.department,
  batch: user.batch,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      studentId,
      faculty,
      department,
      batch,
      password,
      confirmPassword,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !studentId ||
      !faculty ||
      !department ||
      !batch ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (fullName.trim().length < 3) {
      return res.status(400).json({
        message: "Full name must be at least 3 characters",
      });
    }

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        message: "Please enter a valid phone number",
      });
    }

    if (!studentIdRegex.test(studentId.trim())) {
      return res.status(400).json({
        message:
          "Student ID must be 4 to 20 characters and use only letters, numbers, / or -",
      });
    }

    if (department.trim().length < 2) {
      return res.status(400).json({
        message: "Department must be at least 2 characters",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const normalizedStudentId = studentId.trim().toUpperCase();
    const normalizedFaculty = faculty.trim();
    const normalizedDepartment = department.trim();
    const normalizedBatch = batch.trim();

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    const existingStudentId = await User.findOne({
      studentId: normalizedStudentId,
    });
    if (existingStudentId) {
      return res.status(400).json({
        message: "An account with this student ID already exists",
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      studentId: normalizedStudentId,
      faculty: normalizedFaculty,
      department: normalizedDepartment,
      batch: normalizedBatch,
      password,
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
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
      email: email.trim().toLowerCase(),
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

    return req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to save session",
        });
      }

      return res.status(200).json({
        message: "Login successful",
        user: sanitizeUser(user),
      });
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
    if (!req.session || !req.session.user) {
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
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("ME ERROR:", error);
    return res.status(500).json({
      message: "Server error while fetching user",
      error: error.message,
    });
  }
};

export const updateCurrentUser = async (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const { fullName, phone, faculty, department, batch } = req.body;

    if (!fullName || !phone || !faculty || !department || !batch) {
      return res.status(400).json({
        message:
          "Full name, phone, faculty, department, and batch are required",
      });
    }

    if (fullName.trim().length < 3) {
      return res.status(400).json({
        message: "Full name must be at least 3 characters",
      });
    }

    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        message: "Please enter a valid phone number",
      });
    }

    if (department.trim().length < 2) {
      return res.status(400).json({
        message: "Department must be at least 2 characters",
      });
    }

    const user = await User.findById(req.session.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.fullName = fullName.trim();
    user.phone = phone.trim();
    user.faculty = faculty.trim();
    user.department = department.trim();
    user.batch = batch.trim();

    await user.save();

    req.session.user.fullName = user.fullName;
    req.session.user.email = user.email;
    req.session.user.role = user.role;

    return req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          message: "Profile updated, but session failed to refresh",
        });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        user: sanitizeUser(user),
      });
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Server error while updating profile",
      error: error.message,
    });
  }
};