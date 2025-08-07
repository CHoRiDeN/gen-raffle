'use client'

import { getTransaction, resolveRaffle } from "@/actions/genLayerActions";
import { Button } from "./ui/button"
import { useUserContext } from "@/contexts/DbUserContext";
import { useEffect, useState } from "react";
import { Hash, TransactionStatus } from "genlayer-js/types";

export default function ResolveRaffleComponent({ contractAddress }: { contractAddress: string }) {
    const { dbUser } = useUserContext();
    const [isResolving, setIsResolving] = useState(false);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<string>("");

    const handleResolve = async () => {
        if (!dbUser) {
            throw new Error("User not found");
        }
        const hash = await resolveRaffle(contractAddress, dbUser);
        setTransactionHash(hash);
        setIsResolving(true);
    };

    // Poll transaction status every 2 seconds
    useEffect(() => {
        if (!transactionHash) return;

        let pollCount = 0;
        const maxPolls = 150; // Maximum 5 minutes of polling (150 * 2 seconds)

        const pollTransaction = async () => {
            try {
                pollCount++;

                // Stop polling after maximum attempts
                if (pollCount > maxPolls) {
                    console.warn("Max polling attempts reached");
                    return;
                }

                const transaction = await getTransaction(transactionHash as Hash, dbUser!);
                const statusName = transaction?.statusName || "";
                setTransactionStatus(statusName);

                if (statusName === TransactionStatus.ACCEPTED) {
                    // Reload the page when transaction is accepted
                    window.location.reload();
                }
            } catch (error) {
                console.error("Error polling transaction:", error);
            }
        };

        // Poll immediately
        pollTransaction();

        // Set up interval for polling every 2 seconds
        const interval = setInterval(pollTransaction, 2000);

        // Cleanup interval on unmount or when transactionHash changes
        return () => clearInterval(interval);
    }, [transactionHash, dbUser]);

    return (

        <div className="mb-2 mt-5">
            <Button size="lg" className="w-full" onClick={handleResolve}>Resolve Raffle</Button>
            {isResolving && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    {transactionStatus && transactionStatus !== "ACCEPTED" && (
                        <p className="text-green-600 text-sm mt-1 flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Transaction status: <span className="font-medium">{transactionStatus}</span>
                        </p>
                    )}
                    {transactionStatus === "ACCEPTED" && (
                        <p className="text-green-600 text-sm mt-1">
                            ✅ Transaction accepted! Reloading page...
                        </p>
                    )}
                </div>
            )}
        </div>


    )
}