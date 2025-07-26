'use client'

import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs"
import { WalletIcon } from "lucide-react"
import Link from "next/link"
import { useUserContext } from "@/contexts/DbUserContext"

export default function NavBar() {
    const { dbUser, loading } = useUserContext()


    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <div className="text-purple-600 font-semibold text-xl">RaffleStory*</div>
                    <nav className="flex items-center space-x-6 text-gray-600">
                        <Link href="/">
                            <span className="text-sm">Raffles</span>
                        </Link>
                        <Link href="/leaderboard">
                            <span className="text-sm">Leaderboard</span>
                        </Link>
                        <Link href="/explore">
                            <span className="text-sm">Explore</span>
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                <SignedOut>
                        <SignInButton />
                        <SignUpButton>
                            <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                        {loading ? (
                            <span className="text-sm text-gray-400">Loading...</span>
                        ) : dbUser?.wallet_address ? (
                            <span className="text-sm text-gray-600 font-mono flex items-center gap-2">
                                <WalletIcon className="w-4 h-4" />
                                {dbUser.wallet_address.slice(0, 6)}...{dbUser.wallet_address.slice(-4)}
                            </span>
                        ) : null}
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>)
}