'use babel'

import { shell } from 'electron'

export const workspaceCommandNames = [
  'atom-aframe:open-documentation',
  'atom-aframe:open-website',
  'atom-aframe:open-github',
  'atom-aframe:open-settings'
]

export class WorkspaceCommands {
  static openDocumentation () {
    return atom.commands.add(
      'atom-workspace',
      'atom-aframe:open-documentation',
      () => {
        const url =
          atom.config.get('atom-aframe.devel.docsBaseURL') ||
          'https://aframe.io/docs'
        shell.openExternal(`${url}/master/introduction/`)
      }
    )
  }

  static openWebsite () {
    return atom.commands.add(
      'atom-workspace',
      'atom-aframe:open-website',
      () => {
        const url =
          atom.config.get('atom-aframe.devel.website') || 'https://aframe.io'
        shell.openExternal(url)
      }
    )
  }

  static openGithub () {
    return atom.commands.add(
      'atom-workspace',
      'atom-aframe:open-github',
      () => {
        const url =
          atom.config.get('atom-aframe.devel.github') ||
          'https://github.com/aframevr/aframe'
        shell.openExternal(url)
      }
    )
  }

  static openSettings () {
    return atom.commands.add(
      'atom-workspace',
      'atom-aframe:open-settings',
      () => {
        atom.workspace.open('atom://config/packages/atom-aframe')
      }
    )
  }
}
