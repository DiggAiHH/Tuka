import { ParentAuthRecord } from './persistence';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const normalized = hex.trim().toLowerCase();
  if (normalized.length % 2 !== 0) throw new Error('Invalid hex');
  const out = new Uint8Array(normalized.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hash));
}

function randomSaltHex(byteLength = 16): string {
  const salt = new Uint8Array(byteLength);
  crypto.getRandomValues(salt);
  return bytesToHex(salt);
}

export async function createParentAuthRecord(username: string, password: string): Promise<ParentAuthRecord> {
  const cleanUser = username.trim();
  if (!cleanUser) throw new Error('Username required');
  if (!password) throw new Error('Password required');

  const salt = randomSaltHex(16);
  const passwordHashHex = await sha256Hex(`${salt}:${password}`);
  return {
    username: cleanUser,
    passwordSalt: salt,
    passwordHashHex
  };
}

export async function verifyParentCredentials(record: ParentAuthRecord, username: string, password: string): Promise<boolean> {
  try {
    const cleanUser = username.trim();
    if (cleanUser !== record.username) return false;
    const computed = await sha256Hex(`${record.passwordSalt}:${password}`);
    return computed === record.passwordHashHex;
  } catch {
    return false;
  }
}

export function isParentCryptoAvailable(): boolean {
  return typeof crypto !== 'undefined' && !!crypto.subtle && typeof crypto.getRandomValues === 'function';
}

export function maskUsername(username: string): string {
  if (!username) return '';
  if (username.length <= 2) return `${username[0]}*`;
  return `${username.slice(0, 2)}${'*'.repeat(Math.min(8, username.length - 2))}`;
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 6) return 'Bitte mindestens 6 Zeichen.';
  return null;
}

export function safeCompareHex(a: string, b: string): boolean {
  // Constant-time-ish compare (good enough for local UI)
  const aa = hexToBytes(a);
  const bb = hexToBytes(b);
  if (aa.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < aa.length; i++) diff |= aa[i] ^ bb[i];
  return diff === 0;
}
