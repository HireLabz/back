import { Resend } from 'resend';
import InterviewInvitationEmail, { InterviewInvitationEmailProps } from '../emails/InterviewInvite.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));


export const sendInterviewInvitationEmail = async (params: InterviewInvitationEmailProps, to: string) => {
    try {
        const data = await resend.emails.send({
            from: Deno.env.get("FROM_EMAIL")!,
            to: [to],
            subject: `Interview Invitation for ${params.position.title} Position`,
            react: InterviewInvitationEmail({
                company: {
                    name: params.company.name,
                    logoUrl: params.company.logoUrl,
                    recruiterCompany: params.company.recruiterCompany
                },
                candidate: {
                    name: params.candidate.name
                },
                position: {
                    title: params.position.title,
                    department: params.position.department
                },
                interviewer: {
                    name: params.interviewer.name,
                    role: params.interviewer.role,
                    department: params.interviewer.department,
                    phoneNumber: params.interviewer.phoneNumber
                },
                interviewDetails: {
                    duration: params.interviewDetails.duration,
                    whatToExpect: params.interviewDetails.whatToExpect,
                    topicsToDiscuss: params.interviewDetails.topicsToDiscuss,
                    preparationResources: params.interviewDetails.preparationResources
                }
            }),
        });
        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

export const sendTestEmail = async () => {
    const testParams = {
        company: {
            name: "ElevenLabs",
            logoUrl: "https://eleven-public-cdn.elevenlabs.io/payloadcms/9trrmnj2sj8-logo-logo.svg",
            recruiterCompany: "HireLabz"
        },
        candidate: {
            name: "Brandon Hsu"
        },
        position: {
            title: "Software Engineer",
            department: "Engineering"
        },
        interviewer: {
            name: "Matt Alegria",
            role: "Engineering Manager",
            department: "Voice Engineering",
            phoneNumber: "+1 888 411 8583"
        },
        interviewDetails: {
            duration: "15 minutes",
            whatToExpect: "The interview will begin with a brief introduction and discussion about your background. This will be followed by a screening interview where we'll explore some parts of your background. We'll conclude with a Q&A session where you can learn more about the role and our team.",
            topicsToDiscuss: "We will discuss your experience with voice technology, machine learning, and scalable systems. We're particularly interested in hearing about your experience with engineering and how you collaborate with cross-functional teams.",
            preparationResources: [
                {
                    title: "ElevenLabs API Documentation",
                    link: "https://docs.elevenlabs.io"
                },
                {
                    title: "Voice Cloning Guide",
                    link: "https://elevenlabs.io/docs/voice-cloning"
                },
                {
                    title: "Speech Synthesis Best Practices",
                    link: "https://elevenlabs.io/docs/speech-synthesis"
                }
            ]
        }
    };

    console.log("Sending test email...");
    const result = await sendInterviewInvitationEmail(testParams, "2brandonh@gmail.com");
    console.log("Email send result:", result);
    return result;
};