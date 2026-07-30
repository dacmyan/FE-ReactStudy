import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  registerSchema,
  type RegisterSchemaType,
} from "@/features/auth/schema";
import { useRegisterMutation } from "@/features/auth/hooks/userAuth";

export default function RegisterPage() {
  const handleRegister = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    mode: "onTouched",
    //"onChange" sẽ validate ngay khi người dùng nhập liệu,
    //"onBlur" sẽ validate khi người dùng rời khỏi trường input,
    // còn "onTouched" sẽ validate khi người dùng đã tương tác với trường input (chạm vào và rời khỏi).
    // resolver: kết nối Zob schema với react-hook-form để tự động validate dựa trên các quy tắc đã định nghĩa trong schema.
    resolver: zodResolver(registerSchema),

    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: RegisterSchemaType) => {
    handleRegister.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <Card className="w-full max-w-sm shadow-xl border-slate-200/80 dark:border-slate-800 backdrop-blur-sm bg-white/95 dark:bg-slate-950/95">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Đăng ký
          </CardTitle>
          <CardDescription>Tạo tài khoản mới để tiếp tục</CardDescription>
        </CardHeader>

        {/* 
        Flow: User bấm submit -> handleSubmit chạy validation
        -> Nếu ok: gọi handleRegister -> gọi API -> nếu thành công thì setTokens, nếu lỗi thì clearTokens
        -> nếu lỗi: update errors trong formState -> hiển thị lỗi dưới input tương ứng
        */}

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-slate-600 dark:text-slate-400"
              >
                Họ và tên
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                {...register("fullName")}
                required
                className={`transition-all duration-200 focus:scale-[1.01] ${errors.fullName ? "border-red-500" : ""}`}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-slate-600 dark:text-slate-400"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                required
                className={`transition-all duration-200 focus:scale-[1.01] ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-slate-600 dark:text-slate-400"
              >
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                required
                className={`transition-all duration-200 focus:scale-[1.01] ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-slate-600 dark:text-slate-400"
              >
                Xác nhận mật khẩu
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                required
                className={`transition-all duration-200 focus:scale-[1.01] ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 transition-all duration-200 active:scale-[0.98]"
            >
              {handleRegister.isPending ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
