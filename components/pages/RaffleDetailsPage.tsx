'use client'

import { Raffle } from "@/types";
import Avvvatars from "avvvatars-react";
import { useUserContext } from "@/contexts/DbUserContext";
import { DatabaseRaffleWithCreator } from "@/actions/databaseActions";
import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Facebook, Instagram, Quote, Twitter } from "lucide-react";
import RaffleSubmission from "../RaffleSubmission";
import SubmitRaffleAnswerComponent from "../SubmitRaffleAnswerComponent";
import ResolveRaffleComponent from "../ResolveRaffleComponent";
import { formatDate } from "@/utils";
import RaffleWinnerSection from "../RaffleWinnerSection";

export default function RaffleDetailsPage({ raffle, contractAddress, dbRaffle }: { raffle: Raffle; contractAddress: string, dbRaffle: DatabaseRaffleWithCreator }) {

    const { dbUser } = useUserContext();
    const isOwner = dbUser?.id === dbRaffle.creator.id;



    const participantCount = raffle.answers ? raffle.answers.size : 0;
    const hasWinner = raffle.winner && raffle.winner !== '';

    // Find the winner's answer
    const winnerAnswer = hasWinner && raffle.answers
        ? Array.from(raffle.answers.values()).find(answer => answer.clerk_id === raffle.winner)
        : null;


    console.log(winnerAnswer);

    return (
        <div className="">

            {/* Main Content */}
            <div className="max-w-[942px] mx-auto px-6 py-8">
                <div className="grid grid-cols-[2fr_1fr] gap-8 w-full">
                    {/* Left Panel - Raffle Details */}
                    <div className="flex flex-col gap-8 pb-12">
                        <Card>
                            <CardContent>
                                <div className="flex flex-col gap-4 pt-2">
                                    <Image src={dbRaffle.image_url} alt={raffle.title} width={100} height={100} className="rounded-lg w-full h-auto aspect-video" />
                                    <h1 className="text-[27px] font-semibold">{raffle.title}</h1>
                                    <div className="space-y-1">
                                        <div className="raffle-label">Description</div>
                                        <div className="raffle-desc">{raffle.description}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="raffle-label">Organized by</div>
                                        <div className="raffle-desc flex flex-row gap-2 items-center">
                                            <Avvvatars value={dbRaffle.creator.name} style="shape" size={24} />
                                            <div className="text-sm text-slate-600">{dbRaffle.creator.name}</div>
                                        </div>
                                    </div>
                                </div>
                                {(isOwner && raffle.raffle_status === 'OPEN') && (
                                    <ResolveRaffleComponent contractAddress={contractAddress} />

                                )}
                            </CardContent>
                        </Card>
                        {/* Submit Answer */}
                        {raffle.raffle_status === 'OPEN' && !winnerAnswer && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Submit your answer</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <SubmitRaffleAnswerComponent contractAddress={contractAddress} />
                                </CardContent>
                            </Card>
                        )}
                        {/* Winner announcement */}
                        {winnerAnswer && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Winner</CardTitle>
                                </CardHeader>
                                <CardContent>
                                   <RaffleWinnerSection winnerAnswer={winnerAnswer} />
                                </CardContent>
                            </Card>
                        )}

                        {/* Submissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Submissions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {raffle.answers.size === 0 ? (
                                    <div className="flex flex-col gap-2 text-sm text-slate-600 items-center  py-4">
                                        <Image src="/images/no-submissions-placeholder.png" alt="No submissions" width={300} height={300} className="" />
                                        <div className="text-sm font-medium text-slate-600">No submissions yet</div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-5 divide-y divide-gray-200">
                                        {Array.from(raffle.answers.values()).map((answer, key) => (
                                            <RaffleSubmission key={key} answer={answer} isWinner={answer.clerk_id === raffle.winner} />
                                        ))}
                                    </div>
                                )}

                            </CardContent>
                        </Card>


                    </div>

                    {/* Right Panel - Raffle Info */}
                    <div className="">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raffle Info</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-5 text-sm text-slate-600">
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="font-medium">Created at</div>
                                        <div>{formatDate(dbRaffle.created_at.toISOString())}</div>
                                    </div>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="font-medium">Network</div>
                                        <div>Genlayer</div>
                                    </div>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="font-medium">Status</div>
                                        <div>
                                            {raffle.raffle_status === 'OPEN' ? (
                                                <Badge variant="success">Open</Badge>
                                            ) : (
                                                <Badge variant="destructive">Closed</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-between">
                                        <div className="font-medium">Address</div>
                                        <div>{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div>{participantCount} participants</div>
                                        <div className="flex -space-x-2 mr-3">
                                            {Array.from(raffle.answers.values()).map((answer, key) => (
                                                <Avvvatars key={key} value={answer.name} style="shape" size={24} />
                                            ))}
                                        </div>
                                    </div>

                                </div>
                                <div className="flex flex-col gap-2 text-sm text-slate-600 mt-5 font-medium">
                                    <div>Share this raffle</div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Button variant="secondary">
                                            <Instagram />
                                        </Button>
                                        <Button variant="secondary">
                                            <Facebook />
                                        </Button>
                                        <Button variant="secondary">
                                            <Twitter />
                                        </Button>

                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}