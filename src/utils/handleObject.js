
export const getNestedProperty = (obj, key) => {
  return key?.split('.')?.reduce((acc, part) => acc && acc?.[part], obj) || "...";
}
