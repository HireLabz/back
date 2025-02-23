const ELEVEN_LABS_API_KEY = Deno.env.get("ELEVEN_LABS_API_KEY")!;
const ELEVEN_LABS_TRANSCRIPT_URL = "https://api.elevenlabs.io/v1/convai/conversations/"
export interface TranscriptMessage {
    role: string,
    message: string,
    time_incall_secs: number,
}

export async function fetchTranscript(callId: string): Promise<[TranscriptMessage] | null> {
    try {
        // Wait for 10 seconds before proceeding
        await new Promise(resolve => setTimeout(resolve, 10000));

        const url = `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${Deno.env.get("ELEVEN_LABS_AGENT_ID")}&page_size=100`;
        const options = { method: 'GET', headers: { 'xi-api-key': ELEVEN_LABS_API_KEY } };


        const conv_response = await fetch(url, options);
        const conv_data = await conv_response.json();
        console.log(conv_data);
        console.log(conv_data.conversations[0].conversation_id);
        console.log(conv_data.conversations.length);

        const response = await fetch(ELEVEN_LABS_TRANSCRIPT_URL + conv_data.conversations[0].conversation_id, {
            method: "GET",
            headers: {
                "xi-api-key": ELEVEN_LABS_API_KEY,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log(data);
        return data.transcript;

    } catch (error) {
        console.error("[Transcript Service] Error:", error);
        return null;
    }
} 