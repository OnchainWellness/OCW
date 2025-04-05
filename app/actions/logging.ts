'use server'

export const logEvent = async (event: string, data: unknown) => {
    console.log('Logging event:', event, data);
}