'use babel'

import {CommandSet} from './abstract'

/**
 * Commands used for language-js
 *
 * @extends CommandSet
 */
export class JSCommands extends CommandSet {
  constructor () {
    super()
    this.load = true
  }
}
