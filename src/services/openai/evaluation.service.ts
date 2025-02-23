import type { TranscriptMessage } from "../elevenlabs/transcript.service.ts";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
export interface EvaluationSkills {
    skill_name: string,
    skill_score: number,
    skill_reasoning: number
}
export interface Evaluation {
    overall_rating: number;
    summary: string;
    transcript: string; // json string
    skills: Array<EvaluationSkills>;
}

export async function evaluateInterview(transcript: [TranscriptMessage]): Promise<Evaluation | null> {
    try {
        let parsed_transcript = "";
        for (const message of transcript) {
            const role = message.role == "user" ? "Danilo" : "Eleven Labs";
            parsed_transcript += `${role}: ${message.message}\n`;
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4o-2024-08-06",
              messages: [
                {
                  role: "system",
                  content: `You are a hiring manager. You are evaluating a candidate's interview transcript. 
                  
                  Provide an overall candidate rating (between 1-100) and a summary of the interview. Make sure to specifically mention noteworthy points that were used to determine the rating.
                  
                  Then for each of the listed skills, provide a score (between 1-100) and a reasoning for the score.
                  
                  1) Technical Skills
                  2) Communication Skills
                  3) Past Experience
                  4) Culture Fit
                  `
                },
                {
                  role: "user",
                  content: `Analyze this transcript: ${parsed_transcript}`
                }
              ],
              functions: [
                {
                  name: "provide_analysis",
                  description: "Analyze the provided text and return structured output",
                  parameters: {
                    type: "object",
                    properties: {
                    overall_rating: {
                        type: "number",
                        description: "Overall candidate rating from 0-100"
                      },
                      summary: {
                        type: "string",
                        description: "Summary of the interview (maximum 125 words)"
                      },
                      skills: {
                        type: "array",
                        items: { 
                            type: "object",
                            properties: {
                                skill_name: {
                                    type: "string",
                                    description: "Name of the skill"
                                },
                                skill_score: {
                                    type: "number",
                                    description: "Score of the skill from 0-100"
                                },
                                skill_reasoning: {
                                    type: "string",
                                    description: "Reasoning for the score (maximum 50 words)"
                                }
                            }
                         },
                        description: "Breakdown of skills of the candidate and score of each skill"
                      }
                    },
                    required: ["overall_rating", "summary", "skills"]
                  }
                }
              ],
              function_call: { name: "provide_analysis" }
            })
          });
        
        let data = await response.json();
        data = data.choices[0].message.function_call.arguments;
        return data;
        
    } catch (error) {
        console.error("[Evaluation Service] Error:", error);
        return null;
    }
} 