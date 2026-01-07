import { COOKIE_MAX_AGE, COOKIE_NAME, COOKIE_OPTIONS, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, JWT_EXPIRATION_TIME, JWT_SECRET } from "@/lib/constants";
import * as jose from "jose";

/**
 * Exchanges Google authorization code for JWT access token
 * @param {FormData} code - Authorization code from Google OAuth callback
 * @param platform - "web" (adds HTTP-only cookie) or "native" (JSON only)
 * @returns {Response} JSON with access_token, plus Set-Cookie header for web
 */
export async function POST(request: Request) {
    const body = await request.formData();
    const code = body.get("code") as string;
    const platform = (body.get("platform") as string) || "native";

    if (!code) {
        return Response.json({ error: "Missing auth code" }, { status: 400});
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code",
            code: code,
        }).toString(),
    });

    interface GoogleTokenResponse {
        id_token: string;
        access_token: string;
        expires_in: number;
        token_type: string;
    }

    const data = await response.json() as GoogleTokenResponse;;

    if (!data.id_token) {
        return Response.json(
            { error: "Id token wasn't recieved" },
            {status: 400}
        )
    }

    const userInfo = jose.decodeJwt(data.id_token) as object;

    const { exp,...userInfoWithoutExp } = userInfo as any;

    const sub = (userInfo as { sub: string }).sub;
    const issuedAt = Math.floor(Date.now() / 1000);

    const accessToken = await new jose.SignJWT(userInfoWithoutExp)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(JWT_EXPIRATION_TIME)
        .setSubject(sub)
        .setIssuedAt(issuedAt)
        .sign(new TextEncoder().encode(JWT_SECRET))

    if (platform === "web") {
        const response = Response.json({
            access_token: accessToken,
            id_token: data.id_token,
            token_type: "Bearer",
            expires_in: COOKIE_MAX_AGE
        });

        response.headers.set(
            "Set-Cookie",
            `${COOKIE_NAME}=${accessToken}; Max-Age=${COOKIE_OPTIONS.maxAge}; Path=${
              COOKIE_OPTIONS.path
            }; ${COOKIE_OPTIONS.httpOnly ? "HttpOnly;" : ""} ${
              COOKIE_OPTIONS.secure ? "Secure;" : ""
            } SameSite=${COOKIE_OPTIONS.sameSite}`
        );

        return response;
    }

    return Response.json({ access_token: accessToken, id_token: data.id_token});
}