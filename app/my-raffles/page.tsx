import { auth } from '@clerk/nextjs/server'
import { getDBRafflesByClerkId } from '@/actions/databaseActions'
import RaffleCard from '@/components/RaffleCard'
import { DatabaseRaffleWithCreator } from '@/actions/databaseActions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function MyRafflesPage() {
    const { userId } = await auth()

    if (!userId) {
        redirect('/')
    }

    let raffles: DatabaseRaffleWithCreator[] = []
    let error: string | null = null

    try {
        raffles = await getDBRafflesByClerkId(userId)
    } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to fetch your raffles'
        console.error('Error fetching user raffles:', err)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">


                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {raffles.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                <Plus className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No raffles yet</h3>
                                                         <p className="text-gray-600 mb-6">
                                 You haven&apos;t created any raffles yet. Start by creating your first raffle!
                             </p>
                            <Link href="/add">
                                <Button className="flex items-center gap-2 mx-auto">
                                    <Plus className="h-4 w-4" />
                                    Create Your First Raffle
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">My Raffles</h1>
                            <Link href="/add">
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create New Raffle
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {raffles.map((raffle) => (
                                <RaffleCard
                                    key={raffle.contract_address}
                                    raffleAddress={raffle.contract_address}
                                    dbRaffle={raffle}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
