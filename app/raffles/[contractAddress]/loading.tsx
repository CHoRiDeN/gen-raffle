import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="">
      {/* Main Content */}
      <div className="max-w-[942px] mx-auto px-6 py-8">
        <div className="grid grid-cols-[2fr_1fr] gap-8 w-full">
          {/* Left Panel - Raffle Details */}
          <div className="flex flex-col gap-8 pb-12">
            {/* Main Raffle Card */}
            <div className="border rounded-lg p-6 bg-white/40">
              <div className="flex flex-col gap-4 pt-2">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex flex-row gap-2 items-center">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Answer Card */}
            <div className="border rounded-lg p-6 bg-white/40">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            {/* Submissions Card */}
            <div className="border rounded-lg p-6 bg-white/40">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="flex flex-col gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Raffle Info */}
          <div className="">
            <div className="border rounded-lg p-6 bg-white/40">
              <Skeleton className="h-6 w-20 mb-4" />
              <div className="flex flex-col gap-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex flex-row items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-6 w-6 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-5">
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
