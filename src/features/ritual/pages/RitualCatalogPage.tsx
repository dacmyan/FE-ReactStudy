import React, { useEffect, useState } from "react";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states/StatusState";
import RitualCard from "../components/RitualCard";
import { useRitualList } from "@/features/admin/hooks/useRitualList";
import Pagination from "@/shared/common/Pagination";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

const RitualCatalogPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(
        searchParams.get("search") || "",
    );
    const debouncedSearch = useDebounce(search, 500);

    const currentPage = Number(searchParams.get("page")) || 1;
    const isHotParam = searchParams.get("isHot");
    const isHot = isHotParam === "hot" || isHotParam === "true" ? true : isHotParam === "normal" || isHotParam === "false" ? false : undefined;

    const { rituals, isLoading, pagination, error, refetch } = useRitualList({
        page: currentPage,
        limit: Number(searchParams.get("limit")) || 10,
        search: searchParams.get("search") || undefined,
        difficultLevel: searchParams.get("difficultLevel") || undefined,
        ritualCategoryId: searchParams.get("ritualCategoryId") || undefined,
        isHot,
    });

    useEffect(() => {
        if (debouncedSearch !== (searchParams.get("search") || "")) {
            const params = new URLSearchParams(searchParams);
            if (debouncedSearch) {
                params.set("search", debouncedSearch);
            } else {
                params.delete("search");
            }
            params.set("page", "1");
            setSearchParams(params);
        }
    }, [debouncedSearch, searchParams, setSearchParams]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(page));
        setSearchParams(params);
    };

    const handleFilterChange = (key: string, value: string | undefined) => {
        const params = new URLSearchParams(searchParams);
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        setSearchParams(params);
    };

    useEffect(() => {
        if (debouncedSearch !== searchParams.get("search")) {
            const params = new URLSearchParams(searchParams);
            if (debouncedSearch) {
                params.set("search", debouncedSearch);
            } else {
                params.delete("search");
            }
            params.set("page", "1");
            setSearchParams(params);
        }
    }, [debouncedSearch]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    placeholder="Search ritual..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1"
                />
                <Select
                    value={searchParams.get("isHot") || "all"}
                    onValueChange={(val) => handleFilterChange("isHot", val)}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Hot</SelectItem>
                        <SelectItem value="false">Normal</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <LoadingState />
            ) : error ? (
                <ErrorState
                    message={error instanceof Error ? error.message : "Lỗi tải danh sách nghi lễ"}
                    onRetry={refetch}
                />
            ) : rituals.length === 0 ? (
                <EmptyState message="Không tìm thấy nghi lễ nào" />
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        {rituals.map((ritual) => (
                            <RitualCard key={ritual.id} rituals={ritual} />
                        ))}
                    </div>
                    {pagination && (
                        <Pagination
                            meta={pagination}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default RitualCatalogPage;