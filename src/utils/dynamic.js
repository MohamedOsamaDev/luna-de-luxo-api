import Joi from "joi";
// Object mapping of Mongoose types to Joi validators
const JoiTypeMap = {
  String: (mongooseField) => handleString(mongooseField),
  Number: (mongooseField) => handleNumber(mongooseField),
  Date: () => Joi.date(),
  Boolean: () => Joi.boolean(),
  ObjectId: () => Joi.string().regex(/^[0-9a-fA-F]{24}$/), // ObjectId validation
  Mixed: () => Joi.any(),
  Array: (mongooseField) => handleArray(mongooseField), // Array types handled separately
  Embedded: (mongooseField) => mongooseToJoi(mongooseField.schema), // Nested objects (subdocuments)
};
// Function to handle strings with min/max/length
function handleString(mongooseField) {
  let JoiField = Joi.string();
  if (mongooseField.options.minLength) {
    JoiField = JoiField.min(mongooseField.options.minLength);
  }
  if (mongooseField.options.maxLength) {
    JoiField = JoiField.max(mongooseField.options.maxLength);
  }
  return JoiField;
}
// Function to handle numbers with min/max
function handleNumber(mongooseField) {
  let JoiField = Joi.number();
  if (mongooseField.options.min) {
    JoiField = JoiField.min(mongooseField.options.min);
  }
  if (mongooseField.options.max) {
    JoiField = JoiField.max(mongooseField.options.max);
  }
  return JoiField;
}
// Function to handle arrays, including arrays of nested objects or arrays
function handleArray(mongooseField) {
  let JoiArray = Joi.array();
  if (mongooseField.$embeddedSchemaType) {
    const arrayFieldType = mongooseField.$embeddedSchemaType.instance;
    if (arrayFieldType === "DocumentArrayElement") {
      JoiArray = JoiArray.items(mongooseToJoi(mongooseField.schema));
    } else {
      JoiArray = JoiArray.items(
        JoiTypeMap[arrayFieldType]
          ? JoiTypeMap[arrayFieldType](mongooseField)
          : Joi.any()
      );
    }
  }
  // Add min/max constraints for arrays
  if (mongooseField.options.min) {
    JoiArray = JoiArray.min(mongooseField.options.min);
  }
  if (mongooseField.options.max) {
    JoiArray = JoiArray.max(mongooseField.options.max);
  }

  return JoiArray;
}
// Function to handle enum fields (if present in the schema)
function handleEnum(enumValues) {
  return Joi.string().valid(...enumValues);
}
export const mongooseToJoi = (schema) => {
  const JoiSchema = {};

  for (const field in schema.paths) {
    const mongooseField = schema.paths[field];
    const fieldType = mongooseField.instance;
    const isRequired = mongooseField.isRequired || false;

    // Get the corresponding Joi type from the map
    if (JoiTypeMap[fieldType]) {
      JoiSchema[field] = JoiTypeMap[fieldType](mongooseField);
    } else {
      JoiSchema[field] = Joi.any(); // Default to Joi.any() for unknown types
    }

    // Apply 'required' condition if necessary
    if (isRequired) {
      JoiSchema[field] = JoiSchema[field].required();
    }
  }

  return Joi.object(JoiSchema);
};
