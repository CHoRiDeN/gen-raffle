import { getDBRaffles } from "@/actions/databaseActions";
import RaffleCard from "@/components/RaffleCard";
import RaffleCardSkeleton from "@/components/skeletons/RaffleCardSkeleton";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
            <div className="max-w-5xl mx-auto px-6 flex flex-col gap-8">
                <div className="flex flex-col text-center mb-4 gap-4 max-w-2xl mx-auto py-10">

                    <h1 className="text-4xl font-semibold text-gray-900">
                        <BlurFade delay={0.20} inView>AI-Powered Subjective Raffles on </BlurFade>
                        <BlurFade delay={0.40} inView> the Blockchain</BlurFade>
                    </h1>
                    <p className="text-gray-800 text-lg">
                        <BlurFade delay={0.50} inView>
                            Create and participate in raffles where AI consensus determines winners 
                            based on subjective criteria.  Trustless, transparent, and fair judgment at machine speed.
                        </BlurFade>
                       
                    </p>
                    <BlurFade delay={0.70} inView>
                        <Link
                            href="/add"
                        >
                            <Button size="lg"><Plus className="w-4 h-4" /> Create new raffle</Button>
                        </Link>
                    </BlurFade>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {raffles.map((raffle, index) => (
                        <Suspense fallback={<RaffleCardSkeleton />} key={index}>
                            <RaffleCard
                                dbRaffle={raffle}
                                raffleAddress={raffle.contract_address}
                            />
                        </Suspense>
                    ))}
                
                </div>
            </div>
        </div>
    )
}
