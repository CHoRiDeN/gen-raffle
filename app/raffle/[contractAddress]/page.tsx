import { getRafffleState } from "@/actions/genLayerActions";
import { Raffle } from "@/types";
import { convertMapToRaffle } from "@/utils";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Raffle Contract
            </h1>
            <p className="text-gray-600">
              Viewing details for the following contract address:
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Contract Address
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Active
              </span>
            </div>
            
            <div className="bg-white rounded-md p-4 border border-gray-200">
              <code className="text-sm font-mono text-gray-900 break-all">
                {contractAddress}
              </code>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Contract address extracted from URL parameters</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              This is a server component that dynamically extracts the contract address from the URL path.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
