# HireLabz AI Interview Assistant

An automated interview screening system powered by ElevenLabs AI, Twilio, and OpenAI. Built with Deno and React Email.

## Features

- 🎙️ Automated voice interviews using ElevenLabs AI
- 📞 Phone integration with Twilio
- 📧 Email communications via React Email & Resend
- 🤖 Natural language processing with OpenAI
- 🔄 Webhook integration for dynamic interview content

## Prerequisites

- [Deno](https://deno.land/#installation) 1.37 or higher
- [ngrok](https://ngrok.com/download) for webhook testing
- API keys for:
  - ElevenLabs
  - Twilio
  - Resend
  - OpenAI

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
│   └── services/      # Business logic
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

### Email
- `POST /api/email/send-invite` - Send interview invitation
- `POST /api/email/send-reminder` - Send interview reminder

### Webhook
- `POST /api/webhook/twilio/interview` - Handle Twilio interview calls

## Testing the Webhook

1. Start the development server:
```bash
deno task dev
```

2. In a new terminal, start ngrok:
```bash
ngrok http 8000
```

3. Use the ngrok URL in your ElevenLabs webhook configuration:
```
https://your-ngrok-url.ngrok.io/api/webhook/twilio/interview
```

4. Run the webhook tests:
```bash
deno task test
```

## Making Test Requests

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

### Test Webhook
```bash
curl -X POST http://localhost:8000/api/webhook/twilio/interview \
-H "Content-Type: application/json" \
-d '{
  "caller_id": "+1234567890",
  "agent_id": "7c9ECtwO3ZcGR2Z77mEO",
  "called_number": "+18884118583",
  "call_sid": "test_call_123"
}'
```

## Security

This project uses Deno's security features with explicit permissions:
- `--allow-env`: For accessing environment variables
- `--allow-net`: For API endpoints and external services
- `--allow-read`: For reading configuration files

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT