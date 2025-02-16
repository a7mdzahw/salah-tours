import _ from "lodash";

export const formdataToJS = <T extends object>(formData: FormData) => {
  const obj: Record<string, any> = {};

  formData.forEach((value, key) => {
    // Handle array notation like images[] or files[]
    if (key.endsWith("[]")) {
      const cleanKey = key.slice(0, -2);

      if (!obj[cleanKey]) _.set(obj, cleanKey, []);

      obj[cleanKey].push(value);

      return;
    }

    // Handle normal key-value pairs
    _.set(obj, key, value);
  });

  return obj as T;
};
