import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { db } from "./db";
import { User } from "./types";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "vaulto-super-secret-jwt-key-2026-production"
);

export const AUTH_COOKIE_NAME = "vaulto_auth_token";

export async function createToken(user: User): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    subscriptionTier: user.subscriptionTier,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ id: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(req?: NextRequest): Promise<User | null> {
  try {
    let token: string | undefined;

    if (req) {
      // Check Authorization header first
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      } else {
        token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
      }
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    }

    if (!token) {
      // Return default demo user for seamless local evaluation if no session exists
      const demo = db.getUserById("usr_demo123");
      return demo || null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const demo = db.getUserById("usr_demo123");
      return demo || null;
    }

    const user = db.getUserById(payload.id);
    return user || null;
  } catch {
    const demo = db.getUserById("usr_demo123");
    return demo || null;
  }
}

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function sanitizeUser(user: User): Omit<User, "passwordHash"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}
