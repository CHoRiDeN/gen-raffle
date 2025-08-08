'use client'

import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs"
import { Menu, WalletIcon } from "lucide-react"
import Link from "next/link"
import { useUserContext } from "@/contexts/DbUserContext"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { auth } from "@clerk/nextjs/server"

export default function NavBar() {
    const { dbUser, loading } = useUserContext()


    return (
        <header className="px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <div className="text-black font-semibold text-xl">GenRaffle</div>
                    <nav className="flex items-center space-x-6 text-gray-600 hidden md:flex">
                        <Link href="/">
                            <span className="text-sm">Explore</span>
                        </Link>
                        <SignedIn>
                            <Link href="/my-raffles">
                                <span className="text-sm">My raffles</span>
                            </Link>
                        </SignedIn>

                    </nav>
                </div>
                <div className="flex items-center space-x-4 hidden md:flex">
                    <SignedOut>
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

                <div className="block md:hidden">
                    <div className="flex items-center justify-between">

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto">

                                <div className="my-6 flex flex-col gap-6 p-4">
                                    <SignedIn>
                                        <UserButton />
                                    </SignedIn>
                                    <Link href="/">
                                        <span className="text-base">Explore</span>
                                    </Link>
                                    <SignedIn>
                                        <Link href="/my-raffles">
                                            <span className="text-base">My raffles</span>
                                        </Link>
                                    </SignedIn>





                                </div>
                                <SheetFooter>
                                    <SignedOut>
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

                                    </SignedIn>
                                </SheetFooter>
                            </SheetContent>

                        </Sheet>
                    </div>
                </div>
            </div>
        </header>)
}


