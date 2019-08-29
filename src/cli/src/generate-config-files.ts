import { readdir, copyFile, readJson } from 'fs-extra'
import paths from './paths'
import { resolve } from 'path'

interface IFileConfig {
  content: string
  filename: string
}
type FileConfigDictionary = { [key: string]: IFileConfig }

const generateConfigFiles = async () => {
  const configFiles = (await readdir(paths.fileConfigsDir))
    .filter(fileName => /\.json$/.test(fileName))
  const fileConfigs: FileConfigDictionary = {}
  for (const file of configFiles) {
    fileConfigs[file.replace(/\.json$/, '')] = await readJson(resolve(paths.fileConfigsDir, file))
  }

// copy config files
  console.log('🕒 Generating config files...')
  for (const [key, {filename, content}] of Object.entries(fileConfigs)) {
    await copyFile(
      resolve(paths.fileConfigsDir, content),
      resolve(paths.pwd, filename),
    )
    console.log(`⏳ Done with ${key}`)
  }
  console.log('😀 Done.\n')
}

export default generateConfigFiles
