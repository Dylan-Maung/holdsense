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

    HOLDS (numbered for reference - positions normalized 0-1, where x=0 is left edge, y=0 is top, y=1 is bottom):
    ${holdsSection}

    ADDITIONAL CONTEXT:
    ${wallContext}
    ${topOutContext}
    - Holds higher up (lower y value) extend further from wall as angle increases
    ${apeContext}
    - Route has ${route.holds.length} total holds (holds include footholds also)
    - Holds CAN BE REUSED with different orientations (e.g., a pinch can become an undercling when climber is above it)

    OFFICIAL CLIMBING RULES:

    VALID START POSITION:
    - If there are TWO starting holds labeled, you MUST use one hand on each (cannot start matched on one hold)
    - Feet MUST be off the ground (can be smeared on wall, on a hold, or floating, but NOT touching the floor)
    - Common start positions: both feet smeared on wall, one foot on a low hold, feet floating/cutting

    VALID FINISH POSITION:
    - Both hands MUST be on the finish hold(s)
    - Must be STABLE enough to hold position for 3 seconds without readjusting
    - Body position must support maintaining this position (hips, feet placement matter for stability)
    - If finishing on a sloper or bad hold, explain foot placement needed for stability

    BETA FORMAT REQUIREMENTS:
    Your beta must be EXTREMELY SPECIFIC about each limb on each move:

    Example of GOOD beta:
    "Move 1: Right hand on Hold #3 (crimp), left hand on Hold #1 (jug), right toe on Hold #5 (edge), left foot flagged for balance"

    Example of BAD beta:
    "Both hands on start holds, feet on edges" TOO VAGUE

    For each move, specify:
    - Which SPECIFIC hold number each limb uses (e.g., "Hold #7")
    - Which hand/foot (right hand, left foot, etc.)
    - Foot technique if applicable (toe-in, heel hook, flag, smear, etc.)
    - Body position (hips left, right shoulder dropped, etc.)

    STARTING POSITION:
    - Analyze if starting CROSSED (e.g., left hand on right-side hold) sets up better for the next move
    - Explain WHY a specific starting hand configuration is better

    FOOT PLACEMENT PRIORITY (highest to lowest):
    1. **Use actual footholds** if available below or near start holds (easiest, most stable)
    2. **Smear on wall** only if no footholds are accessible
    3. **Flag or cut feet** only for specific balance/reach reasons

    IMPORTANT: If there are footholds labeled as "foot" usage below the start position, ALWAYS prefer using them over smearing. Only suggest smearing if:
    - No footholds are reachable from start position
    - The footholds would put body in worse position for first move
    - Route intentionally starts with no feet (rare, mention this is unusual)

    Example GOOD start:
    "Right foot on Hold #8 (edge, foot), left toe on Hold #9 (volume, foot)"

    Example BAD start when holds exist:
    "Both feet smearing on wall" (if Hold #8 and #9 are available)

    Please provide:
    1. Starting position with hand configuration and foot placement explanation
    2. Move-by-move beta with hold numbers and all 4 limbs specified
    3. Key crux moves with extra detail on body positioning
    4. Finishing position with stability notes
    5. Tips specific to climber's anthropometry (height: ${userProfile.height}", ape index: ${userProfile.reach})
    6. Alternative sequences if applicable`;
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