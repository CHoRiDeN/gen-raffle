'use client'

import { Raffle } from "@/types";
import { convertMapToRaffle } from "@/utils";
import { submitAnswer } from "@/actions/genLayerActions";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Avvvatars from "avvvatars-react";

export default function RaffleDetailsPage({ raffle, contractAddress }: { raffle: Raffle; contractAddress: string }) {
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async () => {
        if (!answer.trim()) return;

        setIsSubmitting(true);
        setSubmitStatus("idle");




        try {
            await submitAnswer(contractAddress, answer.trim());
            setSubmitStatus("success");
            setAnswer("");
            // Optionally refresh the page or update the raffle state
            window.location.reload();
        } catch (error) {
            console.error("Error submitting answer:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };



    const participantCount = raffle.answers ? raffle.answers.size : 0;
    const hasWinner = raffle.winner && raffle.winner !== '';

    // Find the winner's answer
    const winnerAnswer = hasWinner && raffle.answers
        ? Array.from(raffle.answers.values()).find(answer => answer.clerk_id === raffle.winner)
        : null;


    console.log(raffle);
    return (
        <div className="">


            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Raffle Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
                            {/* Top Section */}
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold mb-2">{raffle.title || "Story Contest"}</h1>
                                <p className="text-gray-300 text-sm">AI-Powered Story Generation</p>
                            </div>

                            {/* Bottom Section */}
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">genlayer</div>
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">G</span>
                                </div>
                            </div>
                        </div>

                        {/* Organizer Info */}
                        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-sm mb-2">Organized by</p>
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-white text-sm font-medium">G</span>
                                </div>
                                <span className="font-medium text-gray-900">GenLayer Team</span>
                            </div>

                            <p className="text-gray-500 text-sm mb-3">{participantCount} participants</p>

                            <div className="flex items-center mb-4">
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

                            <div className="space-y-2">
                                <button className="text-sm text-purple-600 hover:text-purple-700 transition-colors">
                                    Contact organizers
                                </button>
                                <button className="text-sm text-gray-500 hover:text-gray-600 transition-colors">
                                    Report raffle
                                </button>
                            </div>

                            <div className="mt-4 flex items-center">
                                <span className="text-gray-400 mr-2">#</span>
                                <span className="text-sm text-gray-600">AI Contest</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Raffle Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            {/* Title and Status */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {raffle.title || "AI Story Generation Contest"}
                                    </h1>
                                    <div className="flex items-center space-x-4 text-gray-600">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                                            <span className="text-sm">Forever</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm">No restrictions</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${hasWinner ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {hasWinner ? 'Closed' : 'Active'}
                                    </span>
                                </div>
                            </div>





                            {/* About the Raffle */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Contest</h3>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-600 mb-4">
                                        {raffle.description || "This is an AI-powered story generation contest where participants create compelling narratives using advanced language models. The contest challenges participants to push the boundaries of creative writing with artificial intelligence."}
                                    </p>

                                </div>
                            </div>

                            {/* Participation Section */}
                            <SignedIn>
                                {raffle.raffle_status === 'OPEN' && (
                                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation</h3>
                                        <p className="text-gray-600 mb-4">
                                            Welcome! Join this AI-powered story generation contest and showcase your creativity.
                                        </p>

                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="story-textarea" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Your answer
                                                </label>
                                                <Textarea
                                                    id="story-textarea"
                                                    placeholder="Write your compelling story here... Be creative and showcase your narrative skills!"
                                                    value={answer}
                                                    onChange={(e) => setAnswer(e.target.value)}
                                                    className="min-h-[120px] resize-none"
                                                    disabled={isSubmitting}
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {answer.length} characters
                                                </p>
                                            </div>

                                            <button
                                                onClick={handleSubmit}
                                                disabled={isSubmitting || !answer.trim()}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                                            </button>

                                            {submitStatus === "success" && (
                                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <p className="text-green-700 text-sm">🎉 Story submitted successfully! Your submission is now being processed.</p>
                                                </div>
                                            )}
                                            {submitStatus === "error" && (
                                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-red-700 text-sm">❌ Failed to submit story. Please try again.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </SignedIn>
                            <SignedOut>
                                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation</h3>
                                    <p className="text-gray-600 mb-4">
                                        Please sign in to participate in the raffle.
                                    </p>
                                </div>
                            </SignedOut>

                            {/* Winner Section (if applicable) */}
                            {hasWinner && winnerAnswer && (
                                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                                    <h3 className="text-lg font-semibold text-green-900 mb-2">🏆 Winner Announced</h3>
                                    <p className="text-green-700 mb-3">Congratulations to the winning submission!</p>



                                    {/* Winner's Answer */}
                                    <div className="bg-white rounded-lg p-4 border border-green-200">
                                        <p className="text-gray-700 leading-relaxed">
                                            {winnerAnswer.answer}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <code className="text-sm font-mono text-gray-700">
                                                    {winnerAnswer.address.slice(0, 6)}...{winnerAnswer.address.slice(-4)}
                                                </code>

                                                {/* Copy Button */}
                                                <button
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    onClick={() => navigator.clipboard.writeText(winnerAnswer.address)}
                                                    title="Copy address"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                                    </svg>
                                                </button>


                                            </div>
                                            <span className="text-sm text-gray-500">Score: {parseFloat(winnerAnswer.score) || 0}</span>

                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* All Submissions Section */}
                            {raffle.answers && raffle.answers.size > 0 && (
                                <div className="mt-8">
                                    <div className="flex items-center mb-6">
                                        <svg className="w-6 h-6 text-gray-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                        </svg>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            All Submissions ({raffle.answers.size})
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        {Array.from(raffle.answers.entries())
                                            .map(([key, answer], index) => {
                                                const rank = index + 1;
                                                const isWinner = answer.address === raffle.winner;

                                                return (
                                                    <div
                                                        key={key}
                                                        className={`rounded-lg p-4 border transition-all bg-gray-50 border-gray-200 ${isWinner ? 'ring-2 ring-green-200 bg-green-50' : ''}`}
                                                    >
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center space-x-3">
                                                                {/* Rank Badge */}
                                                                <Avvvatars value={answer.name} style="shape" size={24} />


                                                                {/* Created at */}
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {answer.created_at}
                                                                    </span>




                                                                    {/* Trophy for winner */}
                                                                    {isWinner && (
                                                                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                        </svg>
                                                                    )}
                                                                </div>


                                                                {/* Name */}
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {answer.name}
                                                                    </span>
                                                                </div>
                                                            </div>


                                                        </div>

                                                        {/* Submission Text */}
                                                        <div className="ml-11">
                                                            <p className="text-gray-700 leading-relaxed">
                                                                {answer.answer}
                                                            </p>
                                                        </div>

                                                        {/* Winner Badge */}
                                                        {isWinner && (
                                                            <div className="ml-11 mt-3">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    🏆 Winner
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}

                            {/* No Submissions Message */}
                            {(!raffle.answers || raffle.answers.size === 0) && (
                                <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Submissions Yet</h3>
                                    <p className="text-gray-500">Be the first to submit your story and compete for the prize!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}