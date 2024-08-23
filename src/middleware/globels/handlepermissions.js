import { handleArray } from "../../utils/handleArray.js";
import { AsyncHandler } from "./AsyncHandler.js";
// this code give full access of the permissions and handel any unexpected errors that might have occurred
// and respect the business roles
export const handlePermissions = AsyncHandler(async (req, res, next) => {
  if (
    res.locals.schema.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "super_admin"
  ) {
    // if the user is not a super admin | createtor this product then  return next and ignore any updates in permissions
    delete req.body["havePermission"];
    return next();
  }
  // take deep copy of currentPermissions and covert to strings
  let currentPermissions = [...res.locals.schema.havePermission].map(String);
  // declare data from body (client)
  let { addpermission, removepermission, havePermission } = req.body;

  if (!addpermission && !removepermission && !havePermission) return next();
  req.body.havePermission = handleArray({
    currentArray: currentPermissions,
    addValue: addpermission,
    removeValue: removepermission,
    replaceValue: havePermission,
  });
  return next();
});
