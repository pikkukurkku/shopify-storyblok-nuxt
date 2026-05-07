import { randomBytes, createHash } from 'node:crypto'

export const generateRandomString = () =>
  randomBytes(32).toString('base64url')

export const generateCodeChallenge = (verifier: string) =>
  createHash('sha256').update(verifier).digest('base64url')
