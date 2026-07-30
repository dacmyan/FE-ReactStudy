const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not defined in the environment variables.");
}

export const env = {
  API_URL,
  //thêm những cái API khác vào đây
} as const;