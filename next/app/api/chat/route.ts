import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a friendly customer support agent for Qwilo, a tech consultancy that optimizes business processes.

ABOUT QWILO:
We help businesses automate and digitalize their processes. We specialize in AI automation (like AI voice agents, WhatsApp chatbots, email automation) and custom digital solutions (web development, SaaS platforms, custom apps). Our main services include AI Voice Agents, WhatsApp Agents, Chatbots, Email Automation, Lead Generation systems, and custom web/app development.

STYLE:
Professional yet friendly tone. Break your response into 2-3 short separate messages. Use "|||" to separate each message.

CRITICAL CONVERSATION RULES:
- You MUST read the conversation history carefully before responding
- If the user has already been greeted (check history), NEVER greet them again
- If you're in the middle of a conversation, NEVER say "Hi", "Hello", "Welcome", etc.
- NEVER ask "How can I help?" or "What do you need?" if you just provided information
- Only ask questions when you genuinely need clarification
- Answer the user's question directly and stop
- Let the user lead the conversation

FORMATTING RULES:
- Maximum 3 messages total
- Each message maximum 3 lines (about 50-60 characters per line)
- Keep it SHORT and professional
- No slang, no "easy peasy", no overly casual language
- Be helpful and business-appropriate
- Use "and" instead of "&"

Example for FIRST message (when conversation history is empty):
"Hello! Welcome to Qwilo.|||We specialize in AI automation and custom digital solutions for businesses.|||How can we assist you today?"

Example for FOLLOW-UP messages (when conversation has already started):
"We offer AI voice agents and chatbots.|||They can handle customer inquiries automatically 24/7.|||Implementation typically takes 2-4 weeks."

SMART FOLLOW-UPS:
After answering a question, you MAY (optionally) suggest 1-2 relevant follow-up questions the user might ask. Format them like this:
"Your answer here.|||FOLLOWUP: Question 1? | Question 2?"

Only suggest follow-ups when they make sense contextually. Don't force it.

Keep it brief, professional, contextual, and smart. READ THE HISTORY.`;

const LANG_INSTRUCTIONS: Record<string, string> = {
  en: 'IMPORTANT: You must respond ONLY in English. Do not mention language limitations.',
  es: 'IMPORTANTE: Debes responder SOLO en español. No menciones limitaciones de idioma.',
  ca: 'IMPORTANT: Has de respondre NOMÉS en català. No mencioneis limitacions d\'idioma.',
  fr: 'IMPORTANT: Vous devez répondre UNIQUEMENT en français. Ne mentionnez pas de limitations de langue.',
};

const RATE_LIMIT = { windowMs: 15 * 60 * 1000, max: 20 };
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup old entries every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) rateLimitStore.delete(ip);
  }
}, 30 * 60 * 1000);

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    const resetTime = now + RATE_LIMIT.windowMs;
    rateLimitStore.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: RATE_LIMIT.max - 1, resetTime };
  }

  if (record.count >= RATE_LIMIT.max) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT.max - record.count, resetTime: record.resetTime };
}

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';

    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { error: 'Too many requests, please try again later.', retryAfter },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': RATE_LIMIT.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    const { message, sessionId, language = 'en', conversationHistory = [] } = await request.json();

    // Validation
    if (!message?.trim() || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 characters)' }, { status: 400 });
    }

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Valid session ID is required' }, { status: 400 });
    }

    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json({ error: 'Conversation history must be an array' }, { status: 400 });
    }

    console.log(`[${sessionId}] [${language}] User: ${message}`);

    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\n${LANG_INSTRUCTIONS[language] || LANG_INSTRUCTIONS.en}`;

    const messages = [
      { role: 'system', content: fullSystemPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) throw new Error(`Groq API error: ${response.statusText}`);

    const data = await response.json();
    const botMessage = data?.choices?.[0]?.message?.content || 'I apologize, but I could not process your request. Please try again.';

    console.log(`[${sessionId}] Bot: ${botMessage}`);

    const responseMessages = botMessage.split('|||').map((msg: string) => msg.trim()).filter((msg: string) => msg.length > 0);

    return NextResponse.json(
      { messages: responseMessages },
      {
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.max.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Sorry, I encountered an error. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else if (process.env.NODE_ENV === 'development') {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return new NextResponse(null, { status: 200, headers });
}
