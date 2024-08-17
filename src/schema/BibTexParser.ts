import { z } from 'zod'

const textType = z.object({
  type: z.string(),
  text: z.string(),
  marks: z.array(z.object({ type: z.string() })).optional(),
})

const literalType = z.object({
  literal: z.array(textType)
})

const nameType = z.union([
  z.object({
    given: z.array(textType),
    family: z.array(textType),
    prefix: z.array(textType).optional(),
    useprefix: z.boolean().optional(),
  }),
  literalType
])


const pagesType = z.array(z.array(z.array(textType)))

const fieldsType = z.object({
  author: z.array(nameType).optional(),
  title: z.array(textType).optional(),
  journaltitle: z.array(textType).optional(),
  volume: z.array(textType).optional(),
  number: z.array(textType).optional(),
  pages: pagesType.optional(),
  date: z.string().optional(),
  url: z.string().optional(),
  doi: z.string().optional(),
  issn: z.array(textType).optional(),
  keywords: z.array(z.string()).optional(),
  abstract: z.array(textType).optional(),
  publisher: z.array(z.array(textType)).optional(),
  note: z.array(textType).optional(),
  edition: z.array(textType).optional(),
  institution: z.array(z.union([z.array(textType), textType])).optional(),
  series: z.array(textType).optional(),
  address: z.array(textType).optional(),
  chapter: z.array(textType).optional(),
})

const unexpectedFields = z.record(z.string(), z.union([
  z.array(textType),
  z.array(z.array(textType)),
  z.array(z.array(z.array(textType))),
  z.string(),
  textType
]))

const entrySchema = z.object({
  bib_type: z.string(),
  entry_key: z.string(),
  fields: fieldsType,
  unknown_fields: z.record(z.string(), z.array(textType)).optional(),
  unexpected_fields: unexpectedFields.optional()
})

const schema = z.object({
  entries: z.record(z.string(), entrySchema),
})

export type BibTexParser = z.infer<typeof schema>

export default schema