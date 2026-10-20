const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");


// ======================================================
// GET ALL USERS - ADMIN
// GET /api/users
// ======================================================
router.get("/", getAllUsers);


// ======================================================
// GET USER PROFILE
// GET /api/users/:id/profile
// ======================================================
router.get("/:id/profile", getUserProfile);


// ======================================================
// UPDATE USER PROFILE
// PUT /api/users/:id/profile
// ======================================================
router.put("/:id/profile", updateUserProfile);


// ======================================================
// UPDATE USER ROLE - ADMIN
// PUT /api/users/:id/role
// ======================================================
router.put("/:id/role", updateUserRole);


// ======================================================
// DELETE USER - ADMIN
// DELETE /api/users/:id
// ======================================================
router.delete("/:id", deleteUser);


// ======================================================
// EXPORT ROUTER
// ======================================================
module.exports = router;