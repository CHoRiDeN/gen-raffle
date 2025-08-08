'use client'

import { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/DbUserContext";
import { deployRaffleContract, getTransaction } from "@/actions/genLayerActions";
import { createRaffle } from "@/actions/databaseActions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hash, TransactionStatus } from "genlayer-js/types";
import { useRouter } from "next/navigation";
import { handleNewlines } from "@/utils";

export default function CreateContractForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [evaluationCriteria, setEvaluationCriteria] = useState("");
    const [constraints, setConstraints] = useState("");
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployStatus, setDeployStatus] = useState<"idle" | "success" | "error">("idle");
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<string>("");
    const [contractAddress, setContractAddress] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { dbUser } = useUserContext();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim() || !description.trim() || !evaluationCriteria.trim() || !constraints.trim()) {
            setErrorMessage("All fields are required");
            return;
        }

        if (!dbUser) {
            setErrorMessage("User not found. Please try logging in again.");
            return;
        }

        setIsDeploying(true);
        setDeployStatus("idle");
        setTransactionHash(null);
        setTransactionStatus("");
        setErrorMessage("");

        try {
            const result = await deployRaffleContract(
                evaluationCriteria.trim(),
                constraints.trim(),
                title.trim(),
                handleNewlines(description.trim()),
                dbUser
            );

            setTransactionHash(result.transactionHash as string);
            setContractAddress(result.contractAddress as string);
            setDeployStatus("success");

            // Create raffle in database
            if (result.contractAddress && typeof result.contractAddress === 'string') {
                await createRaffle(dbUser.id, result.contractAddress);
            }

        } catch (error) {
            console.error("Error deploying contract:", error);
            setDeployStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Failed to deploy contract");
        } finally {
            setIsDeploying(false);
        }
    };

    // Poll transaction status every 2 seconds
    useEffect(() => {
        if (!transactionHash || !dbUser) return;

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
                    // Redirect to the new raffle page
                    if (contractAddress) {
                        router.push(`/raffles/${contractAddress}`);
                    }
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
    }, [transactionHash, dbUser, contractAddress, router]);

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Raffle</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Contest Title *
                        </Label>
                        <Input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter the contest title..."
                            disabled={isDeploying}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Contest Description *
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] resize-none"
                            placeholder="Describe what participants need to do..."
                            disabled={isDeploying}
                            required
                        />
                    </div>

                    {/* Evaluation Criteria */}
                    <div>
                        <Label htmlFor="evaluationCriteria" className="block text-sm font-medium text-gray-700 mb-2">
                            Evaluation Criteria *
                        </Label>
                        <Textarea
                            id="evaluationCriteria"
                            value={evaluationCriteria}
                            onChange={(e) => setEvaluationCriteria(e.target.value)}
                            className="min-h-[100px] resize-none"
                            placeholder="How will the best answer be chosen? (e.g., 'most creative', 'funniest', 'most original')"
                            disabled={isDeploying}
                            required
                        />
                    </div>

                    {/* Constraints */}
                    <div>
                        <Label htmlFor="constraints" className="block text-sm font-medium text-gray-700 mb-2">
                            Constraints *
                        </Label>
                        <Textarea
                            id="constraints"
                            value={constraints}
                            onChange={(e) => setConstraints(e.target.value)}
                            className="min-h-[100px] resize-none"
                            placeholder="What are the rules and restrictions? (e.g., 'must be under 500 words', 'no profanity', 'must be original work')"
                            disabled={isDeploying}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isDeploying || !title.trim() || !description.trim() || !evaluationCriteria.trim() || !constraints.trim()}
                    >
                        {isDeploying ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deploying Contract...
                            </>
                        ) : (
                            "Create Raffle"
                        )}
                    </Button>

                    {/* Status Messages */}
                    {deployStatus === "success" && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 text-sm font-medium">🎉 Contract deployed successfully!</p>
                            {contractAddress && (
                                <p className="text-green-600 text-sm mt-1">
                                    Contract address: <code className="bg-green-100 px-2 py-1 rounded">{contractAddress}</code>
                                </p>
                            )}
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
                                    ✅ Transaction accepted! Redirecting to raffle page...
                                </p>
                            )}
                        </div>
                    )}

                    {deployStatus === "error" && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">❌ {errorMessage}</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
