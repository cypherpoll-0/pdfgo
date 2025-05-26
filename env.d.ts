declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    JWT_SECRET: string
    NEXT_PUBLIC_API_BASE_URL: string
  }
}

export {}
