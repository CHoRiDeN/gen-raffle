'use server'

import { createClient, createAccount as createGenLayerAccount, generatePrivateKey } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

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
    console.log("RESULT RAFFLES: ", result);
    return result;

}