const ELEVEN_LABS_API_KEY = Deno.env.get("ELEVEN_LABS_API_KEY")!;
const ELEVEN_LABS_TRANSCRIPT_URL = "https://api.elevenlabs.io/v1/convai/conversations/"
export interface TranscriptMessage {
    role: string,
    message: string,
    time_incall_secs: number,
}

export async function fetchTranscript(callId: string): Promise<[TranscriptMessage] | null> {
    try {
        const response = await fetch(ELEVEN_LABS_TRANSCRIPT_URL + callId, {
            method: "GET",
            headers: {
                "xi-api-key": ELEVEN_LABS_API_KEY,
                "Content-Type": "application/json"
            }
          });
        
        const data = await response.json();
        return data.transcript;

    } catch (error) {
        console.error("[Transcript Service] Error:", error);
        return null;
    }
} 