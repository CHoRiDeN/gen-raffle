'use client'

import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useUserContext } from "@/contexts/DbUserContext";
import { getTransaction, submitAnswer } from "@/actions/genLayerActions";
import { Hash, TransactionStatus } from "genlayer-js/types";
import { X } from "lucide-react";
import Image from "next/image";


export default function SubmitRaffleAnswerComponent({ contractAddress }: { contractAddress: string }) {

    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<string>("");
    const { user: clerkUser } = useUser();
    const { dbUser } = useUserContext();

    const handleSubmit = async () => {
        if (!answer.trim()) return;

        setIsSubmitting(true);
        setSubmitStatus("idle");
        setTransactionHash(null);
        setTransactionStatus("");

        try {
            if (!dbUser || !clerkUser) {
                throw new Error("User not found or not logged in");
            }
            const hash = await submitAnswer(contractAddress, answer.trim(), dbUser, clerkUser!.id, clerkUser!.firstName || "Anonymous");
            setTransactionHash(hash);
            setSubmitStatus("success");
            setAnswer("");
        } catch (error) {
            console.error("Error submitting answer:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
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

    if (!dbUser || !clerkUser) {
        return (
            <div className="flex flex-col gap-2 items-center justify-center text-center py-3">
                <p className="text-sm text-gray-500">You must be logged in to submit an answer</p>
                <div className="flex flex-row gap-2 mt-4">
                    <SignInButton >
                        <Button size="sm" variant="outline">
                            Sign In
                        </Button>
                    </SignInButton>
                    <SignUpButton>
                        <Button size="sm">
                            Register
                        </Button>
                    </SignUpButton>
                </div>
            </div>
        )
    }


    return (
        <div>
            {submitStatus === "success" ? (
                <div className="flex flex-col gap-2 items-center justify-center text-center p-3">
                    <Image src="/images/party-popper.png" alt="Success" width={70} height={70} />
                    <p className="text-base font-medium">Answer submitted successfully!</p>
                    <p className="text-sm text-gray-500">Your answer is now being processed.</p>
                    {transactionStatus && (
                        <p className="text-green-600 text-sm mt-1 flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Transaction status: <span className="font-medium">{transactionStatus}</span>
                        </p>
                    )}

                </div>
            ) : (
                <div>
                    <label htmlFor="story-textarea" className="block text-sm font-medium text-gray-700 mb-2">
                        Your answer
                    </label>
                    <Textarea
                        id="story-textarea"
                        placeholder="Write your answer here, be creative and showcase your narrative skills!"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="min-h-[120px] resize-none"
                        disabled={isSubmitting}
                    />
                    <p className="mt-1 text-xs text-gray-500 mb-2">
                        {answer.length} characters
                    </p>
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !answer.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            "Submit answer"
                        )}
                    </Button>
                    {submitStatus === "error" && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                            <p className="text-red-700 text-sm"><X className="w-4 h-4 inline-block mr-1" /> Failed to submit answer. Please try again.</p>
                        </div>
                    )}
                </div>
            )}



        </div>
    )
}