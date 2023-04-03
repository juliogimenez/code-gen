import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { createFilter } from '@rollup/pluginutils'
import { parse } from 'esprima'
import { load } from 'js-yaml'
import { render } from 'ejs'
import MagicString from 'magic-string'

const COMMENT_REGEX = /@codegen([\s\S]*?)@endcodegen/g
function findCodeGenComments(code) {
  try {
    const ast = parse(code, { comment: true, range: true, sourceType: 'module' })
    const comments = ast.comments
    const codeGenComments = []
    for (const comment of comments) {
      const commentValue = comment.value.trim()
      if (COMMENT_REGEX.test(commentValue)) {
        const codeGenMatch = commentValue.match(COMMENT_REGEX)
        if (codeGenMatch && codeGenMatch.length > 0) {
          const startIndex =
            comment.range[0] + commentValue.indexOf(codeGenMatch[0])
          const endIndex = comment.range[1]
          const directives = extractDirectives(commentValue)
          codeGenComments.push({
            start: startIndex,
            end: endIndex,
            data: commentValue.substring(commentValue.indexOf(codeGenMatch[0])),
            directives
          })
        }
      }
    }
    return codeGenComments
  } catch (error) {
    throw new Error(`Error parsing code: ${error.message}`)
  }
}

function extractDirectives(commentText) {
  try {
    const result = {}
    const regex = /(\w+):\s*"([^"]*)"/g
    const matches = commentText.matchAll(regex)
    for (const match of matches) {
      const [, key, value] = match
      if (key === 'yaml') result['yaml'] = value
      if (key === 'ejs') result['ejs'] = value
    }
    return result
  } catch (error) {
    throw new Error(`Error parsing code: ${error.message}`)
  }
}
export default function codeGenPlugin(options = {}) {
  const filter = createFilter(options.include, options.exclude)
  return {
    name: 'code-gen-plugin',
    async transform(code, id) {
      if (!filter(id)) {
        return null
      }
      const comments = findCodeGenComments(code)
      const magicString = new MagicString(code)
      for (const {
        start,
        end,
        directives: { yaml, ejs }
      } of comments) {
        try {
          const yamlString = readFileSync(resolve(id, '..', yaml), 'utf8')
          const ejsString = readFileSync(resolve(id, '..', ejs), 'utf8')
          const yamlData = await load(yamlString)
          const generatedCode = await render(ejsString, yamlData, {
            async: true
          })
          if (generatedCode && generatedCode.trim() !== '') {
            magicString.overwrite(start, end, generatedCode)
          }
        } catch (error) {
          this.error(`Error parsing code: ${error.message}\n\n\n${error.stack}`)
        }
      }
      return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true })
      }
    }
  }
}
