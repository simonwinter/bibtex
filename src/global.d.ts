declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BIB_FILE_URL?: string
    }
  }
}

export {}
