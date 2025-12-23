import { APP_SCHEME, BASE_URL, GOOGLE_AUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from "@/lib/constants";

/**
 * Initiates Google OAuth flow by redirecting user to Google's authorization endpoint with proper parameters
 * Query Parameters:
 * @param {string} client_id - Internal client identifier (e.g., "google")
 * @param {string} redirect_uri - Where to return after auth (APP_SCHEME for mobile, BASE_URL for web)
 * @param {string} state - Random state value for CSRF protection (state echoed back with auth code)
 * @param {string} [scope] - Optional OAuth scopes
 * @returns {Response} 302 redirect to Google's OAuth authorization page
 */
export async function GET(request: Request) {
    if (!GOOGLE_CLIENT_ID) {
        return Response.json(
            { error: "GOOGLE_CLIENT_ID is not set"},
            { status: 500 }
        );
    }

    const url = new URL(request.url);
    let idpClientId: string;
    const internalClient = url.searchParams.get("client_id");
    const redirectUri = url.searchParams.get("redirect_uri");
    let platform;

    if (redirectUri === APP_SCHEME) {
        platform = "mobile";
    } else if (redirectUri === BASE_URL) {
        platform = "web"
    } else {
        return Response.json({ error: "Invalid redirect URI" }, {status: 400})
    }

    let state = platform + "|" + url.searchParams.get("state");

    if (internalClient == "google") {
        idpClientId = GOOGLE_CLIENT_ID;
    } else {
        return Response.json({ error: "Invalid client" }, {status: 400})
    }

    const params = new URLSearchParams({
        client_id: idpClientId,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: url.searchParams.get("scope") || "identity",
        state: state,
        prompt: "select_account",
    });

    return Response.redirect(GOOGLE_AUTH_URL + "?" + params.toString(), 302);

}