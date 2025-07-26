import { getDBRaffles } from "@/actions/databaseActions";
import RaffleCard from "@/components/RaffleCard";
import RaffleCardSkeleton from "@/components/skeletons/RaffleCardSkeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'GenRaffle*',
  description: 'GenRaffle* is a platform for creating and participating in raffles',
}

export default async function Home() {
  const raffles = await getDBRaffles();
    return (
        <div className="min-h-screen py-8">
            <div className="max-w-2xl mx-auto px-6">

                <div className="flex justify-end mb-4">
                    <Link
                        href="/add"
                    >
                        <Button size="sm">Create Raffle</Button>
                    </Link>
                </div>

                <div className="space-y-8">
                    {raffles.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🎰</div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                No raffles available
                            </h2>
                            <p className="text-gray-600">
                                Check back later for new raffle opportunities!
                            </p>
                        </div>
                    ) : (
                        raffles.map((raffle, index) => (
                            <Suspense fallback={<RaffleCardSkeleton />} key={index}>
                                <RaffleCard
                                    dbRaffle={raffle}
                                    raffleAddress={raffle.contract_address}
                                />
                            </Suspense>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
