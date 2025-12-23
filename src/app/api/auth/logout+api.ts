import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/constants";

/**
 * Logs user out by clearing authentication cookie
 * @returns {Response} Success confirmation with expired cookie header
 */
export async function POST(request: Request) {
    try {
        const response = Response.json({ success: true});

        response.headers.set(
            "Set-Cookie",
            `${COOKIE_NAME}=; Max-Age=0; Path=${COOKIE_OPTIONS.path}; ${
              COOKIE_OPTIONS.httpOnly ? "HttpOnly;" : ""
            } ${COOKIE_OPTIONS.secure ? "Secure;" : ""} SameSite=${
              COOKIE_OPTIONS.sameSite
            }`
        );
        
        return response;
    } catch (e) {
        console.error("Logout error:", e);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}