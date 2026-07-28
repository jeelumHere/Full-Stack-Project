import {body,validationResult} from "express-validator"

function validateResult(req, res, next) {
    const result = validationResult(req)
    if (result.isEmpty()) {
        return next()
    }
    return res.status(400).json({ errors: result.array() })
}

export const validateUserInput = [
    body("username")
    .isString()
    .withMessage("Username must be a string")
    .isLength({min:8,max:20})
    .withMessage("Username must have 8 to 20 characters"),

    body("email")
    .isEmail()
    .withMessage("Invalid Email"),

    body("password")
    .isLength({min:8,max:20})
    .withMessage("Password must have 8 to 20 characters"),

    validateResult
]