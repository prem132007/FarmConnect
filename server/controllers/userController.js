const User = require("../models/User");

// ======================================================
// GET ALL USERS - ADMIN
// GET /api/users
// ======================================================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};


// ======================================================
// GET USER PROFILE
// GET /api/users/:id/profile
// ======================================================
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });

  } catch (error) {
    console.error("Get User Profile Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    res.status(500).json({
      message: "Failed to fetch user profile",
    });
  }
};


// ======================================================
// UPDATE USER PROFILE
// PUT /api/users/:id/profile
// ======================================================
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      gender,
      dateOfBirth,
      address,
      city,
      state,
      pincode,
      country,
    } = req.body;


    // ==================================================
    // FIND USER
    // ==================================================

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // ==================================================
    // VALIDATE NAME
    // ==================================================

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      user.name = name.trim();
    }


    // ==================================================
    // PHONE
    // ==================================================

    if (phone !== undefined) {
      user.phone = phone.trim();
    }


    // ==================================================
    // GENDER
    // ==================================================

    if (gender !== undefined) {
      const allowedGenders = [
        "Male",
        "Female",
        "Other",
      ];

      if (!allowedGenders.includes(gender)) {
        return res.status(400).json({
          message: "Invalid gender",
        });
      }

      user.gender = gender;
    }


    // ==================================================
    // DATE OF BIRTH
    // ==================================================

    if (dateOfBirth !== undefined) {
      if (!dateOfBirth) {
        return res.status(400).json({
          message: "Date of birth is required",
        });
      }

      user.dateOfBirth = dateOfBirth;
    }


    // ==================================================
    // ADDRESS
    // ==================================================

    if (address !== undefined) {
      user.address = address.trim();
    }


    // ==================================================
    // CITY
    // ==================================================

    if (city !== undefined) {
      user.city = city.trim();
    }


    // ==================================================
    // STATE
    // ==================================================

    if (state !== undefined) {
      user.state = state.trim();
    }


    // ==================================================
    // PINCODE
    // ==================================================

    if (pincode !== undefined) {
      user.pincode = pincode.trim();
    }


    // ==================================================
    // COUNTRY
    // ==================================================

    if (country !== undefined) {
      user.country = country.trim();
    }


    // ==================================================
    // SAVE USER
    // ==================================================

    await user.save();


    // ==================================================
    // REMOVE PASSWORD
    // ==================================================

    const updatedUser = await User.findById(id)
      .select("-password");


    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error(
      "Update User Profile Error:",
      error
    );


    // ==================================================
    // MONGOOSE VALIDATION ERROR
    // ==================================================

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }


    // ==================================================
    // INVALID MONGODB ID
    // ==================================================

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }


    // ==================================================
    // OTHER ERROR
    // ==================================================

    res.status(500).json({
      message:
        error.message ||
        "Failed to update user profile",
    });
  }
};


// ======================================================
// UPDATE USER ROLE - ADMIN
// PUT /api/users/:id/role
// ======================================================
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = [
      "customer",
      "farmer",
      "admin",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user,
    });

  } catch (error) {
    console.error(
      "Update User Role Error:",
      error
    );

    res.status(500).json({
      message: "Failed to update user role",
    });
  }
};


// ======================================================
// DELETE USER - ADMIN
// DELETE /api/users/:id
// ======================================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete User Error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};


// ======================================================
// EXPORT
// ======================================================
module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  deleteUser,
};