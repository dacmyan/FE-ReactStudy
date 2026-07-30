import { Card, CardContent } from '@/shared/components/ui/card'
import type { Ritual } from '../type';

const RitualCard = (rituals: { rituals: Ritual }) => {

    return (
        <div>
            <Card
                key={rituals.rituals.id}
                className="border border-amber-900/10 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
            >
                <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <div className="text-base font-bold text-amber-900 truncate">
                            {rituals.rituals.name}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {rituals.rituals.description || "Nghi lễ không có mô tả."}
                        </div>
                        <div className="flex gap-2 mt-2.5">
                            {rituals.rituals.isHot && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                                    Nổi bật
                                </span>
                            )}
                            {rituals.rituals.difficultyLevel && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-150 text-gray-800 border">
                                    {rituals.rituals.difficultyLevel}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RitualCard
