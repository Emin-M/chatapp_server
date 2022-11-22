const router = require("express").Router();
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const protectedAuth = require("../middlewares/protectedAuth");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(protectedAuth);
router.patch("/changePassword", userController.changePassword);
router.patch("/", userController.updateUser);

module.exports = router;