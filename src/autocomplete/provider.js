'use babel'

import APRIMITIVES from '../../data/primitives.json'
import AATTRIBUTES from '../../data/attributes.json'
import ACOMPONENTS from '../../data/components.json'

const tagPattern = /<([a-zA-Z][-a-zA-Z]*)(?:\s|$)/
const attributePattern = /\s+([a-zA-Z][-a-zA-Z]*)\s*=\s*$/

// Check are first char equal
const fce = (str1, str2) => str1[0].toLowerCase() === str2[0].toLowerCase()

/**
 * inspired by https://github.com/atom/autocomplete-html
 */
export class AutocompleteProvider {
  constructor () {
    // selector (required): Defines the scope selector(s) (can be comma-separated)
    // for which your provider should receive suggestion requests
    this.selector = '.text.html, .source.js'
    // disableForSelector (optional): Defines the scope selector(s)
    // (can be comma-separated) for which your provider should not be used
    this.disableForSelector = '.text.html .comment'
    // filterSuggestions (optional): If set to true, autocomplete+ will perform
    // fuzzy filtering and sorting on the list of matches returned by getSuggestions.
    this.filterSuggestions = true
    this.docVersion = null
    this.docsBaseURL = atom.config.get('atom-aframe.devel.docsBaseURL')
    // perhaps observe following 2
    this.attributeDefaults = atom.config.get('atom-aframe.project.attributeDefaults')
    this.componentDefaults = atom.config.get('atom-aframe.project.componentDefaults')

    this.currentVerDocs = `${this.docsBaseURL}/master`
    this.completions = {
      tags: APRIMITIVES,
      attributes: AATTRIBUTES,
      components: ACOMPONENTS
    }
  }

  /**
   * Set A-Frame version to use for docs
   *
   * @param {String} ver valid semver version string
   */
  setDocVersion (ver) {
    this.currentVerDocs = `${this.docsBaseURL}/${ver}`
    this.docVersion = ver
  }

  /**
   * getSuggestions (required): Is called when a suggestion request has been
   * dispatched by autocomplete+ to your provider. Return an array of suggestions
   * (if any) in the order you would like them displayed to the user.
   * Returning a Promise of an array of suggestions is also supported.
   *
   * An request object will be passed to your getSuggestions function,
   * with the following properties:
   *
   * editor: The current TextEditor
   * bufferPosition: The position of the cursor
   * scopeDescriptor: The scope descriptor for the current cursor position
   * prefix: The prefix for the word immediately preceding the current cursor position
   * activatedManually: Whether the autocomplete request was initiated by the user (e.g. with ctrl+space)
   */
  getSuggestions (request) {
    if (this.isComponentOrAttributeValueStart(request)) {
      return this.getComponentOrAttributeValueCompletions(request)
    } else if (this.isComponentOrAttributeStart(request)) {
      return this.getComponentOrAttributeNameCompletions(request)
    } else if (this.isTagOrPrimitive(request)) {
      return this.getTagCompletions(request)
    } else {
      return []
    }
  }

  /**
   * Check is current request for HTML tag
   *
   * @param  The Suggestion Request's Options Object
   * @return {Boolean}
   */
  isTagOrPrimitive ({prefix, scopeDescriptor, bufferPosition, editor}) {
    if (prefix.trim() && (prefix.indexOf('<') === -1)) {
      return this.hasTagScope(scopeDescriptor.getScopesArray())
    }
    prefix = editor.getTextInRange([[bufferPosition.row, bufferPosition.column - 1], bufferPosition])
    const scopes = scopeDescriptor.getScopesArray()
    return (prefix === '<') && (scopes[0] === 'text.html.basic') && (scopes.length === 1)
  }

  /**
   * Check for head or meta tag
   *
   * @param  {Object} scopes http://flight-manual.atom.io/behind-atom/sections/scoped-settings-scopes-and-scope-descriptors/#scope-descriptors
   * @return {Boolean}
   */
  hasTagScope (scopes) {
    for (let scope of Array.from(scopes)) {
      if (scope.startsWith('meta.tag.') && scope.endsWith('.html')) { return true }
    }
    return false
  }

  /**
   * Get Tag Completions for tags or primitives
   *
   * @param  {Object} The Suggestion Request's Options Object
   * @return {Object} completions
   */
  getTagCompletions ({prefix, editor, bufferPosition}) {
    // autocomplete-plus's default prefix setting does not capture <. Manually check for it.
    const ignorePrefix = editor.getTextInRange([[bufferPosition.row, bufferPosition.column - 1], bufferPosition]) === '<'

    const completions = []
    for (let tag in this.completions.tags) {
      const conf = this.completions.tags[tag]
      if (ignorePrefix || fce(tag, prefix)) {
        completions.push(this.buildTagCompletion(tag, conf))
      }
    }
    return completions
  }
  /**
   * Build Tag Completion entry
   *
   * @param  {String} tag
   * @param  {String} description
   * @return {Object}
   */
  buildTagCompletion (tag, conf) {
    return {
      text: tag,
      type: 'tag',
      leftLabel: 'A-Frame',
      description: conf.description != null ? conf.description : `primitive <${tag}>`,
      descriptionMoreURL: conf.url != null ? conf.url : this.getTagDocsURL(tag)
    }
  }

