export const parseToObject = (others: { [key: string]: any }): { [key: string]: any } => {
  const result: { [key: string]: any } = {};

  for (const key in others) {
    const value = others[key];

    if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
      try {
        result[key] = JSON.parse(value); // Parse JSON strings
      } catch {
        result[key] = value; // Leave as-is if parsing fails
      }
    } else {
      result[key] = value; // Non-JSON strings or other types are untouched
    }
  }
  return result;
};