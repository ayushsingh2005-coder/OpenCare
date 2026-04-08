const { errorResponse } = require('../utils/apiResponse');

const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return errorResponse(
                res,
                403,
                `Access denied. Only ${roles.join(', ')} can perform this action.`
            );
        }
        next();
    };
};

module.exports = roleMiddleware;