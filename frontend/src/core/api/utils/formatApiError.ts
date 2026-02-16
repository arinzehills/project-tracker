/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatApiError = (error: any) => {
  const data = error.response?.data;
  let formattedErrors = '';

  if (data?.errors) {
    Object.keys(data.errors).forEach((key) => {
      formattedErrors = Array.isArray(data.errors[key])
        ? data.errors?.[key][0]
        : data.errors?.[key];
    });
  } else {
    formattedErrors = data?.message || error.message || 'An error occurred';
  }

  return formattedErrors;
};
