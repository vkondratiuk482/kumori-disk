export const deepFreeze = (object: object): Record<string, any> => {
  for (const key of Object.keys(object)) {
    const value = object[key];

    if (value && (typeof value === 'object' || typeof value === 'function')) {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
};
