import { gcm } from '@noble/ciphers/aes.js';
import { bytesToHex, bytesToUtf8, concatBytes, hexToBytes, randomBytes, utf8ToBytes } from '@noble/ciphers/utils.js';
import { sha256 } from '@noble/hashes/sha2.js';

/** Versioned payload prefix. Legacy CryptoJS OpenSSL blobs are not decryptable. */
const PREFIX = 'gc1.';

const deriveKey = (): Uint8Array => {
  const runtimeConfig = useRuntimeConfig();
  return sha256(utf8ToBytes(String(runtimeConfig.public.cookieKey)));
};

const toPayloadString = (value: unknown): string => {
  if (value == null) return '';
  if (Array.isArray(value)) return toPayloadString(value[0]);
  return typeof value === 'string' ? value : String(value);
};

/**
 * Obfuscates a value for cookies / query params (cookieKey is public runtime config).
 */
export const encrypt = (value: unknown): string => {
  const iv = randomBytes(12);
  const ciphertext = gcm(deriveKey(), iv)
    .encrypt(utf8ToBytes(JSON.stringify(value)));
  return `${PREFIX}${bytesToHex(concatBytes(iv, ciphertext))}`;
};

/**
 * Decrypts a `gc1.` payload. Returns '' for missing/legacy/invalid values so callers can fall back.
 */
export const decrypt = (value: unknown): string => {
  const payload = toPayloadString(value);
  if (!payload.startsWith(PREFIX)) return '';

  try {
    const raw = hexToBytes(payload.slice(PREFIX.length));
    const iv = raw.slice(0, 12);
    const ciphertext = raw.slice(12);
    const plaintext = bytesToUtf8(gcm(deriveKey(), iv)
      .decrypt(ciphertext));
    const parsed = JSON.parse(plaintext) as unknown;
    return typeof parsed === 'string' ? parsed : String(parsed);
  } catch {
    return '';
  }
};
