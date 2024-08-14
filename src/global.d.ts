declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BIBLIOGRAPHY_FILE_URL?: string
    }
  }
}

export {}
