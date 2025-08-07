'use client'

import { RaffleAnswer } from "@/types"
import { formatDate } from "@/utils"
import Avvvatars from "avvvatars-react"

export default function RaffleSubmission({ answer, isWinner }: { answer: RaffleAnswer, isWinner: boolean }) {
    return (
        <div className="grid grid-cols-[24px_1fr] gap-3 pb-5">
            <Avvvatars value={answer.name} style="shape" size={24} />
            <div className="flex flex-col gap-1">
                <div className="grid grid-cols-[1fr_75px]">
                    <div className="text-sm font-medium text-gray-700">
                        <div className="flex flex-col gap-2 ">
                            <div className="text-xs text-gray-500">{answer.name}</div>
                            <div className="text-sm text-gray-500">{answer.answer}</div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">{formatDate(answer.created_at)}</div>
                </div>
              
            </div>
        </div>
    )
}