import { getRafffleState } from "@/actions/genLayerActions";
import { Raffle } from "@/types";
import { convertMapToRaffle } from "@/utils";
import RaffleDetailsPage from "@/components/pages/RaffleDetailsPage";


import type { Metadata } from "next";
import { getDBRaffle } from "@/actions/databaseActions";


export async function generateMetadata({ params }: RafflePageProps): Promise<Metadata> {
  const { contractAddress } = await params;
  const raffleStateMap = await getRafffleState(contractAddress);
  const raffleState: Raffle = convertMapToRaffle(raffleStateMap);
  return {
      title: 'GenRaffle - ' + (raffleState ? `${raffleState.title}` : "Raffle details"),
      description: "Raffle Details"
  };
}


interface RafflePageProps {
  params: Promise<{
    contractAddress: string;
  }>;
}

export default async function RafflePage({ params }: RafflePageProps) {
  const { contractAddress } = await params;
  const raffleStateMap = await getRafffleState(contractAddress);
  const raffleState: Raffle = convertMapToRaffle(raffleStateMap);
  const dbRaffle = await getDBRaffle(contractAddress);
  if (!dbRaffle) {
    return <div>Raffle not found</div>
  }


  return <RaffleDetailsPage raffle={raffleState} contractAddress={contractAddress} dbRaffle={dbRaffle} />
}
