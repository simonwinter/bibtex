import { BibLatexParser } from 'biblatex-csl-converter'
// import { BibliographyIO } from '@df-astro/bibliography/io'
import { DoiAPI } from '@df-astro/bibliography/doiAPI'
import { DOIHandler, TitleHandler, type Output } from '@df-astro/bibliography/handlers'
import { Logger } from '@df-astro/bibliography/log'
// import { BibFile } from '@df-astro/bibliography/commands/bib'

type Entries = ReturnType<BibLatexParser['parse']>['entries']
type EntryType = Entries[number]
type Grouped = {
  doi: EntryType[]
  noDoi: EntryType[]
}


const BIB_FILE = 'https://raw.githubusercontent.com/dragonfly-science/bibliography/master/dragonfly.bib'
const DOI_API_HEADERS = {
  'User-Agent': 'DragonflyBot/1.0 (https://www.dragonfly.co.nz; mailto:simon@dragonfly.co.nz)'
}

const RATE_LIMIT = 5 as const

const logger = new Logger('info')
// const localIO = new BibliographyIO(logger)
const doiAPI = new DoiAPI(logger, DOI_API_HEADERS)


// const readBibFile = async () => {
//   try {
//     const response = await localIO.downloadBibFile()
//     return response
//   } catch (error) {
//     logger.error(error)
//     return
//   }
// }

const processNonDoiEntries = (entries: EntryType[]) => {
  return entries.map((entry) => {
    const { entry_key, bib_type, fields: entry_fields } = entry
    const fields: Record<string, unknown> = JSON.parse(JSON.stringify(entry_fields))
    let initial = {
      id: entry_key,
      bib_type: bib_type,
      fields
    }

    const titleHander = new TitleHandler()

    return titleHander.handle(fields, initial)
  })
}

const fetchData = async (entries: EntryType[], interval: number, limit: number) => {
  const promises = entries.map((entry) => {
    const { entry_key, bib_type, fields: entry_fields } = entry
    const fields: Record<string, unknown> = JSON.parse(JSON.stringify(entry_fields))

    let initial: Output = {
      id: entry_key,
      bib_type: bib_type,
      fields
    }

    return async () => {
      const titleHander = new TitleHandler()
      const doiHandler = new DOIHandler(logger)

      let result = titleHander.handle(fields, initial)

      return await doiHandler.handle({
        fields,
        doiAPI
      }, result)
    }
  })

  return await doiAPI.throttlePromises(promises, interval, limit)
}

const groupEntries = (bibEntries: Entries) => {
  const entries = Object.entries(bibEntries).map(([, entry]) => entry)

  return entries.reduce<Grouped>((acc, entry) => {
      if (entry.fields.doi) {
        acc.doi.push(entry)
      } else {
        acc.noDoi.push(entry)
      }

      return acc
    }, { doi: [], noDoi: []})
}

const parseBibTex = async () => {
  // console.log('parsing....')
  // const input = await readBibFile()
  // const bibFile = new BibFile(localIO, logger)
  // try {
  //   bibFile.download().then(async (f) => {
  //     try {
  //       f.parse()
  //       await f.save()
  //     } catch(e) {
  //       logger.error((e as Error).message)
  //     }
  //   })
  // } catch(e) {
  //   logger.error((e as Error).message)
  // }
}

(async () => {
  await parseBibTex()
})()