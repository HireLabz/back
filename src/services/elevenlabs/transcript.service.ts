const ELEVEN_LABS_API_KEY = Deno.env.get("ELEVEN_LABS_API_KEY")!;
const ELEVEN_LABS_TRANSCRIPT_URL = "https://api.elevenlabs.io/v1/convai/conversations/"
export interface CallTranscript {
    call_id: string;
    messages: Array<{
        role: "agent" | "user";
        content: string;
        timestamp: string;
    }>;
    duration: string;
    caller: string;
}

export async function fetchTranscript(callId: string): Promise<CallTranscript | null> {
    try {
        let response = await fetch(ELEVEN_LABS_TRANSCRIPT_URL + callId, {
            method: "GET",
            headers: {
              "xi-api-key": ELEVEN_LABS_API_KEY,
              "Content-Type": "application/json"
            }
          });
        response = await response.json();

        // Mock transcript data
        return {
            call_id: callId,
            messages: [
                {
                    role: "agent",
                    content: "Hello, welcome to your interview. Could you tell me about your experience with distributed systems?",
                    timestamp: "2024-02-23T01:00:00Z"
                },
                {
                    role: "user",
                    content: "I've worked extensively with microservices at Microsoft, particularly on the Loop project...",
                    timestamp: "2024-02-23T01:00:10Z"
                }
                // ... more messages
            ],
            duration: "300",
            caller: "+16172512600"
        };
    } catch (error) {
        console.error("[Transcript Service] Error:", error);
        return null;
    }
} 