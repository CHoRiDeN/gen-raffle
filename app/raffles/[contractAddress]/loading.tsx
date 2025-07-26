import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Raffle Info Card */}
          <div className="lg:col-span-1">
            {/* Image Skeleton */}
            <Skeleton className="w-full h-64 rounded-xl" />

            {/* Organizer Info Skeleton */}
            <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <Skeleton className="h-4 w-24 mb-2" />
              
              <div className="flex items-center mb-4 space-x-2">
                <Skeleton className="h-5 w-32" />
              </div>

              <Skeleton className="h-4 w-28 mb-3" />

              <div className="flex items-center mb-4">
                <div className="flex -space-x-2 mr-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="w-6 h-6 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="mt-4 flex items-center">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          {/* Right Panel - Raffle Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              {/* Title and Status */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Skeleton className="w-3 h-3 rounded mr-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center">
                      <Skeleton className="w-4 h-4 mr-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Resolve Button Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>

              {/* About the Raffle */}
              <div className="mb-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>

              {/* Participation Section */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </div>
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>

              {/* All Submissions Section */}
              <div className="mt-8">
                <div className="flex items-center mb-6">
                  <Skeleton className="w-6 h-6 mr-3" />
                  <Skeleton className="h-6 w-48" />
                </div>

                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg p-4 border bg-gray-50 border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-6 h-6 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <div className="ml-11 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
