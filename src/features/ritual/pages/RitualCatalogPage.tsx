import React, { useEffect, useState } from "react";
import { LoadingState, ErrorState, EmptyState } from "@/shared/components/states/StatusState";
import RitualCard from "../components/RitualCard";
import { useRitualList } from "@/features/admin/hooks/useRitualList";
import Pagination from "@/shared/common/Pagination";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { useDebounce } from "@/shared/hooks/useDebounce";

const RitualCatalogPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch] = useDebounce(search, 500);
    const [isHot, setIsHot] = useState<boolean | undefined>(undefined);
    const { rituals, isLoading, pagination, error, refetch } = useRitualList({ page: currentPage, search: debouncedSearch, isHot });

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleIsHot = (value: string) => {
        if (value === "all") {
            setIsHot(undefined);
        } else {
            setIsHot(value === "hot");
        }
    }

    return (
        <>
            <Input
                placeholder="Search ritual..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                }
                }
            />
            <Select
                value={
                    isHot === undefined ? "all" : isHot ? "hot" : "normal"
                }
                onValueChange={handleIsHot}
            >
                <SelectTrigger>
                    <SelectValue>
                    </SelectValue>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="hot">Hot</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                </SelectTrigger>
            </Select>
            <div className="grid grid-cols-1 gap-4">
                {rituals.map((ritual) => (
                    <RitualCard key={ritual.id} rituals={ritual} />
                ))}
            </div>
            {
                pagination && (
                    <Pagination
                        meta={pagination}
                        onPageChange={handlePageChange}
                    />
                )
            }
        </>
    );
};

export default RitualCatalogPage;