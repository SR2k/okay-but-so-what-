import { resolve } from "path"

type PathDictionary = { [key: string]: string }

const pwd = process.cwd()
const getRuntimePath = (path: string) => resolve(pwd, path)
const getLibPath = (path: string) => resolve(__dirname, path)

const paths: PathDictionary = {
  pwd,
  packageJson: getRuntimePath('package.json'),
  packageJsonConfigDir: getLibPath('./package-json-configs/'),
  fileConfigsDir: getLibPath('./file-configs/'),
  npmrc: getRuntimePath('./.npmrc'),
}

export default paths
