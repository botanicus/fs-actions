import { FileSystemAction } from './index.mjs'
import { ensure } from './utils.mjs'
import { execSync } from 'child_process'

// TODO: add tests.
// TODO: Validate paths are full, so chdir works.

function chdir(newPath, fn) {
  const originalPath = process.cwd()
  process.chdir(newPath)
  const returnValue = fn()
  process.chdir(originalPath)
  return returnValue
}

class GitAction extends FileSystemAction {
  constructor(gitRootDirectory, options = {}) {
    super()
    this.gitRootDirectory = ensure(gitRootDirectory, `${this.constructor.name}: gitRootDirectory is required`)
    this.options = options
  }

  validate() {
    // TODO: Validate gitRootDirectory exists
  }

  command() {
    throw new Error(`Override ${this.constructor.name}.command()`)
  }

  commit() {
    chdir(this.gitRootDirectory, () => execSync(this.command()))
  }
}

export class GitAddAction extends GitAction {
  constructor(gitRootDirectory, paths, options = {}) {
    super(gitRootDirectory, options)
    this.paths = ensure(paths, `${this.constructor.name}: paths are required`)
    this.options = options
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
    return `git rm ${this.options.recursive ? '-r ' : ''}${this.paths.join(' ')}`
  }
}

export class GitCommitAction extends GitAction {
  constructor(gitRootDirectory, message, options) {
    super(gitRootDirectory, options)
    this.message = ensure(message, `${this.constructor.name}: message must not be empty`)
  }

  command() {
    return `git commit -m "${this.message}"`
  }

  commit() {
    try {
      super.commit()
    } catch(error) {
      if (!this.options.soft) throw error
    }
  }
}
