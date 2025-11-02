// Simple in-memory storage (can be upgraded to AsyncStorage later) 
let currentUserPhone: string | null = null;

export const setCurrentUserPhone = (phone: string): void => {
  currentUserPhone = phone;
  console.log("User phone set to:", phone);
};

export const getCurrentUserPhone = (): string | null => {
  return currentUserPhone;
};

export const clearCurrentUserPhone = (): void => {
  currentUserPhone = null;
};

