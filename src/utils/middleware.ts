import { COOKIE_NAME, JWT_SECRET } from "@/lib/constants";
import * as jose from "jose";
import { AuthUser } from "../context/auth";

/**
 * Authentication middleware - protects API routes by validating JWT tokens (signature & expiration)
 * @param handler - API route handler that receives authenticated user
 * @returns Wrapped handler that enforces authentication
 */
export function withAuth<T extends Response>(
    handler: (req: Request, user: AuthUser) => Promise<T>
) {
    return async (req: Request): Promise< T | Response> => {
        try {
            let token: string | null = null;
            const authHeader = req.headers.get("authorization");

            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }

            if (!token) {
                const cookieHeader = req.headers.get("cookie");
                if (cookieHeader) {
                    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
                        const [key, value] = cookie.trim().split("=");
                        acc[key.trim()] = value
                        return acc;
                    }, {} as Record<string, string>)

                    token = cookies[COOKIE_NAME];
                }
            }

            const jwtSecret = JWT_SECRET;

            if(!jwtSecret) {
                return Response.json(
                    { error: "Server misconfiguration" },
                    { status: 500 }
                );
            }

            if (!token) {
                throw new Error("No token provided");
            }

            const decoded = await jose.jwtVerify(
                token,
                new TextEncoder().encode(jwtSecret)
            );

            return await handler(req, decoded.payload as AuthUser);
        } catch (error) {
            if (error instanceof jose.errors.JWTExpired) {
                console.error("Token expired:", error.reason);
                return Response.json({ error: "Token expired" }, { status: 401 });
            } else if (error instanceof jose.errors.JWTInvalid) {
                console.error("Invalid token:", error.message);
                return Response.json({ error: "Invalid token" }, { status: 401 });
            } else {
                console.error("Auth error:", error);
                return Response.json(
                    { error: "Authentication failed" },
                    { status: 500 }
                );
            }
        }
    }
}

