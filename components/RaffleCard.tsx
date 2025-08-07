
import Link from "next/link";
import Image from "next/image";
import { getRafffleState } from "@/actions/genLayerActions";
import { Raffle } from "@/types";
import { convertMapToRaffle, limitText } from "@/utils";
import { DatabaseRaffleWithCreator } from "@/actions/databaseActions";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import Avvvatars from "avvvatars-react";
import { Button } from "./ui/button";

interface RaffleCardProps {
    raffleAddress: string;
    dbRaffle: DatabaseRaffleWithCreator;
}

export default async function RaffleCard({ raffleAddress, dbRaffle }: RaffleCardProps) {

    const raffleStateMap = await getRafffleState(raffleAddress);
    const raffleState: Raffle = convertMapToRaffle(raffleStateMap);
    const participantCount = raffleState.answers ? raffleState.answers.size : 0;

    return (

        <Card>
            <CardContent>
                <div className="flex flex-col gap-4 relative py-2">

                    <Image src={dbRaffle.image_url} alt={raffleState.title} width={120} height={120} className="w-full h-auto rounded-[8px] object-cover aspect-video" />
                    <Badge variant={raffleState.raffle_status === 'OPEN' ? 'success' : 'destructive'} className="">
                        {raffleState.raffle_status}
                    </Badge>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-base leading-tight font-medium">{raffleState.title}</h2>
                        <p className="text-xs text-gray-800 leading-5">{limitText(raffleState.description, 100)}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <Avvvatars value={dbRaffle.creator.name} style="shape" size={30} />
                        <div className="text-xs text-gray-800 font-medium leading-5">{dbRaffle.creator.name}</div>
                    </div>
                    <div className="text-xs text-gray-800 font-medium leading-5">{participantCount} Participants</div>
                    <Link href={`/raffles/${raffleAddress}`} key={raffleAddress}>
                        <Button className="w-full" variant={raffleState.raffle_status === 'OPEN' ? 'default' : 'outline'}>
                            {raffleState.raffle_status === 'OPEN' ? 'Enter Raffle' : 'View results'}
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
} 