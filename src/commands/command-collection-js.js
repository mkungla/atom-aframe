'use babel'

import {CommandCollection} from './command-collection'

/**
 * Commands used for language-js
 *
 * @extends CommandCollection
 */
export class CommandCollectionJS extends CommandCollection {
  constructor () {
    super()
    this.setTarget('atom-text-editor[data-grammar~="javascript"]')
  }
}
