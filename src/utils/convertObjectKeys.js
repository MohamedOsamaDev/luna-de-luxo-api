export const convertObjectKeys = (inputObj) => {
    const result = {};
    for (const [key, value] of Object.entries(inputObj)) {
      const parts = key.split(/[\[\]]+/).filter(Boolean); // Split by '[' and ']', filter out empty strings
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = value; // Set the value for the last part
        } else {
          current = current[part] = current[part] || {}; // Create nested object if it doesn't exist
        }
      }
    }
  
    return result;
  };