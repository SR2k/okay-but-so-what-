#!/usr/bin/env node
import generatePackageJson from './src/generate-package-json'
import generateNpmRc from './src/generate-npmrc'
import generateConfigFiles from './src/generate-config-files'


async function generate() {
  await generatePackageJson()
  await generateConfigFiles()
  await generateNpmRc()
}

generate().catch(e => console.log(`❌ Something bad occurred: ${e.message}`))
