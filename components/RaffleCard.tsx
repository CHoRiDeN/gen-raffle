
import Link from "next/link";
import Image from "next/image";
import { getRafffleState } from "@/actions/genLayerActions";
import { Raffle } from "@/types";
import { convertMapToRaffle } from "@/utils";
import { DatabaseRaffleWithCreator } from "@/actions/databaseActions";
import { Badge } from "./ui/badge";

interface RaffleCardProps {
    raffleAddress: string;
    dbRaffle: DatabaseRaffleWithCreator;
}

export default async function RaffleCard({ raffleAddress, dbRaffle }: RaffleCardProps) {
    const raffleStateMap = await getRafffleState(raffleAddress);
    const raffleState: Raffle = convertMapToRaffle(raffleStateMap);
    const participantCount = raffleState.answers ? raffleState.answers.size : 0;

    return (
        <Link href={`/raffles/${raffleAddress}`} key={raffleAddress}>
            <div className="bg-white rounded-lg flex flex-row justify-between items-start px-5 py-4 hover:cursor-pointer mb-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-medium">{raffleState.title}</h2>
                    <div className="flex flex-col gap-0">
                        <div className="text-base text-gray-500 flex flex-col gap-0">
                            <p className="text-gray-500 text-sm mb-3">{participantCount} participants</p>

                            <div className="flex flex items-center mb-4">
                                <div className="flex -space-x-2 mr-3">
                                    {Array.from({ length: Math.min(5, participantCount) }, (_, i) => (
                                        <div key={i} className={`w-6 h-6 rounded-full border-2 border-white ${['bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400'][i % 5]
                                            }`}></div>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {participantCount > 5 ? `and ${participantCount - 5} more` : ''}
                                </span>
                            </div>

                            <div className="flex items-center mt-2">

                                <Badge
                                    variant={raffleState.raffle_status === 'OPEN' ? 'success' : 'destructive'}
                                >
                                    {raffleState.raffle_status}
                                </Badge>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="w-[120px] aspect-square bg-gray-200 rounded-md overflow-hidden">
                    <Image src={dbRaffle.image_url} alt={raffleState.title} width={120} height={120} className="object-cover" />
                </div>
            </div>
        </Link>
    );
} 