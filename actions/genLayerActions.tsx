'use server'

import { createClient, createAccount as createGenLayerAccount, generatePrivateKey } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from 'genlayer-js/types';

const privateKey = generatePrivateKey();

// Create account with specific private key
const account = createGenLayerAccount(privateKey);
const client = createClient({ chain: studionet, account });

export async function getRafffleState(contractAddress: any) {
    const result = await client.readContract({
        address: contractAddress,
        functionName: 'get_state',
        args: [],
    });
    return result;

}

export async function submitAnswer(contractAddress: any, answer: string, clerk_id: string) {
    const transactionHash = await client.writeContract({
        address: contractAddress,
        functionName: 'add_entry',
        args: [answer, clerk_id],
        leaderOnly: true,
        value: BigInt(0),
    });

    console.log("TRANSACTION HASH: ", transactionHash);

    const receipt = await client.waitForTransactionReceipt({
        hash: transactionHash,
        status: TransactionStatus.ACCEPTED,
        retries: 20,
        interval: 1000,
    });

    console.log("RECEIPT: ", receipt);
    return receipt;
}