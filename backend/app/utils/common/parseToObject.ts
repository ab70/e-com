export const parseToObject= (others: { [key: string]: any })=> {
    return Object.fromEntries(
      Object.entries(others).map(([key, value]) => {
        if (typeof value === 'string') {
          try {
            return [key, JSON.parse(value)];
          } catch {
            return [key, value]; // If not a valid JSON string, keep the original value
          }
        }
        return [key, value];
      })
    );
  }