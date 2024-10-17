const Router = require("express");
const UserController = require("../api/user/UserController");
const { validateUserFields, checkValidationResults, validatePathParams } = require("../utils/checkFieldRequired");
const userRouter = Router();

userRouter.post("/create", validateUserFields(), checkValidationResults,  UserController.create);
userRouter.get("/get/:id", UserController.getCurrent);
userRouter.get("/get", UserController.getFiltered);
userRouter.patch("/update/:id", validatePathParams(), checkValidationResults, UserController.update)
userRouter.delete("/delete/:id?", UserController.delete)

module.exports = userRouter;
