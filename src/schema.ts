import { z } from 'zod'

const AwardSchema = z.object({
  DOI: z.string().optional(),
  name: z.string().optional(),
  'doi-asserted-by': z.string().optional(),
  award: z.array(z.string()).optional(),
})

const AuthorSchema = z.object({
  ORCID: z.string().optional(),
  'authenticated-orcid': z.boolean().optional(),
  given: z.string(),
  family: z.string(),
  sequence: z.string(),
  affiliation: z.array(
    z.object({
      name: z.string(),
    })
  ),
})

const DatePartsSchema = z.array(z.array(z.number().nullable()))

const IndexedSchema = z.object({
  'date-parts': DatePartsSchema,
  'date-time': z.string(),
  timestamp: z.number(),
})

const PublishedSchema = z.object({
  'date-parts': DatePartsSchema,
})

const JournalIssueSchema = z.object({
  issue: z.string(),
  'published-online': PublishedSchema.optional(),
  'published-print': PublishedSchema.optional(),
})

const AssertionSchema = z.object({
  group: z.object({
    name: z.string(),
    label: z.string().optional(),
  }).optional(),
  label: z.string().optional(),
  name: z.string(),
  order: z.number().optional(),
  value: z.string(),
})

const ResourceSchema = z.object({
  primary: z.object({
    URL: z.string(),
  }),
})

const ContentDomainSchema = z.object({
  domain: z.array(z.string()),
  'crossmark-restriction': z.boolean(),
})

const ReferenceSchema = z.object({
  key: z.string(),
  'doi-asserted-by': z.string().optional(),
  DOI: z.string().optional(),
  'volume-title': z.string().optional(),
  author: z.string().optional(),
  year: z.string().optional(),
  'first-page': z.string().optional(),
  volume: z.string().optional(),
  'journal-title': z.string().optional(),
  issue: z.string().optional(),
})

const MetaMessageSchema = z.object({
  'alternative-id': z.array(z.string()).optional(),
  assertion: z.array(AssertionSchema).optional(),
  author: z.array(AuthorSchema),
  'container-title': z.array(z.string()),
  'content-domain': ContentDomainSchema,
  created: z.object({
    'date-parts': DatePartsSchema,
    'date-time': z.string(),
    timestamp: z.number(),
  }),
  DOI: z.string(),
  deposited: z.object({
    'date-parts': DatePartsSchema,
    'date-time': z.string(),
    timestamp: z.number(),
  }),
  funder: z.array(AwardSchema).optional(),
  indexed: IndexedSchema,
  ISSN: z.array(z.string()).optional(),
  'issn-type': z.array(
    z.object({
      value: z.string(),
      type: z.string(),
    })
  ).optional(),
  issue: z.string().optional(),
  issued: z.object({
    'date-parts': DatePartsSchema.optional(),
  }),
  'is-referenced-by-count': z.number(),
  'journal-issue': JournalIssueSchema.optional(),
  language: z.string().optional(),
  link: z.array(
    z.object({
      URL: z.string(),
      'content-type': z.string(),
      'content-version': z.string(),
      'intended-application': z.string(),
    })
  ).optional(),
  member: z.string(),
  'original-title': z.array(z.string()),
  page: z.string().optional(),
  prefix: z.string(),
  'published-online': PublishedSchema.optional(),
  'published-print': PublishedSchema.optional(),
  published: PublishedSchema.optional(),
  publisher: z.string(),
  reference: z.array(ReferenceSchema).optional(),
  'reference-count': z.number(),
  'references-count': z.number(),
  relation: z.object({
    URL: z.string().url().optional(),
  }).optional(),
  resource: ResourceSchema,
  score: z.number(),
  'short-container-title': z.array(z.string()),
  'short-title': z.array(z.string()),
  source: z.string(),
  subject: z.array(z.string()),
  subtitle: z.array(z.string()),
  title: z.array(z.string()),
  'type': z.string(),
  'URL': z.string(),
  'update-policy': z.string().optional(),
  volume: z.string().optional(),
})

const FieldsSchema = z.object({
  date: z.string().optional(),
  title: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    })
  ).optional(),
  volume: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    })
  ).optional(),
  issn: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    })
  ).optional(),
  url: z.string().optional(),
  doi: z.string().optional(),
  shorttitle: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    })
  ).optional(),
  number: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    })
  ).optional(),
  journaltitle: z.array(
    z.object({
      type: z.string(),
      text: z.string(),
    })
  ).optional(),
  author: z.array(
    z.object({
      given: z.array(
        z.object({
          type: z.string(),
          text: z.string(),
        })
      ).optional(),
      family: z.array(
        z.object({
          type: z.string(),
          text: z.string(),
        })
      ).optional(),
    })
  ).optional(),
  urldate: z.string().optional(),
})

const ArticleSchema = z.object({
  id: z.string(),
  bib_type: z.string(),
  meta: z.object({
    status: z.string(),
    'message-type': z.string(),
    'message-version': z.string(),
    message: MetaMessageSchema,
  }).optional(),
  title: z.string().optional(),
  fields: FieldsSchema,
})

export { ArticleSchema, FieldsSchema }
