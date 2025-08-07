'use client'

import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function RaffleCardSkeleton() {
    return (
        <Card>
            <CardContent>
                <div className="flex flex-col gap-4 relative py-2">
                    <Skeleton className="w-full h-[120px] rounded-[8px] object-cover aspect-video" />
                    <Skeleton className="w-full h-[20px] rounded-[8px]" />
                    <Skeleton className="w-full h-[20px] rounded-[8px]" />
                    <Skeleton className="w-full h-[20px] rounded-[8px]" />
                    <Skeleton className="w-full h-[20px] rounded-[8px]" />
                </div>
            </CardContent>
        </Card>
    )
}