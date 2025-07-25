import { getRafffleState } from "@/actions/genLayerActions";
import { Raffle } from "@/types";
import { convertMapToRaffle } from "@/utils";
import RaffleDetailsPage from "@/pages/RaffleDetailsPage";




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
