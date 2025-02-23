export interface CallTranscript {
    call_sid: string;
    messages: Array<{
        role: "agent" | "user";
        content: string;
        timestamp: string;
    }>;
    duration: string;
    caller: string;
}

export async function fetchTranscript(callSid: string): Promise<CallTranscript | null> {
    try {
        console.log(`[Transcript Service] Fetching transcript for call ${callSid}`);
        // TODO: Implement actual ElevenLabs API call

        // Mock transcript data
        return {
            call_sid: callSid,
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