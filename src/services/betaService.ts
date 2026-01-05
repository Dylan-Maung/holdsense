import { OPENAI_API_KEY } from "@/lib/constants";
import { RouteData } from '@/src/types/routeData';
import { UserProfile } from "../types/userProfile";

interface OpenAIResponse {
    choices?: {
        message: {
            content: string;
        };
        finish_reason: string;
    }[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    error?: {
        message: string;
        type: string;
        code: string;
    };
}

export function buildBetaPrompt(route: RouteData, userProfile: UserProfile): string {
    const formatHold = (hold: any) => {
        return `- ${hold.holdType} (${hold.usedBy.toLowerCase()})
        - Type: ${hold.holdType}
        - Usage: ${hold.tag}
        - Position: x=${hold.position.x.toFixed(2)}, y=${hold.position.y.toFixed(2)}, z=${hold.position.z.toFixed(2)}
        - Color: ${hold.color || 'N/A'}
        - Orientation: ${hold.orientation}°${hold.dualTexture ? '\n  - Dual Texture: Yes' : ''}`;
    };
    const holdsSection = route.holds.map(formatHold).join('\n\n');
    
    const wallInfo = route.fullRouteImages.map(w => `${w.angle}° ${w.type}`);
    const wallAngleText = wallInfo.length === 1 
        ? wallInfo[0]
        : `${wallInfo.join(' → ')} (bottom to top)`;
    const hasTopOut = route.fullRouteImages.some(w => w.topOut);
    const wallContext = wallInfo.length > 1
    ? `- Wall progresses: ${wallInfo.join(' → ')}`
    : `- Wall is ${wallInfo[0]}`;
    const topOutContext = hasTopOut ? '- Route requires topping out' : '';

    const anthropometrySection = `
        CLIMBER ANTHROPOMETRY:
        - Height: ${userProfile.height} inches
        - Ape Index: ${userProfile.reach}
    `
    const apeContext = userProfile.reach !== null && userProfile!.reach! < 0
        ? `- Climber has negative ape index (${userProfile.reach}), so dynamic moves may be needed for longer reaches`
        : '';

    // Build full prompt
    return `You are an expert climbing coach. Generate detailed beta (movement advice) for the following boulder problem.

    ROUTE INFORMATION:
    - Grade: ${route.grade}
    - Wall Configuration: ${wallAngleText}${hasTopOut ? ' (Top Out)' : ''}
    - Color: ${route.color || 'N/A'}
    ${anthropometrySection}
    
    HOLDS (positions normalized 0-1, where x=0 is left edge, y=0 is top, y=1 is bottom):
    ${holdsSection}
    
    ADDITIONAL CONTEXT:
    ${wallContext}
    ${topOutContext}
    - Holds higher up (lower y value) extend further from wall as angle increases
    ${apeContext}
    - Route has ${route.holds.length} total holds (holds include footholds also)
    
    Please provide:
    1. Concise step-by-step beta
    2. Key crux moves
    3. Tips specific to the climber's anthropometry
    4. Suggested body positioning`;
}

export async function GenerateBeta(route: RouteData, userProfile: UserProfile) {
    const prompt = buildBetaPrompt(route, userProfile);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'user', content: prompt }
            ],
            max_tokens: 1000,
            temperature: 0.7
        })
    });
    
    const data = await response.json() as OpenAIResponse;
    
    if (!response.ok || !data.choices) {
        console.error('API Error:', data);
        throw new Error(data.error?.message || 'Failed to generate beta');
    }

    const beta = data.choices[0].message.content;

    return beta
}