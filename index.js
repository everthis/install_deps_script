#!/usr/bin/env bash

const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const pkgJsonPath = path.resolve(process.cwd(), 'package.json')
const pkgsPath = path.resolve(__dirname, 'packages')
const npm2Path = '/home/everthis/projects/npm-packages/node_modules/.bin/npm'

try {
  fs.statSync(pkgJsonPath)

  const obj = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
  const { dependencies: deps } = obj
  const items = Object.entries(deps)

  for (const [dep, ver] of items) {
    let version = ver
    if (version.startsWith('~') || version.startsWith('^')) {
      version = version.slice(1)
    }
    const p = `${pkgsPath}/${dep}/${version}`
    if (!chkExist(p)) {
      fs.mkdirSync(p, { recursive: true })
    }
    const cmd = `${npm2Path} i ${dep}@${version}`
    console.log('start installing ' + dep + '@' + version)
    child_process.execSync(cmd, { cwd: p })
  }
} catch (e) {
  console.log('error')
}

function chkExist(p) {
  try {
    fs.statSync(p)
    return true
  } catch (e) {
    return false
  }
}
