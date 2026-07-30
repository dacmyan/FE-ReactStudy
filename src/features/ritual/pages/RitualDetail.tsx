import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRitualDetail } from "@/features/ritual/hooks/useRitualDetail";
import { LoadingState, ErrorState } from "@/shared/components/states/StatusState";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Book,
  Flame,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  CheckSquare,
  Square,
  Bookmark,
  Activity,
  Heart
} from "lucide-react";

const RitualDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ritual, isLoading, error, refetch } = useRitualDetail(id);

  // States for user interactivity
  const [activePrayerId, setActivePrayerId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checkedOfferings, setCheckedOfferings] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !ritual) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : "Không tìm thấy nghi lễ này"}
        onRetry={refetch}
      />
    );
  }

  // Fallback for default active prayer
  const prayers = ritual.prayers || [];
  const currentActivePrayerId = activePrayerId || (prayers.length > 0 ? prayers[0].id : null);
  const activePrayer = prayers.find((p) => p.id === currentActivePrayerId);

  // Split steps from content
  const steps = ritual.content
    ? ritual.content
        .split("\n")
        .map((step) => step.trim())
        .filter((step) => step.length > 0)
    : [];

  const handleCopyPrayer = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleOffering = (offeringId: string) => {
    setCheckedOfferings((prev) => ({
      ...prev,
      [offeringId]: !prev[offeringId],
    }));
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Helper to color difficulty level
  const getDifficultyBadge = (level: string) => {
    const norm = level.toLowerCase().trim();
    if (norm === "dễ") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Dễ
        </span>
      );
    }
    if (norm === "trung bình") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Trung bình
        </span>
      );
    }
    if (norm === "khó") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
          Khó
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        Rất khó
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
        <div className="text-xs text-muted-foreground">
          Cập nhật lúc: {new Date(ritual.updatedAt).toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900 to-amber-955 text-white p-6 sm:p-10 shadow-xl border border-amber-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-700/20 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Background Subtle Icon Pattern */}
        <div className="absolute -right-8 -bottom-8 text-amber-500/10 pointer-events-none transform rotate-12 scale-150">
          <Sparkles className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {ritual.isHot && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-amber-950 shadow-md">
                <Flame className="w-3 h-3 fill-amber-950" />
                Nổi bật
              </span>
            )}
            {getDifficultyBadge(ritual.difficultyLevel)}
            {ritual.ritualTags?.map((rt) => (
              <span
                key={rt.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20"
              >
                #{rt.tag.name}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight drop-shadow-md">
            {ritual.name}
          </h1>

          <p className="text-amber-100/90 text-sm sm:text-base max-w-3xl leading-relaxed italic">
            &ldquo;{ritual.description || "Nghi lễ tâm linh truyền thống Việt Nam"}&rdquo;
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-amber-200/70">Thời gian làm</div>
                <div className="text-sm font-bold">
                  {ritual.timeOfExecution ? `${ritual.timeOfExecution} phút` : "Chưa xác định"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-amber-200/70">Ngày Âm lịch</div>
                <div className="text-sm font-bold">{ritual.dateLunar || "Mọi ngày"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-amber-400">
                <Calendar className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs text-amber-200/70">Ngày Dương lịch</div>
                <div className="text-sm font-bold">{ritual.dateSolar || "Mọi ngày"}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-amber-400">
                <Book className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-amber-200/70">Nguồn tham khảo</div>
                <div className="text-sm font-bold truncate max-w-[150px]" title={ritual.reference || "Không có"}>
                  {ritual.reference || "Gia truyền / Dân gian"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Steps and Prayers */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step-by-Step Instructions */}
          <Card className="border border-foreground/5 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 border-b border-foreground/5 py-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold font-serif text-amber-900">
                    Trình Tự Thực Hiện
                  </CardTitle>
                  <CardDescription>
                    Theo dõi và tích chọn từng bước để hoàn thành nghi lễ trọn vẹn
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {steps.length > 0 ? (
                <div className="space-y-4">
                  {steps.map((step, idx) => {
                    const isCompleted = completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 hover:bg-amber-50/30 ${
                          isCompleted
                            ? "bg-emerald-50/30 border-emerald-200/60 text-muted-foreground"
                            : "bg-white border-foreground/5 shadow-sm"
                        }`}
                      >
                        <button className="mt-0.5 text-amber-700 focus:outline-none flex-shrink-0">
                          {isCompleted ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Square className="w-5 h-5 text-amber-600/70" />
                          )}
                        </button>
                        <div className="space-y-1">
                          <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-emerald-600' : 'text-amber-700'}`}>
                            Bước {idx + 1}
                          </span>
                          <p className={`text-sm sm:text-base leading-relaxed ${isCompleted ? 'line-through decoration-emerald-500/40 text-muted-foreground' : 'text-foreground font-medium'}`}>
                            {step}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  Chưa cập nhật chi tiết các bước thực hiện.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Prayers / Liturgies */}
          {prayers.length > 0 && (
            <Card className="border border-foreground/5 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 border-b border-foreground/5 py-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold font-serif text-amber-900">
                      Văn Khấn / Kinh Văn
                    </CardTitle>
                    <CardDescription>
                      Bài văn cúng khấn thành tâm khi thực hiện nghi lễ
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Tabs */}
                {prayers.length > 1 && (
                  <div className="flex border-b border-foreground/5 bg-muted/20 overflow-x-auto">
                    {prayers.map((prayer) => {
                      const isActive = prayer.id === currentActivePrayerId;
                      return (
                        <button
                          key={prayer.id}
                          onClick={() => setActivePrayerId(prayer.id)}
                          className={`flex-1 py-3 px-4 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200 focus:outline-none ${
                            isActive
                              ? "border-amber-600 text-amber-800 bg-amber-50/30"
                              : "border-transparent text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {prayer.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                {activePrayer && (
                  <div className="p-6 space-y-6">
                    {/* Notes/Intro */}
                    {(activePrayer.description || activePrayer.note) && (
                      <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/50 text-amber-850 text-xs sm:text-sm space-y-1">
                        {activePrayer.description && (
                          <p><strong>Ý nghĩa:</strong> {activePrayer.description}</p>
                        )}
                        {activePrayer.note && (
                          <p><strong>Chú ý:</strong> <span className="italic">{activePrayer.note}</span></p>
                        )}
                      </div>
                    )}

                    {/* Prayer Content Scroll */}
                    <div className="relative rounded-xl border border-amber-200/40 bg-amber-50/15 p-6 shadow-inner">
                      <div className="absolute top-4 right-4 z-10">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyPrayer(activePrayer.content, activePrayer.id)}
                          className="flex items-center gap-1.5 bg-white shadow-sm border-amber-200 text-amber-800 hover:bg-amber-50"
                        >
                          {copiedId === activePrayer.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Đã sao chép
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Sao chép
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Ancient parchment texture mimic */}
                      <div className="prose max-w-none prose-amber">
                        <p className="text-center font-serif text-amber-900/40 text-xs uppercase tracking-widest mb-4">
                          Khởi niệm Chí tâm thành kính
                        </p>
                        <div className="whitespace-pre-line font-serif text-base sm:text-lg leading-relaxed text-amber-950 font-medium select-text">
                          {activePrayer.content}
                        </div>
                        <p className="text-center font-serif text-amber-900/40 text-xs uppercase tracking-widest mt-6">
                          Phục duy cẩn cáo
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Side: Media and Offerings */}
        <div className="space-y-8">
          
          {/* Gallery / Media Card */}
          <Card className="border border-foreground/5 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 border-b border-foreground/5 py-4">
              <CardTitle className="text-base font-bold font-serif text-amber-900">
                Hình Ảnh Minh Họa
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {ritual.ritualMedias && ritual.ritualMedias.length > 0 ? (
                <div className="relative group">
                  <img
                    src={ritual.ritualMedias[0].url}
                    alt={ritual.ritualMedias[0].alt || ritual.name}
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.src = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000";
                    }}
                  />
                  {ritual.ritualMedias.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                      +{ritual.ritualMedias.length - 1} ảnh khác
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 h-48 flex flex-col items-center justify-center p-6 text-center border-b">
                  <Bookmark className="w-12 h-12 text-amber-600/30 mb-2" />
                  <p className="text-xs text-amber-800 font-medium">Bảo trì không gian thanh tịnh</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Hình ảnh đang được chọn lọc chuẩn chỉ</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Offerings (Mâm Lễ Vật) */}
          <Card className="border border-foreground/5 shadow-md">
            <CardHeader className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 border-b border-foreground/5 py-4">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-amber-100 text-amber-800">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <CardTitle className="text-base font-bold font-serif text-amber-900">
                  Sắm Sanh Lễ Vật
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {ritual.ritualOfferings && ritual.ritualOfferings.length > 0 ? (
                <div className="space-y-3">
                  {ritual.ritualOfferings.map((offering) => {
                    const isChecked = checkedOfferings[offering.id];
                    return (
                      <div
                        key={offering.id}
                        onClick={() => toggleOffering(offering.id)}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all duration-200 ${
                          isChecked
                            ? "bg-emerald-50/20 border-emerald-100/60 text-muted-foreground"
                            : "bg-white border-foreground/5 shadow-sm hover:bg-amber-50/20"
                        }`}
                      >
                        <button className="mt-0.5 text-amber-700 focus:outline-none flex-shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Square className="w-4 h-4 text-amber-600/50" />
                          )}
                        </button>
                        <div>
                          <p className={`text-sm font-semibold ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {offering.name}
                          </p>
                          {offering.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {offering.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Heart className="w-8 h-8 text-amber-600/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground italic">
                    Tùy duyên sắm lễ (hoa quả, nước sạch, hương hoa, tấm lòng thành)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default RitualDetail;