  /**
   * Greate docs url for tag/primitives
   *
   * @param  {String} tag/primitive
   * @return {String}     documentation url
   */
  getTagDocsURL (tag) {
    let url
    switch (tag) {
      case 'a-scene':
        url = `${this.currentVerDocs}/core/scene.html`
        break
      case 'a-entity':
        url = `${this.currentVerDocs}/core/entity.html`
        break
      case 'a-mixin':
        url = `${this.currentVerDocs}/core/mixins.html`
        break
      case 'a-assets' || 'a-asset-item':
        url = `${this.currentVerDocs}/core/asset-management-system.html`
        break
      case 'a-animation':
        url = `${this.currentVerDocs}/core/animations.html`
        break
      default:
        url = `${this.currentVerDocs}/primitives/${tag}.html`
    }
    return url
  }

  /**
   * Get component docs url
   *
   * @param  {String} component name
   * @return {String} url
   */
  getComponentDocsURL (component) {
    return `${this.currentVerDocs}/components/${component}.html`
  }

  /**
   * onDidInsertSuggestion
   *
   * @param  {Object} editor
   * @param  {Object} suggestion
   */
  onDidInsertSuggestion ({editor, suggestion}) {
    if (suggestion.type === 'attribute' || suggestion.type === 'component') {
      return setTimeout(this.triggerAutocomplete.bind(this, editor), 1)
    }
  }

  /**
   * triggerAutocomplete
   *
   * @param  {Object} editor
   */
  triggerAutocomplete (editor) {
    return atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate', {activatedManually: false})
  }

  /**
   * Get Previous tag name
   *
   * @param  {Object} editor
   * @param  {Object} bufferPosition The position of the cursor
   */
  getPreviousTag (editor, bufferPosition) {
    let {row} = bufferPosition
    while (row >= 0) {
      const tag = __guard__(tagPattern.exec(editor.lineTextForBufferRow(row)), x => x[1])
      if (tag) { return tag }
      row--
    }
  }

  /**
   * Component Or Attribute Value
   *
   * @param  {Object}  scopeDescriptor The scope descriptor for the current cursor position
   * @param  {Object}  bufferPosition  The position of the cursor
   * @param  {Object}  editor          The current TextEditor
   * @return {Boolean}                 If bufferPosition is at attr value
   */
  isComponentOrAttributeValueStart ({scopeDescriptor, bufferPosition, editor}) {
    const scopes = scopeDescriptor.getScopesArray()
    const previousBufferPosition = [bufferPosition.row, Math.max(0, bufferPosition.column - 1)]
    const previousScopes = editor.scopeDescriptorForBufferPosition(previousBufferPosition)
    const previousScopesArray = previousScopes.getScopesArray()
    return this.hasStringScope(scopes) && this.hasStringScope(previousScopesArray) &&
      (previousScopesArray.indexOf('punctuation.definition.string.end.html') === -1) &&
      this.hasTagScope(scopes) &&
      (this.getComponentOrAttribute(editor, bufferPosition) != null)
  }

  getComponentOrAttributeValueCompletions ({prefix, editor, bufferPosition}) {
    const completions = []
    return completions
  }

  /**
   * Check for previous attribute, component
   *
   * @param  {Object} editor
   * @param  {Object} bufferPosition
   */
  getComponentOrAttribute (editor, bufferPosition) {
    // Remove everything until the opening quote (if we're in a string)
    let quoteIndex = bufferPosition.column - 1 // Don't start at the end of the line
    while (quoteIndex) {
      const scopes = editor.scopeDescriptorForBufferPosition([bufferPosition.row, quoteIndex])
      const scopesArray = scopes.getScopesArray()
      if (!this.hasStringScope(scopesArray) ||
        (scopesArray.indexOf('punctuation.definition.string.begin.html') !== -1)) {
        break
      }
      quoteIndex--
    }
    return __guard__(attributePattern.exec(editor.getTextInRange([
      [bufferPosition.row, 0], [bufferPosition.row, quoteIndex]]
    )), x => x[1])
  }

  /**
   * Check does scopes have a String Scope
   *
   * @param  {Object}  scopes
   * @return {Boolean}
   */
  hasStringScope (scopes) {
    return (scopes.indexOf('string.quoted.double.html') !== -1) ||
      (scopes.indexOf('string.quoted.single.html') !== -1)
  }

