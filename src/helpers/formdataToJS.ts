export const formdataToJS = <T extends object>(formData: FormData) => {
  const obj: Record<string, string | File> = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj as T;
};
