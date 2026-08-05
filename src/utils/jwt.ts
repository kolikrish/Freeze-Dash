
import jwt, { Secret } from "jsonwebtoken";
import { cookies } from "next/headers";
const JWT_SECRET: Secret = process.env.JWT_SECRET || "dev_secret"; 
// ⚠️ Use a strong secret in production, store in .env

interface JwtPayload {
  playerId: string;
  gameId: string;
  name?: string;
}

/**
 * Sign a JWT for a player
 */
export function signJwt(payload: JwtPayload): string {
  const options: jwt.SignOptions = { expiresIn:  60 * 60 *1000 };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify a JWT and return payload
 * 
 */
export async function verifyJwt(): Promise<JwtPayload | null> {
  try {
    const cookiestore = await cookies();
    const token = cookiestore.get("token")?.value;
    if (!token) throw new Error("No token found");
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
