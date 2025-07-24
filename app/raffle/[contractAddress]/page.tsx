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
  const { contractAddress } = params;
  const raffleStateMap = await getRafffleState(contractAddress);
  const raffleState: Raffle = convertMapToRaffle(raffleStateMap);
  console.log("RAFFLE STATE: ", raffleState);


  return <RaffleDetailsPage raffle={raffleState} />
}
