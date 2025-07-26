'use server'

import { prisma } from '../lib/db'

// Validation function for Ethereum addresses
function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Type definitions for better type safety
export interface DatabaseRaffleWithCreator {
  id: number
  creator_id: number
  contract_address: string
  created_at: Date
  image_url: string
  creator: {
    id: number
    name: string
    email: string
    wallet_address: string
  }
}


export async function getDBRaffle(contractAddress: string): Promise<DatabaseRaffleWithCreator | null> {
  const raffle = await prisma.raffle.findUnique({
    where: { contract_address: contractAddress },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          wallet_address: true,
        },
      },
    },
  })
  return raffle
}

/**
 * Get all raffles with their creator information
 */
export async function getDBRaffles(): Promise<DatabaseRaffleWithCreator[]> {
  try {
    const raffles = await prisma.raffle.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            wallet_address: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })
    console.log(`Found ${raffles.length} raffles`);
    return raffles
  } catch (error) {
    console.error('Error fetching raffles:', error)
    throw new Error('Failed to fetch raffles')
  }
}

/**
 * Get a specific raffle by contract address
 */
export async function getRaffleByContractAddress(contractAddress: string): Promise<DatabaseRaffleWithCreator | null> {
  try {
    const raffle = await prisma.raffle.findUnique({
      where: {
        contract_address: contractAddress,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            wallet_address: true,
          },
        },
      },
    })

    return raffle
  } catch (error) {
    console.error('Error fetching raffle:', error)
    throw new Error('Failed to fetch raffle')
  }
}

/**
 * Create a new raffle
 */
export async function createRaffle(creatorId: number, contractAddress: string): Promise<DatabaseRaffleWithCreator> {
  try {
    // Validate required fields
    if (!contractAddress || contractAddress.trim() === '') {
      throw new Error('Contract address is required')
    }

    // Validate Ethereum address format
    if (!isValidEthereumAddress(contractAddress)) {
      throw new Error('Invalid Ethereum address format. Must be a valid 42-character Ethereum address starting with 0x')
    }

    // Check if contract address already exists
    const existingRaffle = await prisma.raffle.findUnique({
      where: { contract_address: contractAddress }
    })

    if (existingRaffle) {
      throw new Error('A raffle with this contract address already exists')
    }

    // Validate creator exists
    const creator = await prisma.user.findUnique({
      where: { id: creatorId }
    })

    if (!creator) {
      throw new Error('Creator not found')
    }

    const raffle = await prisma.raffle.create({
      data: {
        creator_id: creatorId,
        contract_address: contractAddress,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            wallet_address: true,
          },
        },
      },
    })

    return raffle
  } catch (error) {
    console.error('Error creating raffle:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('Failed to create raffle')
  }
}

/**
 * Get user by clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerk_id: clerkId,
      },
    })

    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('Failed to fetch user')
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: {
  name: string
  clerk_id: string
  email: string
  wallet_address: string
  encrypted_private_key: string
  iv: string
}) {
  try {
    // Validate Ethereum address format
    if (!isValidEthereumAddress(userData.wallet_address)) {
      throw new Error('Invalid Ethereum address format')
    }

    const user = await prisma.user.create({
      data: userData,
    })

    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}

/**
 * Test function to verify Ethereum address storage
 */
export async function testEthereumAddressStorage(contractAddress: string) {
  try {
    // Validate the address format
    if (!isValidEthereumAddress(contractAddress)) {
      return {
        success: false,
        error: 'Invalid Ethereum address format',
        address: contractAddress,
        length: contractAddress.length
      }
    }

    // Try to create a test raffle (you'll need to provide a valid creator_id)
    // This is just for testing the address format
    return {
      success: true,
      message: 'Ethereum address format is valid',
      address: contractAddress,
      length: contractAddress.length
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      address: contractAddress,
      length: contractAddress.length
    }
  }
}

/**
 * Check if a contract address already exists
 */
export async function checkContractAddressExists(contractAddress: string): Promise<boolean> {
  try {
    const existingRaffle = await prisma.raffle.findUnique({
      where: { contract_address: contractAddress }
    })
    return !!existingRaffle
  } catch (error) {
    console.error('Error checking contract address:', error)
    return false
  }
}

/**
 * Get raffle by contract address with detailed error handling
 */
export async function getRaffleByContractAddressSafe(contractAddress: string) {
  try {
    if (!contractAddress || contractAddress.trim() === '') {
      return {
        success: false,
        error: 'Contract address is required'
      }
    }

    if (!isValidEthereumAddress(contractAddress)) {
      return {
        success: false,
        error: 'Invalid Ethereum address format'
      }
    }

    const raffle = await prisma.raffle.findUnique({
      where: { contract_address: contractAddress },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            wallet_address: true,
          },
        },
      },
    })

    if (!raffle) {
      return {
        success: false,
        error: 'Raffle not found'
      }
    }

    return {
      success: true,
      raffle
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 