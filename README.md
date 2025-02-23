# HireLabz AI Interview Assistant

An automated interview screening system powered by ElevenLabs AI, Twilio, and OpenAI. Built with Deno and React Email.

## Features

- 🎙️ Automated voice interviews using ElevenLabs AI
- 📞 Phone integration with Twilio
- 📧 Email communications via React Email & Resend
- 🤖 Natural language processing with OpenAI
- 🔄 Webhook integration for dynamic interview content
- 📊 Automated interview evaluation and feedback
- 💾 Interview transcription and storage
- 🗄️ Supabase for data persistence

## Prerequisites

- [Deno](https://deno.land/#installation) 1.37 or higher
- [ngrok](https://ngrok.com/download) for webhook testing
- [Supabase](https://supabase.com) account and project
- API keys for:
  - ElevenLabs
  - Twilio
  - Resend
  - OpenAI
  - Supabase

## Environment Setup

1. Clone the repository
2. Create a `.env` file in the root directory:

```env
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your_sender_email
ELEVENLABS_API_KEY=your_elevenlabs_api_key
OPENAI_API_KEY=your_openai_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Install Dependencies

```bash
deno install
```

## Project Structure

```
/
├── src/
│   ├── controllers/     # Request handlers
│   │   ├── email/
│   │   └── webhook/
│   ├── routes/         # API routes
│   ├── types/         # TypeScript types
│   ├── services/      # Business logic
│   │   ├── elevenlabs/  # Voice & transcript services
│   │   ├── openai/     # Interview evaluation
│   │   └── db/         # Data storage
│   └── middleware/    # Custom middleware
├── emails/            # Email templates
├── tests/            # Test files
└── main.ts           # Application entry
```

## Available Commands

```bash
# Start development server with watch mode
deno task dev

# Start production server
deno task start

# Run tests
deno task test
```

## API Endpoints

### Jobs
- `POST /api/jobs` - Create a new job posting
- `GET /api/jobs` - List all active jobs
- `PUT /api/jobs/:jobId` - Update job details
- `DELETE /api/jobs/:jobId` - Delete a job posting

### Applications
- `POST /api/applications` - Submit job application
- `GET /api/jobs/:jobId/applications` - List applications for a job
- `GET /api/applications/:applicationId` - Get single application
- `PUT /api/applications/:applicationId` - Update application status

### Email
- `POST /api/email/send-invite` - Send interview invitation
- `POST /api/email/send-reminder` - Send interview reminder

### Webhook
- `POST /api/webhook/twilio/interview` - Handle Twilio interview calls
- `POST /api/webhook/twilio/status` - Process call status updates

## Interview Flow

1. Recruiter creates job posting
2. Candidate applies for job
3. Recruiter reviews application and triggers interview
4. Candidate receives interview invitation
5. Candidate calls the Twilio number
6. ElevenLabs AI conducts the interview
7. When call completes:
   - Call transcript is fetched
   - OpenAI evaluates the interview
   - Results are stored
   - Notifications are sent
8. Recruiter reviews interview results and updates application status

## Testing the Webhooks

1. Start the development server:
```bash
deno task dev
```

2. In a new terminal, start ngrok:
```bash
ngrok http 8000
```

3. Use the ngrok URLs in your Twilio configuration:
```
# Interview webhook (goes in elevenlabs)
https://your-ngrok-url.ngrok.io/api/webhook/twilio/interview

# Status webhook (goes in twillio)
https://your-ngrok-url.ngrok.io/api/webhook/twilio/status
```

### Test Status Webhook
```bash
curl -X POST http://localhost:8000/api/webhook/twilio/status \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "CallSid=CA202d9ee8b1bb71f2ee332b80cb6f9b3d&CallStatus=completed&Duration=5&Caller=%2B16172512600&Timestamp=Sun%2C%2023%20Feb%202025%2001%3A09%3A55%20%2B0000"
```

### Test Email Invitation
```bash
curl -X POST http://localhost:8000/api/email/send-invite \
-H "Content-Type: application/json" \
-d '{
  "email": "candidate@example.com",
  "invitationData": {
    "company": {
      "name": "ElevenLabs",
      "logoUrl": "https://eleven-public-cdn.elevenlabs.io/payloadcms/9trrmnj2sj8-logo-logo.svg",
      "recruiterCompany": "HireLabz"
    },
    "candidate": {
      "name": "John Doe"
    },
    "position": {
      "title": "Software Engineer",
      "department": "Engineering"
    }
  }
}'
```

## API Testing Guide

### Job Management

1. Create a new job:
```bash
curl -X POST http://localhost:8000/api/jobs \
-H "Content-Type: application/json" \
-d '{
    "job_name": "Senior Software Engineer",
    "job_description": "We are looking for a Senior Software Engineer with strong experience in distributed systems and cloud architecture.",
    "section_description": "Technical Interview: System Design and Architecture",
    "sections": {
        "technical": ["System Design", "Coding", "Architecture"],
        "behavioral": ["Leadership", "Communication", "Problem Solving"]
    }
}'
```

2. List all active jobs:
```bash
curl http://localhost:8000/api/jobs
```

3. Update a job:
```bash
curl -X PUT http://localhost:8000/api/jobs/123 \
-H "Content-Type: application/json" \
-d '{
    "job_name": "Lead Software Engineer",
    "job_description": "Updated role focusing on team leadership and distributed systems",
    "section_description": "Technical Interview: Leadership and System Design",
    "status": true
}'
```

4. Delete a job:
```bash
curl -X DELETE http://localhost:8000/api/jobs/123
```

### Application Management

1. Apply for a job:
```bash
curl -X POST http://localhost:8000/api/applications \
-H "Content-Type: application/json" \
-d '{
    "job_id": "123",
    "first_name": "John",
    "last_name": "Doe",
    "resume_url": "https://example.com/resume.pdf",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "portfolio_url": "https://johndoe.dev",
    "github_url": "https://github.com/johndoe"
}'
```

2. Get single application:
```bash
curl http://localhost:8000/api/applications/456
```

3. List all applications:
```bash
curl http://localhost:8000/api/applications
```

4. Update application status:
```bash
curl -X PUT http://localhost:8000/api/applications/456 \
-H "Content-Type: application/json" \
-d '{
    "status": "interviewed",
    "resume_url": "https://example.com/updated-resume.pdf",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "portfolio_url": "https://johndoe.dev",
    "github_url": "https://github.com/johndoe"
}'
```

### Interview Process

1. Send interview invitation:
```bash
curl -X POST http://localhost:8000/api/email/send-invite \
-H "Content-Type: application/json" \
-d '{
    "email": "candidate@example.com",
    "invitationData": {
        "company": {
            "name": "ElevenLabs",
            "logoUrl": "https://eleven-public-cdn.elevenlabs.io/payloadcms/9trrmnj2sj8-logo-logo.svg",
            "recruiterCompany": "HireLabz"
        },
        "candidate": {
            "name": "John Doe"
        },
        "position": {
            "title": "Software Engineer",
            "department": "Engineering"
        }
    }
}'
```

2. Test Twilio status webhook:
```bash
curl -X POST http://localhost:8000/api/webhook/twilio/status \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "CallSid=CA202d9ee8b1bb71f2ee332b80cb6f9b3d&CallStatus=completed&Duration=5&Caller=%2B16172512600&Timestamp=Sun%2C%2023%20Feb%202025%2001%3A09%3A55%20%2B0000"
```

### Expected Responses

1. Successful job creation:
```json
{
    "message": "Job created successfully",
    "data": {
        "id": "123",
        "job_name": "Senior Software Engineer",
        "job_description": "...",
        "section_description": "...",
        "sections": {
            "technical": ["System Design", "Coding", "Architecture"],
            "behavioral": ["Leadership", "Communication", "Problem Solving"]
        },
        "status": true,
        "created_at": "2024-02-23T01:09:55.976Z"
    }
}
```

2. Successful application submission:
```json
{
    "message": "Application submitted successfully",
    "data": {
        "id": "456",
        "job_id": "123",
        "first_name": "John",
        "last_name": "Doe",
        "resume_url": "https://example.com/resume.pdf",
        "linkedin_url": "https://linkedin.com/in/johndoe",
        "portfolio_url": "https://johndoe.dev",
        "github_url": "https://github.com/johndoe",
        "status": "pending",
        "created_at": "2024-02-23T01:09:55.976Z"
    }
}
```

3. Error response:
```json
{
    "error": "Failed to create job",
    "details": "Error message details"
}
```

### Testing Tips

1. Replace `123` and `456` with actual IDs from your database
2. Use `jq` for pretty-printed JSON responses:
```bash
curl http://localhost:8000/api/jobs | jq
```
3. For local testing, ensure the server is running:
```bash
deno task dev
```
4. For webhook testing, ensure ngrok is running:
```bash
ngrok http 8000
```

## Security

This project uses Deno's security features with explicit permissions:
- `--allow-env`: For accessing environment variables
- `--allow-net`: For API endpoints and external services
- `--allow-read`: For reading configuration files
