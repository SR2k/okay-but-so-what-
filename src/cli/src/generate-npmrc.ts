import getConf = require('mirror-config-china/lib/config')
import { writeFile } from 'fs-extra'
import { resolve } from 'path'
import paths from './paths'

/**
 * Generate NPM mirror configs for Chinese users
 */
const generateNpmRc = async () => {
  const npmConfig = getConf(['--registry=https://registry.npm.taobao.org'])
  console.log('🕒 Generating npmrc...')
  let npmrc = ''
  for (const [key, val] of Object.entries(npmConfig)) {
    npmrc += `${key}=${val}\n`
  }
  await writeFile(resolve(paths.pwd, '.npmrc'), npmrc)
  console.log('😀 Done.\n')
}

export default generateNpmRc
