// Clerk's errors aren't axios errors: the readable text is in errors[0], not response.data.message
export const clerkErrorMessage = (error) =>
    error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error?.message || "Something went wrong";
