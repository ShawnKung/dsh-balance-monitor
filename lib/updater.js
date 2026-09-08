import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'
import semver from 'semver'

const require = createRequire(import.meta.url)
const manifest = require('../package.json')
const execFileAsync = promisify(execFile)

const CHECK_TIMEOUT_MS = 5_000
const INSTALL_TIMEOUT_MS = 10 * 60_000
const PROFILE = 'web'
const REGISTRY = 'https://registry.npmjs.org'

export const PACKAGE_NAME = manifest.name
export const PACKAGE_VERSION = manifest.version

function registryPackageURL(name) {
  return `${REGISTRY}/${encodeURIComponent(name)}/latest`
}

function profileDirectory(profile = PROFILE) {
  return join(homedir(), '.dsh', 'profiles', profile)
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'))
}

export function isRegistryDependency(spec) {
  return typeof spec === 'string'
    && spec.trim() !== ''
    && !/^(?:file|git\+|github|https?|link|npm|workspace):/i.test(spec.trim())
}

function toolPath() {
  const separator = process.platform === 'win32' ? ';' : ':'
  const paths = (process.env.PATH ?? '').split(separator).filter(Boolean)
  const candidates = [
    dirname(process.execPath),
    '/opt/homebrew/bin',
    '/usr/local/bin',
    join(homedir(), '.local', 'bin'),
    join(homedir(), 'Library', 'pnpm'),
    join(homedir(), '.local', 'share', 'pnpm'),
  ]
  return [...new Set([...paths, ...candidates])].join(separator)
}

export async function installExactVersion({
  packageName,
  version,
  profile = PROFILE,
  cli = process.argv[1],
  node = process.execPath,
  execute = execFileAsync,
}) {
  if (typeof cli !== 'string' || cli.trim() === '') {
    throw new Error('无法定位当前 DSH CLI')
  }
  try {
    await execute(
      node,
      [cli, 'plugin', '--profile', profile, 'add', `${packageName}@${version}`],
      {
        env: { ...process.env, PATH: toolPath(), CI: 'true' },
        timeout: INSTALL_TIMEOUT_MS,
        maxBuffer: 512 * 1024,
      },
    )
  } catch (error) {
    const detail = String(error?.stderr || error?.stdout || error?.message || error)
      .trim()
      .slice(-800)
    throw new Error(detail || 'DSH 插件更新失败')
  }
}

export class UpdateService {
  constructor({
    packageName = PACKAGE_NAME,
    currentVersion = PACKAGE_VERSION,
    profile = PROFILE,
    profileDir = profileDirectory(profile),
    fetchImpl = fetch,
    runInstall = installExactVersion,
    readDependencySpec,
    readInstalledVersion,
  } = {}) {
    this.packageName = packageName
    this.currentVersion = currentVersion
    this.profile = profile
    this.profileDir = profileDir
    this.fetchImpl = fetchImpl
    this.runInstall = runInstall
    this.readDependencySpec = readDependencySpec
      ?? (async () => {
        const profileManifest = await readJson(join(this.profileDir, 'package.json'))
        return profileManifest.dependencies?.[this.packageName]
      })
    this.readInstalledVersion = readInstalledVersion
      ?? (async () => {
        const installed = await readJson(
          join(this.profileDir, 'node_modules', ...this.packageName.split('/'), 'package.json'),
        )
        return installed.version
      })
    this.checkPromise = null
    this.installPromise = null
    this.state = {
      status: 'idle',
      currentVersion,
      latestVersion: null,
      installedVersion: currentVersion,
      updateAvailable: false,
      error: null,
    }
  }

  snapshot() {
    return structuredClone(this.state)
  }

  async dependencySpec() {
    return this.readDependencySpec()
  }

  async installedVersion() {
    return this.readInstalledVersion()
  }

  async performCheck() {
    this.state = { ...this.state, status: 'checking', error: null }
    try {
      const spec = await this.dependencySpec()
      if (!isRegistryDependency(spec)) {
        this.state = {
          ...this.state,
          status: 'unavailable',
          latestVersion: null,
          updateAvailable: false,
        }
        return this.snapshot()
      }

      const response = await this.fetchImpl(registryPackageURL(this.packageName), {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(CHECK_TIMEOUT_MS),
      })
      if (!response.ok) throw new Error(`npm Registry 返回 HTTP ${response.status}`)
      const body = await response.json()
      const latestVersion = semver.valid(body?.version)
      if (!latestVersion || body?.name !== this.packageName) {
        throw new Error('npm Registry 返回了无效的包信息')
      }

      const updateAvailable = semver.gt(latestVersion, this.currentVersion)
      this.state = {
        ...this.state,
        status: updateAvailable ? 'available' : 'current',
        latestVersion,
        updateAvailable,
        error: null,
      }
      return this.snapshot()
    } catch (error) {
      this.state = {
        ...this.state,
        status: 'error',
        updateAvailable: false,
        error: String(error?.message ?? error).slice(0, 320),
      }
      return this.snapshot()
    }
  }

  check() {
    if (this.installPromise) return this.installPromise
    if (this.checkPromise) return this.checkPromise
    if (['available', 'current', 'unavailable'].includes(this.state.status)) {
      return Promise.resolve(this.snapshot())
    }
    const operation = this.performCheck().finally(() => {
      if (this.checkPromise === operation) this.checkPromise = null
    })
    this.checkPromise = operation
    return this.checkPromise
  }

  install() {
    if (this.installPromise) return this.installPromise
    const operation = this.check().then(checked => this.performInstall(checked)).finally(() => {
      if (this.installPromise === operation) this.installPromise = null
    })
    this.installPromise = operation
    return this.installPromise
  }

  async performInstall(checked) {
    if (!checked.updateAvailable || !checked.latestVersion) {
      throw new Error(checked.error || '当前没有可安装的新版本')
    }

    const targetVersion = checked.latestVersion
    this.state = { ...this.state, status: 'updating', error: null }
    try {
      await this.runInstall({
        packageName: this.packageName,
        version: targetVersion,
        profile: this.profile,
      })
      const installedVersion = await this.installedVersion()
      if (!semver.eq(installedVersion, targetVersion)) {
        throw new Error(`安装结果版本不符：期望 ${targetVersion}，实际 ${installedVersion}`)
      }
      this.state = {
        ...this.state,
        status: 'restart-required',
        installedVersion,
        updateAvailable: false,
        error: null,
      }
      return this.snapshot()
    } catch (error) {
      this.state = {
        ...this.state,
        status: 'error',
        updateAvailable: true,
        error: String(error?.message ?? error).slice(0, 320),
      }
      throw error
    }
  }
}
