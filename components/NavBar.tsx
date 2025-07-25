'use client'

export default function NavBar() {
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <div className="text-purple-600 font-semibold text-xl">RaffleStory*</div>
                    <nav className="flex items-center space-x-6 text-gray-600">
                        <span className="text-sm">Raffles</span>
                        <span className="text-sm">Leaderboard</span>
                        <span className="text-sm">Explore</span>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">13:13 CEST</span>
                    <button className="px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors">
                        Connect Wallet
                    </button>
                </div>
            </div>
        </header>)
}