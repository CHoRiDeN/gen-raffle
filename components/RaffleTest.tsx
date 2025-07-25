'use client'

import { useState } from 'react'
import { createRaffle, testEthereumAddressStorage, checkContractAddressExists, getRaffleByContractAddressSafe, DatabaseRaffleWithCreator } from '@/actions/databaseActions'

// Type definitions for the different result types
interface TestAddressResult {
  success: boolean
  message?: string
  error?: string
  address: string
  length: number
}

interface CheckExistsResult {
  success: boolean
  message: string
  exists: boolean
  error?: string
}

interface GetRaffleResult {
  success: boolean
  raffle?: DatabaseRaffleWithCreator
  error?: string
}

interface CreateRaffleResult {
  success: boolean
  raffle?: DatabaseRaffleWithCreator
  error?: string
}

// Union type for all possible results
type TestResult = TestAddressResult | CheckExistsResult | GetRaffleResult | CreateRaffleResult | null

export default function RaffleTest() {
  const [contractAddress, setContractAddress] = useState('0x04d26c6d9BfA194063Af60D36FBF4FF81E44893F')
  const [creatorId, setCreatorId] = useState('1')
  const [result, setResult] = useState<TestResult>(null)
  const [loading, setLoading] = useState(false)

  const handleTestAddress = async () => {
    setLoading(true)
    try {
      const testResult = await testEthereumAddressStorage(contractAddress)
      setResult(testResult)
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRaffle = async () => {
    setLoading(true)
    try {
      const raffle = await createRaffle(parseInt(creatorId), contractAddress)
      setResult({ success: true, raffle })
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckExists = async () => {
    setLoading(true)
    try {
      const exists = await checkContractAddressExists(contractAddress)
      setResult({ 
        success: true, 
        message: exists ? 'Contract address already exists' : 'Contract address is available',
        exists 
      })
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const handleGetRaffle = async () => {
    setLoading(true)
    try {
      const result = await getRaffleByContractAddressSafe(contractAddress)
      setResult(result)
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Raffle Creation Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contract Address
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Creator ID
          </label>
          <input
            type="number"
            value={creatorId}
            onChange={(e) => setCreatorId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="1"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleTestAddress}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 text-sm"
          >
            Test Address
          </button>
          
          <button
            onClick={handleCheckExists}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 text-sm"
          >
            Check Exists
          </button>
          
          <button
            onClick={handleGetRaffle}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 text-sm"
          >
            Get Raffle
          </button>
          
          <button
            onClick={handleCreateRaffle}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 text-sm"
          >
            Create Raffle
          </button>
        </div>
      </div>

      {result && (
        <div className={`p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
            {result.success ? 'Success!' : 'Error'}
          </h3>
          <div className="mt-2 text-sm">
            <pre className="whitespace-pre-wrap text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
} 