import { getRafffleState } from "@/actions/genLayerActions";
import { Raffle } from "@/types";
import { convertMapToRaffle } from "@/utils";
import RaffleDetailsPage from "@/pages/RaffleDetailsPage";


import type { Metadata } from "next";


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
  params: {
    contractAddress: string;
  };
}

export default async function RafflePage({ params }: RafflePageProps) {
  const { contractAddress } = await params;
  const raffleStateMap = await getRafffleState(contractAddress);
  const raffleState: Raffle = convertMapToRaffle(raffleStateMap);


  return <RaffleDetailsPage raffle={raffleState} contractAddress={contractAddress} />
}
