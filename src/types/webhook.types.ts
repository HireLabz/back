export interface InterviewConfig {
    dynamic_variables: {
        section_description: string;
        job_name: string;
        candidate_resume: string;
        candidate_name: string;
        company_name: string;
        job_description: string;
    };
    // TODO: We may need this for using in differente jobs
    // conversation_config_override: {
    //     agent: {
    //         prompt: {
    //             prompt: string;
    //         };
    //         first_message: string;
    //         language: string;
    //     };
    //     tts: {
    //         voice_id: string;
    //     };
    // };
}

export interface TwilioWebhookData {
    caller_id: string;
    agent_id: string;
    called_number: string;
    call_sid: string;
} 