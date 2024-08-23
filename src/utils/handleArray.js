export const handleArray = ({
  currentArray,
  addValue,
  removeValue,
  replaceValue,
}) => {
  addValue = addValue || [];
  removeValue = removeValue || [];
  if (!currentArray) return [];

  if (replaceValue)
    return replaceValue.filter((val, ind) => currentArray.indexOf(val) === ind);

  currentArray = currentArray
    .concat(addValue)
    .filter((item) => !removeValue.includes(item));
  currentArray = currentArray.filter(
    (val, ind) => currentArray.indexOf(val) === ind
  );
  return currentArray;
};
