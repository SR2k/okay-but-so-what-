import { readdir, readJson, writeJson } from 'fs-extra'
import { resolve } from "path"
import paths from './paths'

/**
 * Generate package.json with linters for Git commits, SCSS files and scripts
 */
const generatePackageJson = async () => {
  const packageJsonConfigEntries = (await readdir(paths.packageJsonConfigDir))
    .filter(fileName => /\.json$/.test(fileName))
  const packageJsonConfigs: any = {}
  for (const file of packageJsonConfigEntries) {
    packageJsonConfigs[file.replace(/\.json$/, '')] = await readJson(resolve(paths.packageJsonConfigDir, file))
  }

  // update package.json
  console.log('🕒 Generating package.json...')
  const packageJson = await readJson(paths.packageJson)
  for (const [key, val] of Object.entries(packageJsonConfigs)) {
    packageJson[key] = {
      ...(packageJson[key] || {}),
      ...val,
    }
  }
  await writeJson(paths.packageJson, packageJson)
  console.log('😀 Done.\n')
}

export default generatePackageJson
