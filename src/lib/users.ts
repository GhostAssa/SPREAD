import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { PublicUser, User } from "@/lib/types";

function toUser(row: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  walletBalanceNaira: number;
  subscribed: boolean;
  sessionVersion: number;
  createdAt: string;
}): User {
  return row;
}

export async function getUsers(): Promise<User[]> {
  const rows = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toUser);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({ where: { id } });
  return row ? toUser(row) : undefined;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  return row ? toUser(row) : undefined;
}

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function createPasswordHash(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${hashPassword(password, salt)}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = hashPassword(password, salt);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const row = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: createPasswordHash(input.password),
      walletBalanceNaira: 0,
      subscribed: false,
      sessionVersion: 1,
      createdAt: new Date().toISOString(),
    },
  });
  return toUser(row);
}

export async function updateUser(id: string, patch: Partial<User>): Promise<User | undefined> {
  try {
    const row = await prisma.user.update({ where: { id }, data: patch });
    return toUser(row);
  } catch {
    return undefined;
  }
}

export async function creditWallet(id: string, amountNaira: number): Promise<User | undefined> {
  const user = await getUserById(id);
  if (!user) return undefined;
  return updateUser(id, { walletBalanceNaira: user.walletBalanceNaira + amountNaira });
}
