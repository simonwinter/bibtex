import { z } from "zod";
const AwardSchema = z.object({
    DOI: z.string().optional(),
    name: z.string(),
    "doi-asserted-by": z.string().optional(),
    award: z.array(z.string()).optional(),
});
const AuthorSchema = z.object({
    ORCID: z.string().optional(),
    "authenticated-orcid": z.boolean().optional(),
    given: z.string(),
    family: z.string(),
    sequence: z.string(),
    affiliation: z.array(z.object({
        name: z.string(),
    })),
});
const DatePartsSchema = z.array(z.array(z.number()));
const IndexedSchema = z.object({
    "date-parts": DatePartsSchema,
    "date-time": z.string(),
    timestamp: z.number(),
});
const PublishedSchema = z.object({
    "date-parts": DatePartsSchema,
});
const JournalIssueSchema = z.object({
    issue: z.string(),
    "published-online": PublishedSchema,
    "published-print": PublishedSchema,
});
const AssertionSchema = z.object({
    value: z.string(),
    order: z.number(),
    name: z.string(),
    label: z.string(),
    group: z.object({
        name: z.string(),
        label: z.string(),
    }).optional(),
});
const ResourceSchema = z.object({
    primary: z.object({
        URL: z.string(),
    }),
});
const ContentDomainSchema = z.object({
    domain: z.array(z.string()),
    "crossmark-restriction": z.boolean(),
});
const ReferenceSchema = z.object({
    key: z.string(),
    "doi-asserted-by": z.string().optional(),
    DOI: z.string().optional(),
    "volume-title": z.string().optional(),
    author: z.string().optional(),
    year: z.string().optional(),
    "first-page": z.string().optional(),
    volume: z.string().optional(),
    "journal-title": z.string().optional(),
    issue: z.string().optional(),
});
const MetaMessageSchema = z.object({
    indexed: IndexedSchema,
    "reference-count": z.number(),
    publisher: z.string(),
    issue: z.string(),
    funder: z.array(AwardSchema),
    "content-domain": ContentDomainSchema,
    "short-container-title": z.array(z.string()),
    "published-print": PublishedSchema,
    DOI: z.string(),
    "type": z.string(),
    created: z.object({
        "date-parts": DatePartsSchema,
        "date-time": z.string(),
        timestamp: z.number(),
    }),
    page: z.string(),
    "update-policy": z.string(),
    source: z.string(),
    "is-referenced-by-count": z.number(),
    title: z.array(z.string()),
    prefix: z.string(),
    volume: z.string(),
    author: z.array(AuthorSchema),
    member: z.string(),
    "published-online": PublishedSchema,
    reference: z.array(ReferenceSchema),
    "container-title": z.array(z.string()),
    "original-title": z.array(z.string()),
    language: z.string(),
    link: z.array(z.object({
        URL: z.string(),
        "content-type": z.string(),
        "content-version": z.string(),
        "intended-application": z.string(),
    })),
    deposited: z.object({
        "date-parts": DatePartsSchema,
        "date-time": z.string(),
        timestamp: z.number(),
    }),
    score: z.number(),
    resource: ResourceSchema,
    subtitle: z.array(z.string()),
    "short-title": z.array(z.string()),
    issued: z.object({
        "date-parts": DatePartsSchema,
    }),
    "references-count": z.number(),
    "journal-issue": JournalIssueSchema,
    "alternative-id": z.array(z.string()),
    "URL": z.string(),
    relation: z.object({
        URL: z.string().url().optional(),
    }).optional(),
    ISSN: z.array(z.string()),
    "issn-type": z.array(z.object({
        value: z.string(),
        type: z.string(),
    })),
    subject: z.array(z.string()),
    published: PublishedSchema,
    assertion: z.array(AssertionSchema),
});
const FieldsSchema = z.object({
    date: z.string(),
    title: z.array(z.object({
        type: z.string(),
        text: z.string(),
    })),
    volume: z.array(z.object({
        type: z.string(),
        text: z.string(),
    })),
    issn: z.array(z.object({
        type: z.string(),
        text: z.string(),
    })),
    url: z.string(),
    doi: z.string(),
    shorttitle: z.array(z.object({
        type: z.string(),
        text: z.string(),
    })),
    number: z.array(z.object({
        type: z.string(),
        text: z.string(),
    })),
    journaltitle: z.array(z.object({
        type: z.string(),
        text: z.string(),
    })),
    author: z.array(z.object({
        given: z.array(z.object({
            type: z.string(),
            text: z.string(),
        })),
        family: z.array(z.object({
            type: z.string(),
            text: z.string(),
        })),
    })),
    urldate: z.string(),
});
const ArticleSchema = z.object({
    id: z.string(),
    bib_type: z.string(),
    meta: z.object({
        status: z.string(),
        "message-type": z.string(),
        "message-version": z.string(),
        message: MetaMessageSchema,
    }),
    title: z.string(),
    fields: FieldsSchema,
});
export { ArticleSchema };
//# sourceMappingURL=schema.js.map