import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states/StatusState";
import { useRitualList } from "@/features/admin/hooks/useRitualList";

const ManageRitualList: React.FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { rituals, isLoading, error, refetch } = useRitualList();

    const isAdmin = pathname.startsWith("/admin");

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <ErrorState
                message={error instanceof Error ? error.message : "Lỗi tải danh sách nghi lễ"}
                onRetry={refetch}
            />
        );
    }

    if (rituals.length === 0) {
        return <EmptyState message="Không tìm thấy nghi lễ nào" />;
    }

    return (
        <div className="space-y-6 text-black max-w-4xl mx-auto p-4 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/10">
                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-amber-900">
                    {isAdmin ? "Quản Lý Nghi Lễ" : "Danh Sách Nghi Lễ"}
                </h1>
                {isAdmin && (
                    <button
                        onClick={() => navigate("/admin/rituals/create")}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
                    >
                        Tạo Nghi Lễ Mới
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {rituals.map((ritual) => (
                    <Card
                        key={ritual.id}
                        className="border border-amber-900/10 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
                        onClick={() =>
                            navigate(isAdmin ? `/admin/rituals/${ritual.id}/edit` : `/ritual/${ritual.id}`)
                        }
                    >
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="text-base font-bold text-amber-900 truncate">
                                    {ritual.name}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {ritual.description || "Nghi lễ không có mô tả."}
                                </div>
                                <div className="flex gap-2 mt-2.5">
                                    {ritual.isHot && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                                            Nổi bật
                                        </span>
                                    )}
                                    {ritual.difficultyLevel && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-150 text-gray-800 border">
                                            {ritual.difficultyLevel}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ManageRitualList;