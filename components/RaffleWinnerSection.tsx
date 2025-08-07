'use client'

import { RaffleAnswer } from "@/types"
import Image from "next/image"
import Avvvatars from "avvvatars-react"
import { Quote } from "lucide-react"

export default function RaffleWinnerSection({ winnerAnswer }: { winnerAnswer: RaffleAnswer }) {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <Image src="/images/trophy.png" alt="Winner announcement" width={130} height={130} className="" />
            <div className="text-lg font-medium text-slate-800">Winner announced</div>
            <div className="flex flex-row gap-2 items-center mt-3">
                <Avvvatars value={winnerAnswer.name} style="shape" size={24} />
                <div>
                    <div className="text-sm text-slate-900 font-medium">{winnerAnswer.name}</div>
                    <div className="text-xs text-slate-600">{winnerAnswer.address.slice(0, 8)}...{winnerAnswer.address.slice(-4)}</div>
                </div>

            </div>
            <div className="text-sm text-slate-600 bg-yellow-500/5 p-3 rounded-lg px-5">
                <Quote className="w-4 h-4 inline-block mr-1 rotate-180" />
                <div className="text-sm text-center text-slate-900">
                    {winnerAnswer.answer}
                </div>
                <Quote className="w-4 h-4 inline-block mr-1 float-right" />
            </div>
            <div className="text-xs text-slate-600">Score: {winnerAnswer.score}</div>
        </div>
    )
}