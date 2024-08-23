export const checkUniqueFeilds = async (model, feild) => {
  const document = await model.findOne({ [feild]: feild });
  return document;
};
