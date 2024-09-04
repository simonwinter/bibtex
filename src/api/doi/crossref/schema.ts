import { z } from "zod"

const rateLimit = z.object({
  'x-rate-limit-interval': z.string(),
  'x-rate-limit-limit': z.string()
})

type RateLimit = z.infer<typeof rateLimit>

export type {
  RateLimit
}

export { rateLimit }
