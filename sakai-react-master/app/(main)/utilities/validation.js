export const validateForm = (formData, requiredFields) => {
    const errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field} là bắt buộc`;
      }
    });
    return errors;
  };