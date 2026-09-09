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
  assert.equal(manifest.dependencies.sortablejs, '^1.15.7')
})

test('client bundle uses credential status dots and inline channel actions', async () => {
  const clientBundle = await readFile(resolve(root, 'client.js'), 'utf8')

  assert.match(clientBundle, /bm-credential-dot/)
  assert.match(clientBundle, /bm-credential-clear/)
  assert.match(clientBundle, /bm-field-refresh/)
  assert.match(clientBundle, /bm-secret-input/)
  assert.match(clientBundle, /data-form-type/)
  assert.match(clientBundle, /bm-drag-handle/)
  assert.match(clientBundle, /bm-sortable-ghost/)
  assert.match(clientBundle, /fallbackTolerance: 3/)
  assert.match(clientBundle, /channelOrder/)
  assert.match(clientBundle, /showSidebar/)
  assert.match(clientBundle, /persistSetting/)
  assert.match(clientBundle, /closest\("\.bm-multi"\)/)
  assert.match(
    clientBundle,
    /createElement\(\s*"div",\s*\{\s*className:\s*"bm-checkbox-field"/,
  )
  assert.match(clientBundle, /width:min\(504px,100%\)/)
  assert.match(clientBundle, /\\u5DF2\\u914D\\u7F6E\\u2014\\u2014\\u8F93\\u5165\\u65B0\\u503C\\u53EF\\u66FF\\u6362/)
  assert.doesNotMatch(clientBundle, /className: "bm-badge"/)
  assert.doesNotMatch(clientBundle, /type: "password"/)
  assert.doesNotMatch(clientBundle, /const save =/)
  assert.doesNotMatch(clientBundle, /\\u670D\\u52A1\\u5730\\u5740/)
})