  /**
   * [isComponentOrAttributeStart description]
   *
   * @param  {Object}  prefix          The prefix for the word immediately preceding the current cursor position
   * @param  {Object}  scopeDescriptor [description]
   * @param  {Object}  bufferPosition  [description]
   * @param  {Object}  editor          [description]
   * @return {Boolean}                 [description]
   */
  isComponentOrAttributeStart ({prefix, scopeDescriptor, bufferPosition, editor}) {
    const scopes = scopeDescriptor.getScopesArray()
    if (!this.getComponentOrAttribute(editor, bufferPosition) && prefix && !prefix.trim()) {
      return this.hasTagScope(scopes)
    }

    const previousBufferPosition = [bufferPosition.row, Math.max(0, bufferPosition.column - 1)]
    const previousScopes = editor.scopeDescriptorForBufferPosition(previousBufferPosition)
    const previousScopesArray = previousScopes.getScopesArray()

    if (previousScopesArray.indexOf('entity.other.attribute-name.html') !== -1) {
      return true
    }
    if (!this.hasTagScope(scopes)) { return false }
    return (scopes.indexOf('punctuation.definition.tag.end.html') !== -1) &&
      (previousScopesArray.indexOf('punctuation.definition.tag.end.html') === -1)
  }

  /**
   * Get Component Or Attribute Name Completions
   *
   * @param  {String} prefix
   * @param  {Object} editor
   * @param  {Object} bufferPosition
   * @return {Object}                completions
   */
  getComponentOrAttributeNameCompletions ({prefix, editor, bufferPosition}) {
    const completions = []
    const tag = this.getPreviousTag(editor, bufferPosition)
    const tagAttributes = this.getTagAttributes(tag)

    for (const attribute of Object.keys(tagAttributes)) {
      if (!prefix.trim() || fce(attribute, prefix)) {
        completions.push(this.buildMappingAttributeCompletion(attribute, tag, this.completions.attributes[attribute], tagAttributes[attribute]))
      }
    }
    for (const component of Object.keys(this.completions.components)) {
      if (!prefix.trim() || fce(component, prefix)) {
        if ((tag !== 'a-scene' && this.completions.components[component].sceneOnly) ||
        (tag === 'a-scene' && !this.completions.components[component].sceneOnly)) {
          continue
        }
        completions.push(this.buildComponentCompletion(component, tag, this.completions.components[component]))
      }
    }
    return completions
  }

  /**
   * Build Local Mapping Attribute Completion
   *
   * @param  {String} attribute
   * @param  {String} tag
   * @param  {Object} options
   * @return {Object}
   */
  buildMappingAttributeCompletion (attribute, tag, options, v) {
    let description, value, url, cp
    if (this.attributeDefaults) {
      value = v != null && typeof v !== 'undefined' ? v.value : null
      if (value == null && options != null && options.mapping != null) {
        if (v !== null && typeof v.mapping !== 'undefined') {
          cp = v.mapping.split('.')
          description = v.mapping
        } else {
          cp = options.mapping.split('.')
          description = options.mapping
        }
        url = this.getComponentDocsURL(cp[0])
        if (this.completions.components.hasOwnProperty(cp[0])) {
          const x = this.completions.components[cp[0]].properties[cp[1]]
          value = x || ''
        } else {
          value = ''
        }
      } else {
        description = `<${tag}> ${attribute}`
        url = (options != null && options.url != null) ? options.url : this.getTagDocsURL(tag)
      }
    }
    return {
      snippet: (options != null ? options.type : undefined) === 'flag' ? attribute : `${attribute}="${value}$1"$0`,
      displayText: attribute,
      type: 'attribute',
      rightLabel: value,
      leftLabel: 'A-Frame',
      description: description,
      descriptionMoreURL: url
    }
  }

  /**
   * Build Component Completion
   *
   * @param  {String} component
   * @param  {String} tag
   * @param  {Object} options
   * @return {Object}
   */
  buildComponentCompletion (component, tag, options) {
    return {
      snippet: options.type === 'flag' ? component : `${component}="${this.getComponentValue(options)}$1"$0`,
      displayText: component,
      type: 'component',
      leftLabel: 'A-Frame',
      rightLabel: 'component',
      description: options.description != null ? options.description : '',
      descriptionMoreURL: this.getComponentDocsURL(component)
    }
  }
  /**
   * Get Tag Attributes
   *
   * @param  {String} tag
   * @return {Object} attributes
   */
  getTagAttributes (tag) {
    return (this.completions.tags[tag] != null ? this.completions.tags[tag].attributes : undefined) != null
      ? (this.completions.tags[tag] != null ? this.completions.tags[tag].attributes : undefined) : []
  }

  /**
   * Get Component Value
   *
   * @param  {String} component
   * @return {String} val
   */
  getComponentValue (component) {
    if (component.value != null) {
      return component.value
    }
    if (this.componentDefaults) {
      let val = ''
      for (var p in component.properties) {
        if (component.properties.hasOwnProperty(p)) {
          val += p + ':' + component.properties[p] + ';'
        }
      }
      return val
    }
    return ''
  }
}

function __guard__ (value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined
}
