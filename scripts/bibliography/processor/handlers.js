import { DoiAPI } from "@/doiAPI";
import { Utils } from "@/utils";
class BaseHandler {
    next;
    setNext(handler) {
        this.next = handler;
        return handler;
    }
    async handle(context, result, mutated) {
        if (this.next) {
            return await this.next.handle(context, result, mutated ?? { ...result });
        }
        return mutated ?? { ...result };
    }
}
export class TitleHandler extends BaseHandler {
    async handle(context, result, mutated) {
        const copiedOutput = mutated ?? { ...result };
        if ('title' in context.fields) {
            copiedOutput.title = context.fields.title.map(({ text, marks }) => this.processMarks(text, marks)).join();
        }
        return await super.handle(context, result, copiedOutput);
    }
    processMarks(text, marks) {
        if (!marks) {
            return text;
        }
        return marks.reduce((acc, current) => {
            const { link, type } = current;
            switch (type) {
                case 'bold':
                    return `<strong>${acc}</strong>`;
                case 'code':
                    return `<code>${acc}</code>`;
                case 'italic':
                    return `<em>${acc}</em>`;
                case 'link':
                    return link ? `<a href="${link}" target="_blank">${acc}</a>` : acc;
                case 'subscript':
                    return `<sub>${acc}</sub>`;
                case 'superscript':
                    return `<sup>${acc}</sup>`;
                case 'underline':
                    return `<u>${acc}</u>`;
                default:
                    return acc;
            }
            return acc;
        }, text);
    }
}
export class DOIHandler extends BaseHandler {
    async handle(context, result, mutated) {
        const copiedOutput = mutated ?? { ...result };
        let { start, interval, doiAPI, limit } = context;
        if ('doi' in context.fields) {
            const doi = context.fields['doi'].replace(/https?\:\/\/(\w+\.)?doi\.org\//, '');
            // check we're within the rate limit, else delay
            const now = new Date().getTime();
            const diff = start - now;
            if (diff >= interval || ++context.count >= limit) {
                context.count = 0;
                start = new Date().getTime();
                await Utils.promiseDelay(interval);
            }
            try {
                const metaData = await doiAPI.fetchMetadataFromDOI(doi);
                const response = JSON.parse(metaData);
                copiedOutput['meta'] = response;
            }
            catch (err) {
            }
        }
        return super.handle(context, result, copiedOutput);
    }
}
//# sourceMappingURL=handlers.js.map