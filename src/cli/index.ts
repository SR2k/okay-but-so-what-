#!/usr/bin/env node

// tslint:disable non-literal-require
import { resolve } from 'path'
import { readdirSync, writeFileSync, copyFileSync } from 'fs'

type PathDictionary = { [key: string]: string }
interface IFileConfig {
  content: string
  filename: string
}
type FileConfigDictionary = { [key: string]: IFileConfig }

let paths: PathDictionary = {
  pwd: process.cwd(),
}

paths = {
  ...paths,
  packageJson: resolve(paths.pwd, 'package.json'),
  packageJsonConfigDir: resolve(__dirname, './package-json-configs/'),
  fileConfigsDir: resolve(__dirname, './file-configs/'),
  npmrc: resolve(process.cwd(), './.npmrc'),
}

const packageJsonConfigEntries = readdirSync(paths.packageJsonConfigDir)
  .filter(fileName => /\.json$/.test(fileName))
const configFiles = readdirSync(paths.fileConfigsDir)
  .filter(fileName => /\.json$/.test(fileName))
const packageJsonConfigs: any = {}
const fileConfigs: FileConfigDictionary = {}
packageJsonConfigEntries.forEach(file => {
  packageJsonConfigs[file.replace(/\.json$/, '')] = require(resolve(paths.packageJsonConfigDir, file))
})
configFiles.forEach(file => {
  fileConfigs[file.replace(/\.json$/, '')] = require(resolve(paths.fileConfigsDir, file))
})

try {
  // update package.json
  console.log('🕒 Generating package.json...')
  const packageJson = require(paths.packageJson)
  for (const [key, val] of Object.entries(packageJsonConfigs)) {
    packageJson[key] = {
      ...(packageJson[key] || {}),
      ...val,
    }
  }
  writeFileSync(resolve(paths.packageJson), JSON.stringify(packageJson, null, 2))
  console.log('😀 Done.\n')

  // copy config files
  console.log('🕒 Generating config files...')
  for (const [key, { filename, content }] of Object.entries(fileConfigs)) {
    copyFileSync(
      resolve(paths.fileConfigsDir, content),
      resolve(paths.pwd, filename),
    )
    console.log(`⏳ Done with ${key}`)
  }
  console.log('😀 Done.\n')
} catch(e) {
  console.log(`❌ An unhandled exception occurred: ${e.message}`)
}
