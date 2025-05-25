// src/lib/env.ts
function getEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

// Typed single source of truth
export const env = {
  databaseUrl:        getEnv('DATABASE_URL'),
  jwtSecret:          getEnv('JWT_SECRET'),
  apiBaseUrl:         getEnv('NEXT_PUBLIC_API_BASE_URL'),
}
