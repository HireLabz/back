import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface CompanyInfo {
    name: string;
    logoUrl: string;
    recruiterCompany: string;
}

interface InterviewerInfo {
    name: string;
    role: string;
    department: string;
    phoneNumber: string;
}

interface InterviewDetails {
    duration: string;
    whatToExpect: string;
    topicsToDiscuss: string;
    preparationResources: {
        title: string;
        link: string;
    }[];
}

export interface InterviewInvitationEmailProps {
    company: CompanyInfo;
    candidate: {
        name: string;
    };
    position: {
        title: string;
        department: string;
    };
    interviewer: InterviewerInfo;
    interviewDetails: InterviewDetails;
}

const InterviewInvitationEmail = ({
    company = {
        name: 'ElevenLabs',
        logoUrl: 'https://eleven-public-cdn.elevenlabs.io/payloadcms/9trrmnj2sj8-logo-logo.svg',
        recruiterCompany: 'HireLabz'
    },
    candidate = {
        name: 'John Doe'
    },
    position = {
        title: 'Software Engineer',
        department: 'Engineering'
    },
    interviewer = {
        name: 'Jane Smith',
        role: 'Engineering Manager',
        department: 'Voice Engineering',
        phoneNumber: '+1234567890'
    },
    interviewDetails = {
        duration: '15 minutes',
        whatToExpect: 'The interview will begin with a brief introduction and discussion about your background. This will be followed by a technical assessment where we\'ll explore your problem-solving approach. We\'ll conclude with a Q&A session where you can learn more about the role and our team.',
        topicsToDiscuss: 'We will discuss your experience with voice technology, machine learning, and scalable systems. We\'re particularly interested in hearing about your approach to solving complex technical challenges and how you collaborate with cross-functional teams.',
        preparationResources: [
            {
                title: 'ElevenLabs API Documentation',
                link: 'https://docs.elevenlabs.io'
            },
            {
                title: 'Voice Cloning Guide',
                link: 'https://elevenlabs.io/docs/voice-cloning'
            },
            {
                title: 'Speech Synthesis Best Practices',
                link: 'https://elevenlabs.io/docs/speech-synthesis'
            }
        ]
    }
}: InterviewInvitationEmailProps) => {
    const previewText = `Interview Invitation for ${position.title} Position at ${company.name}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Img
                        src={company.logoUrl}
                        width="600"
                        height="200"
                        alt={company.name}
                        style={logo}
                    />
                    <Heading style={heading}>Interview Invitation</Heading>
                    <Text style={paragraph}>Dear {candidate.name},</Text>
                    <Text style={paragraph}>
                        Thank you for your interest in joining us. We are excited to learn
                        more about your experiences.
                    </Text>
                    <Text style={paragraph}>
                        We would like to invite you for an interview for the position of{' '}
                        {position.title} in our {position.department} team.
                    </Text>

                    <Section style={detailsSection}>
                        <Text style={detailsText}>
                            Duration: {interviewDetails.duration}
                        </Text>
                        <Text style={detailsText}>
                            Interviewer: {interviewer.name}
                        </Text>
                        <Text style={detailsText}>
                            Role: {interviewer.role}, {interviewer.department}
                        </Text>
                    </Section>

                    <Section style={infoSection}>
                        <Text style={infoHeading}>How to Join the Interview</Text>
                        <Text style={paragraph}>
                            You can call the interviewer anytime at:{' '}
                            <a href={`tel:${interviewer.phoneNumber}`} style={phoneLink}>
                                {interviewer.phoneNumber}
                            </a>
                        </Text>
                        <Text style={paragraph}>
                            Yes, no kidding. Just give us a call 😉
                        </Text>
                    </Section>

                    <Section style={infoSection}>
                        <Text style={infoHeading}>What to Expect</Text>
                        <Text style={paragraph}>
                            {interviewDetails.whatToExpect}
                        </Text>
                    </Section>

                    <Section style={infoSection}>
                        <Text style={infoHeading}>Topics We'll Cover</Text>
                        <Text style={paragraph}>
                            {interviewDetails.topicsToDiscuss}
                        </Text>
                    </Section>

                    <Section style={infoSection}>
                        <Text style={infoHeading}>Preparation Resources</Text>
                        {interviewDetails.preparationResources.map((resource, index) => (
                            <Text key={index} style={listItem}>
                                • <a href={resource.link} style={resourceLink}>
                                    {resource.title}
                                </a>
                            </Text>
                        ))}
                    </Section>
                    <Text style={paragraph}>
                        We look forward to speaking with you!
                    </Text>
                    <Text style={footer}>
                        This email was sent by {company.recruiterCompany} on behalf of {company.name}. Please do not reply.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Updated Styles for ElevenLabs-like UI
const main = {
    backgroundColor: '#f7f7f7', // Light gray background
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '48px 24px',
    maxWidth: '600px',
    backgroundColor: '#ffffff', // White container background
    borderRadius: '8px', // Rounded corners for the container
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // Subtle shadow
};

const logo = {
    margin: '0 0 5px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
};

const heading = {
    fontSize: '28px', // Slightly larger heading
    letterSpacing: '-0.02em',
    fontWeight: '600', // Slightly bolder
    color: '#1a202c', // Darker text color
    margin: '0 0 24px', // Reduced margin
    padding: '0',
};

const paragraph = {
    fontSize: '16px', // Slightly larger paragraph text
    lineHeight: '1.5',
    color: '#4a5568', // Medium gray text color
    margin: '0 0 20px', // Reduced margin
    fontWeight: '400',
};

const detailsSection = {
    margin: '24px 0', // Reduced margin
    padding: '20px', // Reduced padding
    backgroundColor: '#edf2f7', // Lighter background for details
    borderRadius: '6px', // Rounded corners
};

const detailsText = {
    fontSize: '16px', // Slightly larger text
    lineHeight: '1.4',
    color: '#4a5568', // Medium gray text color
    margin: '0 0 12px', // Reduced margin
    fontWeight: '400',
};

const infoSection = {
    margin: '24px 0', // Reduced margin
};

const infoHeading = {
    fontSize: '20px', // Slightly larger heading
    fontWeight: '600',
    color: '#1a202c', // Darker text color
    margin: '0 0 12px', // Reduced margin
};

const listItem = {
    fontSize: '16px', // Slightly larger text
    lineHeight: '1.5',
    color: '#4a5568', // Medium gray text color
    margin: '0 0 6px', // Reduced margin
    paddingLeft: '8px',
};

const phoneLink = {
    color: '#1a202c', // Darker text color
    textDecoration: 'none',
    borderBottom: '1px solid #a0aec0', // Light gray underline
};

const footer = {
    color: '#718096', // Medium gray text color
    fontSize: '14px', // Slightly larger text
    margin: '32px 0 0', // Reduced margin
    textAlign: 'left' as const,
};

const resourceLink = {
    color: '#2D3748',
    textDecoration: 'none',
    borderBottom: '1px solid #A0AEC0',
    fontWeight: '500' as const,
    ':hover': {
        borderBottom: '1px solid #2D3748',
    }
};

export default InterviewInvitationEmail
