//zod
import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Họ và tên phải có ít nhất 1 ký tự" })
      .min(3, { message: "Họ và tên phải có ít nhất 3 ký tự" }),
    email: z
      .email({ message: "Email không hợp lệ" })
      .min(1, { message: "Email không được để trống" }),
    password: z
      .string()
      .refine((value) => {
        // Kiểm tra xem mật khẩu có chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt hay không
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
      }, { message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(200, { message: "Mật khẩu không được quá 200 ký tự" }),
    confirmPassword: z
      .string(),
  })
  //Nó khác gì với refine() ở chỗ superRefine() cho phép bạn truy cập vào toàn bộ đối tượng và thêm lỗi tùy chỉnh vào bất kỳ trường nào, trong khi refine() chỉ cho phép bạn kiểm tra một trường cụ thể và trả về lỗi nếu không hợp lệ.
  .superRefine(({ password, confirmPassword }, ctx) => {
    // Kiểm tra xem confirmPassword có khớp với password hay không
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Xác nhận mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export const loginSchema = z
  .object({
    email: z
      .email({ message: "Email không hợp lệ" })
      .min(1, { message: "Email không được để trống" }),
    password: z
      .string()
      .min(1, { message: "Mật khẩu không được để trống" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  })

export type LoginSchemaType = z.infer<typeof loginSchema>
export type RegisterSchemaType = z.infer<typeof registerSchema>