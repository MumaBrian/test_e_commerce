const CustomError = require("../errors")


const checkPermissions = (requestUser, resourceId) => {
    if (requestUser.role === 'admin') return
    if (requestUser.userId === resourceId.toString()) return
    throw new CustomError.UnauthorizedError('Not authorized to this route')
}

module.exports = checkPermissions