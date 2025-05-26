function getEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

export const env = {
  databaseUrl:        getEnv('DATABASE_URL'),
  jwtSecret:          getEnv('JWT_SECRET'),
  apiBaseUrl:         getEnv('NEXT_PUBLIC_API_BASE_URL'),
}
