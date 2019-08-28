// tslint:disable non-literal-require
import { resolve } from 'path'
import { readdirSync, writeFileSync, copyFileSync } from 'fs'

type PathDictionary = { [key: string]: string }

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
const configs: any = {}
packageJsonConfigEntries.forEach(file => {
  configs[file.replace(/\.json$/, '')] = require(resolve(paths.packageJsonConfigDir, file))
})

try {
  // update package.json
  const packageJson = require(paths.packageJson)
  for (const [key, val] of Object.entries(configs)) {
    packageJson[key] = {
      ...(packageJson[key] || {}),
      ...val,
    }
  }
  writeFileSync(resolve(paths.packageJson), JSON.stringify(packageJson, null, 2))

  // copy config files
  configFiles.forEach(configFile => copyFileSync(
    resolve(paths.fileConfigsDir, configFile),
    resolve(paths.pwd, configFile),
  ))
} catch(e) {
  console.log(e.message)
}
