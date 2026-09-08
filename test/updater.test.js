import assert from 'node:assert/strict'
import test from 'node:test'
import {
  installExactVersion,
  isRegistryDependency,
  UpdateService,
} from '../lib/updater.js'

function registryResponse(version) {
  return {
    ok: true,
    async json() {
      return {
        name: '@shawnkung/dsh-balance-monitor',
        version,
      }
    },
  }
}

function updater(overrides = {}) {
  return new UpdateService({
    currentVersion: '1.2.3',
    readDependencySpec: async () => '^1.2.3',
    readInstalledVersion: async () => '1.3.0',
    fetchImpl: async () => registryResponse('1.3.0'),
    runInstall: async () => {},
    ...overrides,
  })
}

test('registry dependency detection excludes local and aliased sources', () => {
  assert.equal(isRegistryDependency('^1.2.3'), true)
  assert.equal(isRegistryDependency('1.2.3'), true)
  assert.equal(isRegistryDependency('link:/workspace/plugin'), false)
  assert.equal(isRegistryDependency('file:../plugin.tgz'), false)
  assert.equal(isRegistryDependency('github:owner/repo'), false)
  assert.equal(isRegistryDependency('npm:other-package@1.2.3'), false)
})

test('exact updates invoke the current DSH CLI without a shell', async () => {
  let invocation
  await installExactVersion({
    packageName: '@shawnkung/dsh-balance-monitor',
    version: '1.3.0',
    profile: 'web',
    cli: '/opt/dsh',
    node: '/opt/node',
    async execute(...args) {
      invocation = args
    },
  })

  assert.equal(invocation[0], '/opt/node')
  assert.deepEqual(invocation[1], [
    '/opt/dsh',
    'plugin',
    '--profile',
    'web',
    'add',
    '@shawnkung/dsh-balance-monitor@1.3.0',
  ])
  assert.equal(invocation[2].shell, undefined)
  assert.equal(invocation[2].env.CI, 'true')
})

test('update checks compare the installed package with npm latest', async () => {
  const service = updater()
  const state = await service.check()

  assert.equal(state.status, 'available')
  assert.equal(state.currentVersion, '1.2.3')
  assert.equal(state.latestVersion, '1.3.0')
  assert.equal(state.updateAvailable, true)
})

test('linked development installs do not offer registry replacement', async () => {
  let fetched = false
  const service = updater({
    readDependencySpec: async () => 'link:/workspace/plugin',
    fetchImpl: async () => {
      fetched = true
      return registryResponse('1.3.0')
    },
  })

  const state = await service.check()

  assert.equal(state.status, 'unavailable')
  assert.equal(state.updateAvailable, false)
  assert.equal(fetched, false)
})

test('updates install an exact version and require restart after verification', async () => {
  const calls = []
  const service = updater({
    runInstall: async input => calls.push(input),
  })

  const state = await service.install()

  assert.deepEqual(calls, [{
    packageName: '@shawnkung/dsh-balance-monitor',
    version: '1.3.0',
    profile: 'web',
  }])
  assert.equal(state.status, 'restart-required')
  assert.equal(state.installedVersion, '1.3.0')
  assert.equal(state.updateAvailable, false)
})

test('an install joins an in-flight startup check', async () => {
  let release
  let checks = 0
  const response = new Promise(resolve => {
    release = resolve
  })
  const service = updater({
    fetchImpl: async () => {
      checks += 1
      return response
    },
  })

  const checking = service.check()
  const installing = service.install()
  release(registryResponse('1.3.0'))
  await Promise.all([checking, installing])

  assert.equal(checks, 1)
  assert.equal(service.snapshot().status, 'restart-required')
})

test('updates reject a package manager result with the wrong version', async () => {
  const service = updater({
    readInstalledVersion: async () => '1.2.3',
  })

  await assert.rejects(
    service.install(),
    /安装结果版本不符/,
  )
  const state = service.snapshot()
  assert.equal(state.status, 'error')
  assert.equal(state.updateAvailable, true)
})
