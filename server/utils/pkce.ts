import { randomBytes, createHash } from 'node:crypto'

export const generateRandomString = (length = 64) =>
  randomBytes(length).toString('base64url').slice(0, length)

export const generateCodeChallenge = (verifier: string) =>
  createHash('sha256').update(verifier).digest('base64url')
