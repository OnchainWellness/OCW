import NodeCache from "node-cache";
export const myCache = new NodeCache();

export type AuthMessage = {
    types: {
        EIP712Domain: { name: string; type: string }[];
        Challenge: { name: string; type: string }[];
    };
    primaryType: "Challenge";
    domain: { name: string; version: string };
    message: { description: string; challenge: string };
};

export function constructAuthMessage(description: string, challenge: string): AuthMessage {
    return {
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' }
            ],
            Challenge: [
                { name: 'challenge', type: 'string' },
                { name: 'description', type: 'string' }
            ]
        },
        primaryType: "Challenge" as const,
        domain: {
            name: 'OnchainWellness',
            version: '1',
        },
        message: {
            description,
            challenge
        }
    };
}
