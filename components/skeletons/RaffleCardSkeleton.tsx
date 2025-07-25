'use client'

export default function RaffleCardSkeleton() {
    return (
        <div className="bg-white rounded-lg flex flex-row justify-between items-start px-5 py-4 hover:cursor-pointer">
            <div className="flex flex-col gap-2">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    )
}