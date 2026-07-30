import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useLoginMutation } from "@/features/auth/hooks/userAuth";
import { loginSchema, type LoginSchemaType } from "@/features/auth/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const highlights = [
  "Đồng bộ trạng thái nhanh với Zustand",
  "Quản lý phiên đăng nhập an toàn",
  "Trải nghiệm mượt trên mọi thiết bị",
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchemaType) => {
    handleLogin.mutate(data);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.2),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]" />
      <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden lg:block">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-sky-200 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Welcome back to your workspace
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                  Đăng nhập để tiếp tục hành trình xây dựng giao diện hiện đại.
                </h1>
                <p className="text-base leading-7 text-slate-300 xl:text-lg">
                  Truy cập hệ thống của bạn với trải nghiệm trực quan, rõ ràng
                  và chuyên nghiệp hơn.
                </p>
              </div>

              <div className="grid gap-3">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 backdrop-blur-sm"
                  >
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Card className="mx-auto w-full max-w-md border border-white/10 bg-white/10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <CardHeader className="space-y-3 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 shadow-lg shadow-sky-500/30">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-bold text-white">
                  Đăng nhập
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Nhập thông tin tài khoản của bạn để tiếp tục.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className={`h-11 border-white/10 bg-slate-900/50 pl-10 text-white placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-400/40 ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400/30" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-300">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-200">
                      Mật khẩu
                    </Label>
                    <button
                      type="button"
                      className="text-sm text-sky-300 transition hover:text-sky-200"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className={`h-11 border-white/10 bg-slate-900/50 pl-10 pr-11 text-white placeholder:text-slate-400 focus:border-sky-400 focus:ring-sky-400/40 ${errors.password ? "border-red-400 focus:border-red-400 focus:ring-red-400/30" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                      aria-label={
                        showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-300">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={handleLogin.isPending}
                  className="h-11 w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-500 text-white shadow-lg shadow-sky-900/30 transition-all duration-200 hover:scale-[1.01] hover:from-sky-400 hover:to-violet-400 active:scale-[0.99]"
                >
                  {handleLogin.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

                <p className="text-center text-sm text-slate-300">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-sky-300 transition hover:text-sky-200"
                  >
                    Tạo tài khoản
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
