const { body, param, validationResult } = require("express-validator");

const validateUserFields = () => {
  return [
    body("full_name")
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ max: 50 })
      .withMessage("Full name must be less than 51 characters"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isLength({ max: 50 })
      .withMessage("Full name must be less than 51 characters"),
    body("efficiency")
      .notEmpty()
      .withMessage("Efficiency is required")
      .isInt({ min: -2147483647, max: 2147483646 })
      .withMessage(
        "Efficiency must be an integer between -2147483647 and 2147483646"
      ),
  ];
};

const checkValidationResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      result: {
        errors: errors.array(),
      },
    });
  }
  next();
};

const validatePathParams = () => {
  return [param("id").isInt().withMessage("User ID must be an integer")];
};

module.exports = {
  validateUserFields,
  checkValidationResults,
  validatePathParams,
};
