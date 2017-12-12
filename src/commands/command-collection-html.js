'use babel'

import {CommandCollection} from './command-collection'

/**
 * Commands used for language-html
 *
 * @extends CommandCollection
 */
export class CommandCollectionHTML extends CommandCollection {
  constructor () {
    super()
    this.setTarget('atom-text-editor[data-grammar~="html"]')
  }
}
