import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config';

// Initialize Gemini 3 Pro
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export const gemini = genAI.getGenerativeModel({ 
  model: 'gemini-3-pro-preview',
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 1024,
  }
});

export const geminiFlash = genAI.getGenerativeModel({ 
  model: 'gemini-3-flash-preview',
  generationConfig: {
    temperature: 0.5,
    maxOutputTokens: 512,
  }
});

/**
 * Generate smart hangout suggestions with context
 */
export async function generateSmartSuggestion(context: {
  groupName: string;
  memberNames: string[];
  availableSlots: Array<{
    date: string;
    start: string;
    end: string;
    availableMembers: string[];
  }>;
  previousHangouts?: string[];
}) {
  const prompt = `You are helping friends coordinate a hangout. Be warm, brief, and practical.

Group: "${context.groupName}"
Members: ${context.memberNames.join(', ')}

Available time slots where multiple people are free:
${context.availableSlots.map(slot => 
  `- ${slot.date} from ${slot.start} to ${slot.end}: ${slot.availableMembers.join(', ')} available`
).join('\n')}

${context.previousHangouts?.length ? `Recent hangouts: ${context.previousHangouts.join(', ')}` : ''}

Pick the BEST slot and suggest a fun activity. Consider:
1. Maximum attendance
2. Good duration (2-4 hours ideal)
3. Weekend vs weekday vibes

Respond in JSON format:
{
  "bestSlot": { "date": "YYYY-MM-DD", "start": "HH:MM", "end": "HH:MM" },
  "title": "Short catchy title (3-5 words)",
  "reason": "One sentence why this time is best",
  "activityIdea": "Quick activity suggestion"
}`;

  try {
    const result = await gemini.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON in response');
  } catch (error) {
    console.error('Gemini suggestion error:', error);
    return null;
  }
}

/**
 * Generate personalized notification text
 */
export async function generateNotificationText(context: {
  type: 'check_in' | 'reminder' | 'confirmed' | 'suggestion';
  userName: string;
  groupName: string;
  details?: string;
}) {
  const prompts: Record<string, string> = {
    check_in: `Write a friendly, brief push notification asking ${context.userName} to confirm their free time for a hangout with "${context.groupName}". Make it feel personal, not robotic. Max 100 chars.`,
    
    reminder: `Write a gentle reminder for ${context.userName} that "${context.groupName}" is waiting for their availability. Be warm but create slight urgency. Max 100 chars.`,
    
    confirmed: `Write an excited notification for ${context.userName} that a hangout with "${context.groupName}" is confirmed! ${context.details || ''}. Max 100 chars.`,
    
    suggestion: `Write an upbeat notification for ${context.userName} that "${context.groupName}" found a time that works! Max 100 chars.`,
  };

  try {
    const result = await geminiFlash.generateContent(prompts[context.type]);
    return result.response.text().trim().replace(/"/g, '');
  } catch (error) {
    console.error('Gemini notification error:', error);
    const fallbacks: Record<string, string> = {
      check_in: `Hey! When are you free for ${context.groupName}?`,
      reminder: `${context.groupName} is waiting for your availability!`,
      confirmed: `🎉 Hangout confirmed with ${context.groupName}!`,
      suggestion: `${context.groupName} found a time that works!`,
    };
    return fallbacks[context.type];
  }
}
