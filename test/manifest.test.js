import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const manifest = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
)

test('manifest avoids install-time lifecycle scripts', () => {
  for (const name of ['preinstall', 'install', 'postinstall', 'prepare']) {
    assert.equal(manifest.scripts?.[name], undefined)
  }
  assert.equal(manifest.scripts?.prepublishOnly, 'npm run ci')
})

test('manifest declares the supported DSH runtime', () => {
  assert.equal(manifest.dsh?.compatibility?.node, manifest.engines?.node)
  assert.equal(manifest.dsh?.compatibility?.dsh, '>=0.1.2-rc.1 <0.2.0')
  assert.deepEqual(manifest.dsh?.compatibility?.profiles, ['web'])
  assert.equal(
    manifest.dsh?.compatibility?.dshReleases?.['0.1.2-rc.1'],
    'compatible',
  )
  assert.equal(
    manifest.dsh?.compatibility?.dshReleases?.['0.1.5-rc.1'],
    'compatible',
  )
})

test('browser-only libraries are build dependencies', () => {
  assert.equal(manifest.dependencies?.sortablejs, undefined)
  assert.equal(typeof manifest.devDependencies?.sortablejs, 'string')
})

test('official DSH libraries are peer and development dependencies', () => {
  const packageName = '@deepseek-ai/schemastery'
  assert.equal(manifest.dependencies?.[packageName], undefined)
  assert.equal(manifest.peerDependencies?.[packageName], '^3.18.2')
  assert.equal(manifest.devDependencies?.[packageName], '^3.18.2')
})
