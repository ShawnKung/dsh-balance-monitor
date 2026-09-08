import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import test from 'node:test'

const root = resolve(import.meta.dirname, '..')

test('client bundle registers the published package name', async () => {
  const [manifestText, clientBundle] = await Promise.all([
    readFile(resolve(root, 'package.json'), 'utf8'),
    readFile(resolve(root, 'client.js'), 'utf8'),
  ])
  const manifest = JSON.parse(manifestText)
  const loaderId = clientBundle.match(
    /window\.__ModuleLoader__\.load\(\{\s*id:\s*"([^"]+)"/,
  )?.[1]

  assert.equal(loaderId, manifest.name)
  assert.equal(clientBundle.includes(`v${manifest.version}`), true)
})
