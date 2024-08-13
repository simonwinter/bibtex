import { BibLatexParser } from "biblatex-csl-converter"

import { parentPort, workerData } from 'worker_threads'

const main = async () => {
  try {
    const parser = new BibLatexParser(workerData, {
        processUnexpected: true, 
        processUnknown: true,
        processComments: false,
        processInvalidURIs: true
      })
    const result = await parser.parseAsync()
    parentPort?.postMessage({ success: true, result });
  } catch (error) {
    parentPort?.postMessage({ success: false, error: (error as Error).message });
  }
}

main()