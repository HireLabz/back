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

### Email
- `POST /api/email/send-invite` - Send interview invitation
- `POST /api/email/send-reminder` - Send interview reminder

### Webhook
- `POST /api/webhook/twilio/interview` - Handle Twilio interview calls
- `POST /api/webhook/twilio/status` - Process call status updates

## Interview Flow

1. Candidate receives interview invitation
2. Candidate calls the Twilio number
3. ElevenLabs AI conducts the interview
4. When call completes:
   - Call transcript is fetched
   - OpenAI evaluates the interview
   - Results are stored
   - Notifications are sent

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