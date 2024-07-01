import { z } from "zod";
declare const ArticleSchema: z.ZodObject<{
    id: z.ZodString;
    bib_type: z.ZodString;
    meta: z.ZodObject<{
        status: z.ZodString;
        "message-type": z.ZodString;
        "message-version": z.ZodString;
        message: z.ZodObject<{
            indexed: z.ZodObject<{
                "date-parts": z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
                "date-time": z.ZodString;
                timestamp: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            }, {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            }>;
            "reference-count": z.ZodNumber;
            publisher: z.ZodString;
            issue: z.ZodString;
            funder: z.ZodArray<z.ZodObject<{
                DOI: z.ZodOptional<z.ZodString>;
                name: z.ZodString;
                "doi-asserted-by": z.ZodOptional<z.ZodString>;
                award: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                award?: string[] | undefined;
            }, {
                name: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                award?: string[] | undefined;
            }>, "many">;
            "content-domain": z.ZodObject<{
                domain: z.ZodArray<z.ZodString, "many">;
                "crossmark-restriction": z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                domain: string[];
                "crossmark-restriction": boolean;
            }, {
                domain: string[];
                "crossmark-restriction": boolean;
            }>;
            "short-container-title": z.ZodArray<z.ZodString, "many">;
            "published-print": z.ZodObject<{
                "date-parts": z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
            }, "strip", z.ZodTypeAny, {
                "date-parts": number[][];
            }, {
                "date-parts": number[][];
            }>;
            DOI: z.ZodString;
            type: z.ZodString;
            created: z.ZodObject<{
                "date-parts": z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
                "date-time": z.ZodString;
                timestamp: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            }, {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            }>;
            page: z.ZodString;
            "update-policy": z.ZodString;
            source: z.ZodString;
            "is-referenced-by-count": z.ZodNumber;
            title: z.ZodArray<z.ZodString, "many">;
            prefix: z.ZodString;
            volume: z.ZodString;
            author: z.ZodArray<z.ZodObject<{
                ORCID: z.ZodOptional<z.ZodString>;
                "authenticated-orcid": z.ZodOptional<z.ZodBoolean>;
                given: z.ZodString;
                family: z.ZodString;
                sequence: z.ZodString;
                affiliation: z.ZodArray<z.ZodObject<{
                    name: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                }, {
                    name: string;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                given: string;
                family: string;
                sequence: string;
                affiliation: {
                    name: string;
                }[];
                ORCID?: string | undefined;
                "authenticated-orcid"?: boolean | undefined;
            }, {
                given: string;
                family: string;
                sequence: string;
                affiliation: {
                    name: string;
                }[];
                ORCID?: string | undefined;
                "authenticated-orcid"?: boolean | undefined;
            }>, "many">;
            member: z.ZodString;
            "published-online": z.ZodObject<{
                "date-parts": z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
            }, "strip", z.ZodTypeAny, {
                "date-parts": number[][];
            }, {
                "date-parts": number[][];
            }>;
            reference: z.ZodArray<z.ZodObject<{
                key: z.ZodString;
                "doi-asserted-by": z.ZodOptional<z.ZodString>;
                DOI: z.ZodOptional<z.ZodString>;
                "volume-title": z.ZodOptional<z.ZodString>;
                author: z.ZodOptional<z.ZodString>;
                year: z.ZodOptional<z.ZodString>;
                "first-page": z.ZodOptional<z.ZodString>;
                volume: z.ZodOptional<z.ZodString>;
                "journal-title": z.ZodOptional<z.ZodString>;
                issue: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                key: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                issue?: string | undefined;
                "volume-title"?: string | undefined;
                author?: string | undefined;
                year?: string | undefined;
                "first-page"?: string | undefined;
                volume?: string | undefined;
                "journal-title"?: string | undefined;
            }, {
                key: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                issue?: string | undefined;
                "volume-title"?: string | undefined;
                author?: string | undefined;
                year?: string | undefined;
                "first-page"?: string | undefined;
                volume?: string | undefined;
                "journal-title"?: string | undefined;
            }>, "many">;
            "container-title": z.ZodArray<z.ZodString, "many">;
            "original-title": z.ZodArray<z.ZodString, "many">;
            language: z.ZodString;
            link: z.ZodArray<z.ZodObject<{
                URL: z.ZodString;
                "content-type": z.ZodString;
                "content-version": z.ZodString;
                "intended-application": z.ZodString;
            }, "strip", z.ZodTypeAny, {
                URL: string;
                "content-type": string;
                "content-version": string;
                "intended-application": string;
            }, {
                URL: string;
                "content-type": string;
                "content-version": string;
                "intended-application": string;
            }>, "many">;
            deposited: z.ZodObject<{
                "date-parts": z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
                "date-time": z.ZodString;
                timestamp: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            }, {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            }>;
            score: z.ZodNumber;
            resource: z.ZodObject<{
                primary: z.ZodObject<{
                    URL: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    URL: string;
                }, {
                    URL: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                primary: {
                    URL: string;
                };
            }, {
                primary: {
                    URL: string;
                };
            }>;
            subtitle: z.ZodArray<z.ZodString, "many">;
            "short-title": z.ZodArray<z.ZodString, "many">;
            issued: z.ZodObject<{
                "date-parts": z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
            }, "strip", z.ZodTypeAny, {
                "date-parts": number[][];
            }, {
                "date-parts": number[][];
            }>;
            "references-count": z.ZodNumber;
            "journal-issue": z.ZodObject<{
                issue: z.ZodString;
                "published-online": z.ZodObject<{
                    "date-parts": z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
                }, "strip", z.ZodTypeAny, {
                    "date-parts": number[][];
                }, {
                    "date-parts": number[][];
                }>;
                "published-print": z.ZodObject<{
                    "date-parts": z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
                }, "strip", z.ZodTypeAny, {
                    "date-parts": number[][];
                }, {
                    "date-parts": number[][];
                }>;
            }, "strip", z.ZodTypeAny, {
                issue: string;
                "published-online": {
                    "date-parts": number[][];
                };
                "published-print": {
                    "date-parts": number[][];
                };
            }, {
                issue: string;
                "published-online": {
                    "date-parts": number[][];
                };
                "published-print": {
                    "date-parts": number[][];
                };
            }>;
            "alternative-id": z.ZodArray<z.ZodString, "many">;
            URL: z.ZodString;
            relation: z.ZodOptional<z.ZodObject<{
                URL: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                URL?: string | undefined;
            }, {
                URL?: string | undefined;
            }>>;
            ISSN: z.ZodArray<z.ZodString, "many">;
            "issn-type": z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                type: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
                value: string;
            }, {
                type: string;
                value: string;
            }>, "many">;
            subject: z.ZodArray<z.ZodString, "many">;
            published: z.ZodObject<{
                "date-parts": z.ZodArray<z.ZodArray<z.ZodNumber, "many">, "many">;
            }, "strip", z.ZodTypeAny, {
                "date-parts": number[][];
            }, {
                "date-parts": number[][];
            }>;
            assertion: z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                order: z.ZodNumber;
                name: z.ZodString;
                label: z.ZodString;
                group: z.ZodOptional<z.ZodObject<{
                    name: z.ZodString;
                    label: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    name: string;
                    label: string;
                }, {
                    name: string;
                    label: string;
                }>>;
            }, "strip", z.ZodTypeAny, {
                name: string;
                value: string;
                order: number;
                label: string;
                group?: {
                    name: string;
                    label: string;
                } | undefined;
            }, {
                name: string;
                value: string;
                order: number;
                label: string;
                group?: {
                    name: string;
                    label: string;
                } | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            link: {
                URL: string;
                "content-type": string;
                "content-version": string;
                "intended-application": string;
            }[];
            DOI: string;
            type: string;
            issue: string;
            "published-online": {
                "date-parts": number[][];
            };
            "published-print": {
                "date-parts": number[][];
            };
            URL: string;
            author: {
                given: string;
                family: string;
                sequence: string;
                affiliation: {
                    name: string;
                }[];
                ORCID?: string | undefined;
                "authenticated-orcid"?: boolean | undefined;
            }[];
            volume: string;
            indexed: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            "reference-count": number;
            publisher: string;
            funder: {
                name: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                award?: string[] | undefined;
            }[];
            "content-domain": {
                domain: string[];
                "crossmark-restriction": boolean;
            };
            "short-container-title": string[];
            created: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            page: string;
            "update-policy": string;
            source: string;
            "is-referenced-by-count": number;
            title: string[];
            prefix: string;
            member: string;
            reference: {
                key: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                issue?: string | undefined;
                "volume-title"?: string | undefined;
                author?: string | undefined;
                year?: string | undefined;
                "first-page"?: string | undefined;
                volume?: string | undefined;
                "journal-title"?: string | undefined;
            }[];
            "container-title": string[];
            "original-title": string[];
            language: string;
            deposited: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            score: number;
            resource: {
                primary: {
                    URL: string;
                };
            };
            subtitle: string[];
            "short-title": string[];
            issued: {
                "date-parts": number[][];
            };
            "references-count": number;
            "journal-issue": {
                issue: string;
                "published-online": {
                    "date-parts": number[][];
                };
                "published-print": {
                    "date-parts": number[][];
                };
            };
            "alternative-id": string[];
            ISSN: string[];
            "issn-type": {
                type: string;
                value: string;
            }[];
            subject: string[];
            published: {
                "date-parts": number[][];
            };
            assertion: {
                name: string;
                value: string;
                order: number;
                label: string;
                group?: {
                    name: string;
                    label: string;
                } | undefined;
            }[];
            relation?: {
                URL?: string | undefined;
            } | undefined;
        }, {
            link: {
                URL: string;
                "content-type": string;
                "content-version": string;
                "intended-application": string;
            }[];
            DOI: string;
            type: string;
            issue: string;
            "published-online": {
                "date-parts": number[][];
            };
            "published-print": {
                "date-parts": number[][];
            };
            URL: string;
            author: {
                given: string;
                family: string;
                sequence: string;
                affiliation: {
                    name: string;
                }[];
                ORCID?: string | undefined;
                "authenticated-orcid"?: boolean | undefined;
            }[];
            volume: string;
            indexed: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            "reference-count": number;
            publisher: string;
            funder: {
                name: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                award?: string[] | undefined;
            }[];
            "content-domain": {
                domain: string[];
                "crossmark-restriction": boolean;
            };
            "short-container-title": string[];
            created: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            page: string;
            "update-policy": string;
            source: string;
            "is-referenced-by-count": number;
            title: string[];
            prefix: string;
            member: string;
            reference: {
                key: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                issue?: string | undefined;
                "volume-title"?: string | undefined;
                author?: string | undefined;
                year?: string | undefined;
                "first-page"?: string | undefined;
                volume?: string | undefined;
                "journal-title"?: string | undefined;
            }[];
            "container-title": string[];
            "original-title": string[];
            language: string;
            deposited: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            score: number;
            resource: {
                primary: {
                    URL: string;
                };
            };
            subtitle: string[];
            "short-title": string[];
            issued: {
                "date-parts": number[][];
            };
            "references-count": number;
            "journal-issue": {
                issue: string;
                "published-online": {
                    "date-parts": number[][];
                };
                "published-print": {
                    "date-parts": number[][];
                };
            };
            "alternative-id": string[];
            ISSN: string[];
            "issn-type": {
                type: string;
                value: string;
            }[];
            subject: string[];
            published: {
                "date-parts": number[][];
            };
            assertion: {
                name: string;
                value: string;
                order: number;
                label: string;
                group?: {
                    name: string;
                    label: string;
                } | undefined;
            }[];
            relation?: {
                URL?: string | undefined;
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        message: {
            link: {
                URL: string;
                "content-type": string;
                "content-version": string;
                "intended-application": string;
            }[];
            DOI: string;
            type: string;
            issue: string;
            "published-online": {
                "date-parts": number[][];
            };
            "published-print": {
                "date-parts": number[][];
            };
            URL: string;
            author: {
                given: string;
                family: string;
                sequence: string;
                affiliation: {
                    name: string;
                }[];
                ORCID?: string | undefined;
                "authenticated-orcid"?: boolean | undefined;
            }[];
            volume: string;
            indexed: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            "reference-count": number;
            publisher: string;
            funder: {
                name: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                award?: string[] | undefined;
            }[];
            "content-domain": {
                domain: string[];
                "crossmark-restriction": boolean;
            };
            "short-container-title": string[];
            created: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            page: string;
            "update-policy": string;
            source: string;
            "is-referenced-by-count": number;
            title: string[];
            prefix: string;
            member: string;
            reference: {
                key: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                issue?: string | undefined;
                "volume-title"?: string | undefined;
                author?: string | undefined;
                year?: string | undefined;
                "first-page"?: string | undefined;
                volume?: string | undefined;
                "journal-title"?: string | undefined;
            }[];
            "container-title": string[];
            "original-title": string[];
            language: string;
            deposited: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            score: number;
            resource: {
                primary: {
                    URL: string;
                };
            };
            subtitle: string[];
            "short-title": string[];
            issued: {
                "date-parts": number[][];
            };
            "references-count": number;
            "journal-issue": {
                issue: string;
                "published-online": {
                    "date-parts": number[][];
                };
                "published-print": {
                    "date-parts": number[][];
                };
            };
            "alternative-id": string[];
            ISSN: string[];
            "issn-type": {
                type: string;
                value: string;
            }[];
            subject: string[];
            published: {
                "date-parts": number[][];
            };
            assertion: {
                name: string;
                value: string;
                order: number;
                label: string;
                group?: {
                    name: string;
                    label: string;
                } | undefined;
            }[];
            relation?: {
                URL?: string | undefined;
            } | undefined;
        };
        status: string;
        "message-type": string;
        "message-version": string;
    }, {
        message: {
            link: {
                URL: string;
                "content-type": string;
                "content-version": string;
                "intended-application": string;
            }[];
            DOI: string;
            type: string;
            issue: string;
            "published-online": {
                "date-parts": number[][];
            };
            "published-print": {
                "date-parts": number[][];
            };
            URL: string;
            author: {
                given: string;
                family: string;
                sequence: string;
                affiliation: {
                    name: string;
                }[];
                ORCID?: string | undefined;
                "authenticated-orcid"?: boolean | undefined;
            }[];
            volume: string;
            indexed: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            "reference-count": number;
            publisher: string;
            funder: {
                name: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                award?: string[] | undefined;
            }[];
            "content-domain": {
                domain: string[];
                "crossmark-restriction": boolean;
            };
            "short-container-title": string[];
            created: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            page: string;
            "update-policy": string;
            source: string;
            "is-referenced-by-count": number;
            title: string[];
            prefix: string;
            member: string;
            reference: {
                key: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                issue?: string | undefined;
                "volume-title"?: string | undefined;
                author?: string | undefined;
                year?: string | undefined;
                "first-page"?: string | undefined;
                volume?: string | undefined;
                "journal-title"?: string | undefined;
            }[];
            "container-title": string[];
            "original-title": string[];
            language: string;
            deposited: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            score: number;
            resource: {
                primary: {
                    URL: string;
                };
            };
            subtitle: string[];
            "short-title": string[];
            issued: {
                "date-parts": number[][];
            };
            "references-count": number;
            "journal-issue": {
                issue: string;
                "published-online": {
                    "date-parts": number[][];
                };
                "published-print": {
                    "date-parts": number[][];
                };
            };
            "alternative-id": string[];
            ISSN: string[];
            "issn-type": {
                type: string;
                value: string;
            }[];
            subject: string[];
            published: {
                "date-parts": number[][];
            };
            assertion: {
                name: string;
                value: string;
                order: number;
                label: string;
                group?: {
                    name: string;
                    label: string;
                } | undefined;
            }[];
            relation?: {
                URL?: string | undefined;
            } | undefined;
        };
        status: string;
        "message-type": string;
        "message-version": string;
    }>;
    title: z.ZodString;
    fields: z.ZodObject<{
        date: z.ZodString;
        title: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            text: string;
        }, {
            type: string;
            text: string;
        }>, "many">;
        volume: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            text: string;
        }, {
            type: string;
            text: string;
        }>, "many">;
        issn: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            text: string;
        }, {
            type: string;
            text: string;
        }>, "many">;
        url: z.ZodString;
        doi: z.ZodString;
        shorttitle: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            text: string;
        }, {
            type: string;
            text: string;
        }>, "many">;
        number: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            text: string;
        }, {
            type: string;
            text: string;
        }>, "many">;
        journaltitle: z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
            text: string;
        }, {
            type: string;
            text: string;
        }>, "many">;
        author: z.ZodArray<z.ZodObject<{
            given: z.ZodArray<z.ZodObject<{
                type: z.ZodString;
                text: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
                text: string;
            }, {
                type: string;
                text: string;
            }>, "many">;
            family: z.ZodArray<z.ZodObject<{
                type: z.ZodString;
                text: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
                text: string;
            }, {
                type: string;
                text: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            given: {
                type: string;
                text: string;
            }[];
            family: {
                type: string;
                text: string;
            }[];
        }, {
            given: {
                type: string;
                text: string;
            }[];
            family: {
                type: string;
                text: string;
            }[];
        }>, "many">;
        urldate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        number: {
            type: string;
            text: string;
        }[];
        date: string;
        author: {
            given: {
                type: string;
                text: string;
            }[];
            family: {
                type: string;
                text: string;
            }[];
        }[];
        volume: {
            type: string;
            text: string;
        }[];
        title: {
            type: string;
            text: string;
        }[];
        issn: {
            type: string;
            text: string;
        }[];
        url: string;
        doi: string;
        shorttitle: {
            type: string;
            text: string;
        }[];
        journaltitle: {
            type: string;
            text: string;
        }[];
        urldate: string;
    }, {
        number: {
            type: string;
            text: string;
        }[];
        date: string;
        author: {
            given: {
                type: string;
                text: string;
            }[];
            family: {
                type: string;
                text: string;
            }[];
        }[];
        volume: {
            type: string;
            text: string;
        }[];
        title: {
            type: string;
            text: string;
        }[];
        issn: {
            type: string;
            text: string;
        }[];
        url: string;
        doi: string;
        shorttitle: {
            type: string;
            text: string;
        }[];
        journaltitle: {
            type: string;
            text: string;
        }[];
        urldate: string;
    }>;
}, "strip", z.ZodTypeAny, {
    bib_type: string;
    fields: {
        number: {
            type: string;
            text: string;
        }[];
        date: string;
        author: {
            given: {
                type: string;
                text: string;
            }[];
            family: {
                type: string;
                text: string;
            }[];
        }[];
        volume: {
            type: string;
            text: string;
        }[];
        title: {
            type: string;
            text: string;
        }[];
        issn: {
            type: string;
            text: string;
        }[];
        url: string;
        doi: string;
        shorttitle: {
            type: string;
            text: string;
        }[];
        journaltitle: {
            type: string;
            text: string;
        }[];
        urldate: string;
    };
    title: string;
    id: string;
    meta: {
        message: {
            link: {
                URL: string;
                "content-type": string;
                "content-version": string;
                "intended-application": string;
            }[];
            DOI: string;
            type: string;
            issue: string;
            "published-online": {
                "date-parts": number[][];
            };
            "published-print": {
                "date-parts": number[][];
            };
            URL: string;
            author: {
                given: string;
                family: string;
                sequence: string;
                affiliation: {
                    name: string;
                }[];
                ORCID?: string | undefined;
                "authenticated-orcid"?: boolean | undefined;
            }[];
            volume: string;
            indexed: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            "reference-count": number;
            publisher: string;
            funder: {
                name: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                award?: string[] | undefined;
            }[];
            "content-domain": {
                domain: string[];
                "crossmark-restriction": boolean;
            };
            "short-container-title": string[];
            created: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            page: string;
            "update-policy": string;
            source: string;
            "is-referenced-by-count": number;
            title: string[];
            prefix: string;
            member: string;
            reference: {
                key: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                issue?: string | undefined;
                "volume-title"?: string | undefined;
                author?: string | undefined;
                year?: string | undefined;
                "first-page"?: string | undefined;
                volume?: string | undefined;
                "journal-title"?: string | undefined;
            }[];
            "container-title": string[];
            "original-title": string[];
            language: string;
            deposited: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            score: number;
            resource: {
                primary: {
                    URL: string;
                };
            };
            subtitle: string[];
            "short-title": string[];
            issued: {
                "date-parts": number[][];
            };
            "references-count": number;
            "journal-issue": {
                issue: string;
                "published-online": {
                    "date-parts": number[][];
                };
                "published-print": {
                    "date-parts": number[][];
                };
            };
            "alternative-id": string[];
            ISSN: string[];
            "issn-type": {
                type: string;
                value: string;
            }[];
            subject: string[];
            published: {
                "date-parts": number[][];
            };
            assertion: {
                name: string;
                value: string;
                order: number;
                label: string;
                group?: {
                    name: string;
                    label: string;
                } | undefined;
            }[];
            relation?: {
                URL?: string | undefined;
            } | undefined;
        };
        status: string;
        "message-type": string;
        "message-version": string;
    };
}, {
    bib_type: string;
    fields: {
        number: {
            type: string;
            text: string;
        }[];
        date: string;
        author: {
            given: {
                type: string;
                text: string;
            }[];
            family: {
                type: string;
                text: string;
            }[];
        }[];
        volume: {
            type: string;
            text: string;
        }[];
        title: {
            type: string;
            text: string;
        }[];
        issn: {
            type: string;
            text: string;
        }[];
        url: string;
        doi: string;
        shorttitle: {
            type: string;
            text: string;
        }[];
        journaltitle: {
            type: string;
            text: string;
        }[];
        urldate: string;
    };
    title: string;
    id: string;
    meta: {
        message: {
            link: {
                URL: string;
                "content-type": string;
                "content-version": string;
                "intended-application": string;
            }[];
            DOI: string;
            type: string;
            issue: string;
            "published-online": {
                "date-parts": number[][];
            };
            "published-print": {
                "date-parts": number[][];
            };
            URL: string;
            author: {
                given: string;
                family: string;
                sequence: string;
                affiliation: {
                    name: string;
                }[];
                ORCID?: string | undefined;
                "authenticated-orcid"?: boolean | undefined;
            }[];
            volume: string;
            indexed: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            "reference-count": number;
            publisher: string;
            funder: {
                name: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                award?: string[] | undefined;
            }[];
            "content-domain": {
                domain: string[];
                "crossmark-restriction": boolean;
            };
            "short-container-title": string[];
            created: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            page: string;
            "update-policy": string;
            source: string;
            "is-referenced-by-count": number;
            title: string[];
            prefix: string;
            member: string;
            reference: {
                key: string;
                DOI?: string | undefined;
                "doi-asserted-by"?: string | undefined;
                issue?: string | undefined;
                "volume-title"?: string | undefined;
                author?: string | undefined;
                year?: string | undefined;
                "first-page"?: string | undefined;
                volume?: string | undefined;
                "journal-title"?: string | undefined;
            }[];
            "container-title": string[];
            "original-title": string[];
            language: string;
            deposited: {
                "date-parts": number[][];
                "date-time": string;
                timestamp: number;
            };
            score: number;
            resource: {
                primary: {
                    URL: string;
                };
            };
            subtitle: string[];
            "short-title": string[];
            issued: {
                "date-parts": number[][];
            };
            "references-count": number;
            "journal-issue": {
                issue: string;
                "published-online": {
                    "date-parts": number[][];
                };
                "published-print": {
                    "date-parts": number[][];
                };
            };
            "alternative-id": string[];
            ISSN: string[];
            "issn-type": {
                type: string;
                value: string;
            }[];
            subject: string[];
            published: {
                "date-parts": number[][];
            };
            assertion: {
                name: string;
                value: string;
                order: number;
                label: string;
                group?: {
                    name: string;
                    label: string;
                } | undefined;
            }[];
            relation?: {
                URL?: string | undefined;
            } | undefined;
        };
        status: string;
        "message-type": string;
        "message-version": string;
    };
}>;
export { ArticleSchema };
