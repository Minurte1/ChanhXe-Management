//hàm validateForm kiểm tra xem các trường bắt buộc đã được điền chưa
export const validateForm = (formData, requiredFields) => {
    const errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `Vui lòng điều vào trường này`;
      }
    });
    return errors;
  };