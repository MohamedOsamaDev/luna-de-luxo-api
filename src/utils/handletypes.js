export const handleNumber = (number, onError = 0) => {
  return isNaN(Number(number)) ? onError : number;
};

export const removeSpecificText = (str = "", textsToRemove = []) => {
  return str
    ?.split(",")
    ?.filter((item) => !textsToRemove.includes(item.trim()))
    ?.join(",");
};
