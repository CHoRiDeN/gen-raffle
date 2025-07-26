'use server'

import { DatabaseUser } from "@/contexts/DbUserContext";
import { decryptPrivateKey } from "@/lib/utils";
import { createClient, createAccount as createGenLayerAccount, generatePrivateKey } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { Hash, TransactionStatus } from 'genlayer-js/types';
import { readFileSync } from 'fs';
import path from 'path';





export async function getRafffleState(contractAddress: any) {
    const privateKey = generatePrivateKey();
    const account = createGenLayerAccount(privateKey);
    const client = createClient({ chain: studionet, account });
    const result = await client.readContract({
        address: contractAddress,
        functionName: 'get_state',
        args: [],
    });
    return result;

}

export async function submitAnswer(contractAddress: any, answer: string, dbUser: DatabaseUser, clerkUserId: string, firstName: string) {
    const client = createClientFromDbUser(dbUser);
    const transactionHash = await client.writeContract({
        address: contractAddress,
        functionName: 'add_entry',
        args: [answer, clerkUserId, firstName],
        leaderOnly: true,
        value: BigInt(0),
    });

    console.log("TRANSACTION HASH: ", transactionHash);

    return transactionHash;
}

export async function getTransaction(transactionHash: Hash, dbUser: DatabaseUser) {
    const client = createClientFromDbUser(dbUser);
    const transaction = await client.getTransaction({
        hash: transactionHash,
    });
    return transaction;
}

export async function deployRaffleContract(
    evaluation_criteria: string, 
    constraints: string, 
    title: string, 
    description: string, 
    dbUser: DatabaseUser
) {
    const client = createClientFromDbUser(dbUser);
    
    // Initialize consensus smart contract
    await client.initializeConsensusSmartContract();
    
    // Read contract code from file
    const contractPath = path.join(process.cwd(), 'contracts', 'raffle_contract.py');
    const contractCode = readFileSync(contractPath, 'utf-8');
    
    // Deploy contract with constructor arguments
    const deployParams = {
        code: contractCode,
        args: [evaluation_criteria, constraints, title, description],
        leaderOnly: false,
    };
    
    const transactionHash = await client.deployContract(deployParams);
    
    // Wait for deployment to complete
    const receipt = await client.waitForTransactionReceipt({
        hash: transactionHash as Hash,
        status: TransactionStatus.ACCEPTED,
        retries: 50,
        interval: 5000,
    });
    
    console.log('Contract deployed at:', receipt.data?.contract_address);
    
    return {
        transactionHash,
        contractAddress: receipt.data?.contract_address
    };
}

function createClientFromDbUser(dbUser: DatabaseUser) {

    const decryptedPrivateKey = decryptPrivateKey(dbUser.encrypted_private_key as `0x${string}`);
    console.log("decrypted private key");
    console.log("creating account");
    const account = createGenLayerAccount(decryptedPrivateKey as `0x${string}`);
    console.log("created account");
    const client = createClient({ chain: studionet, account });
    return client;
}


export async function resolveRaffle(contractAddress: any, dbUser: DatabaseUser) {
    const client = createClientFromDbUser(dbUser);
    const transactionHash = await client.writeContract({
        address: contractAddress,
        functionName: 'resolve_contract',
        value: BigInt(0),
    });
    return transactionHash;
}