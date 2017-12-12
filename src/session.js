'use babel'

/**
 * Session will hold information which we want to preserve within user sessions
 */
export default class Session {
  /**
   * Constructor will receive deserialized object from previous session of atom
   *
   * @param  {State} state prev state
   */
  constructor (state) {
    this.isAframeProject = state.isAframeProject || false
  }
}
