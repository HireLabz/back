import { assertEquals } from "https://deno.land/std/assert/assert_equals.ts";

Deno.test("Twilio webhook test", async () => {
    const response = await fetch("http://localhost:8000/api/webhook/twilio/interview", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            caller_id: "+1234567890",
            agent_id: "7c9ECtwO3ZcGR2Z77mEO",
            called_number: "+18884118583",
            call_sid: "test_call_123"
        })
    });

    const data = await response.json();

    assertEquals(response.status, 200);
    assertEquals(typeof data.dynamic_variables.candidate_name, "string");
    assertEquals(typeof data.dynamic_variables.job_description, "string");
    // Add more assertions as needed
}); 