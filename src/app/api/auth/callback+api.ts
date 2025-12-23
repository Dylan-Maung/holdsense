import { APP_SCHEME, BASE_URL } from "@/lib/constants";

/**
 * OAuth callback - receives auth code from Google and redirects to the appropriate platform
 * Query Parameters (received from google):
 * @param {string} code - Auth code returned from google to exchange for tokens
 * @param {string} state - Combined "platform|state" string echoed back by Google for CSRF validation
 * @returns {Response} 302 redirect to client app (web or mobile) with auth code and state
 */
export async function GET(request: Request) {
    const incomingParams = new URLSearchParams(request.url.split("?")[1]);
    const combinedPlatformAndState = incomingParams.get("state");

    if (!combinedPlatformAndState) {
        return Response.json({error: "Invalid state"}, { status: 400});
    }

    const platform = combinedPlatformAndState.split("|")[0];
    const state = combinedPlatformAndState.split("|")[1];

    const outgoingParams = new URLSearchParams({
        code: incomingParams.get("code")?.toString() || "",
        state,
    });

    return Response.redirect((platform === "web" ? BASE_URL : APP_SCHEME) + "?" + outgoingParams.toString(), 302);
}