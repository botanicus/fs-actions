import { FileSystemAction } from './index.mjs'
import { ensure } from './utils.mjs'
import { execSync } from 'child_process'

// TODO: add tests.
// TODO: Validate paths are full, so chdir works.

function chdir(newPath, fn) {
  const originalPath = process.cwd()
  process.chdir(newPath)
  fn()
  process.chdir(originalPath)
}

class GitAction extends FileSystemAction {
  constructor(gitRootDirectory) {
    super()
    this.gitRootDirectory = ensure(gitRootDirectory, `${this.constructor.name}: gitRootDirectory is required`)
  }

  validate() {
    // TODO: Validate gitRootDirectory exists
  }

  command() {
    throw new Error(`Override ${this.constructor.name}.command()`)
  }

  message() {
    return `~ ${this.command()}`
  }

  commit() {
    chdir(this.gitRootDirectory, () => execSync(this.command()))
  }
}

export class GitAddAction extends GitAction {
  constructor(gitRootDirectory, paths) {
    super(gitRootDirectory)
    this.paths = ensure(paths, `${this.constructor.name}: paths are required`)
  }

  validate() {
    // TODO: super() + validate existence
  }

  command() {
    return `git add ${this.paths.join(' ')}`
  }
}

export class GitRemoveAction extends GitAddAction {
  command() {
    return `git rm ${this.paths.join(' ')}`
  }
}

export class GitCommitAction extends GitAction {
  constructor(gitRootDirectory, message) {
    super(gitRootDirectory)
    this._message = ensure(message, `${this.constructor.name}: message must not be empty`)
  }

  command() {
    return `git commit -m "${this._message}"`
  }
}
