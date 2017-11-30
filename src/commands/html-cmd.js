'use babel'

import {CommandSet} from './abstract'

/**
 * Commands used for language-html
 *
 * @extends CommandSet
 */
export class HTMLCommands extends CommandSet {
  constructor () {
    super()
    this.t = 'atom-text-editor[data-grammar~="html"]'
  }
}
