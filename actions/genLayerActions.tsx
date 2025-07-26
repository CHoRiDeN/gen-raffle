'use server'

import { DatabaseUser } from "@/contexts/DbUserContext";
import { decryptPrivateKey } from "@/lib/utils";
import { createClient, createAccount as createGenLayerAccount, generatePrivateKey } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { Hash } from 'genlayer-js/types';





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