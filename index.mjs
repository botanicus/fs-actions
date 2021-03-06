import fs from 'fs'
import path from 'path'
import { ensure } from './utils.mjs'

export class FileSystemActions {
  /* Class properties are supported from Node.js 12 on. */
  actions = []

  constructor(...actions) {
    this.add(...actions)
  }

  add(...actions) {
    actions.forEach((action) => {
      if (!action.validate || !action.commit) {
        throw `Action ${action} must have .validate and .commit methods`
      }
    })

    this.actions.push(...actions)
  }

  validate() {
    this.actions.forEach((action) => action.validate())
    return true
  }

  snapshot() {
    return this.actions.map((action) =>
      Object.assign({type: action.constructor.name}, action)
    )
  }

  commit(log = (message) => console.log(message)) {
    this.actions.forEach((action) => {
      log(action)
      action.commit()
    })
  }
}

export class FileSystemAction {
  validate() {
    throw new Error(`Override ${this.constructor.name}.validate()`)
  }

  commit() {
    throw new Error(`Override ${this.constructor.name}.commit()`)
  }
}

export class MoveFileAction extends FileSystemAction {
  constructor(sourceFile, targetFile) {
    super()
    this.sourceFile = ensure(sourceFile, `${this.constructor.name}: sourceFile must not be empty`)
    this.targetFile = ensure(targetFile, `${this.constructor.name}: targetFile must not be empty`)
  }

  validate() {
    if (!fs.statSync(this.sourceFile).isFile()) {
      throw new Error(`sourceFile ${this.sourceFile} must be a file`)
    }

    if (!fs.statSync(this.targetFile).isDirectory()) {
      throw new Error(`targetFile ${this.targetFile} must be a directory`)
    }

    try {
      fs.accessSync(this.targetFile, fs.constants.W_OK)
    } catch(error) {
      throw new Error(`targetFile ${this.targetFile} must be writable`)
    }
  }

  commit() {
    fs.renameSync(this.sourceFile, this.targetFile)
  }
}

export class CopyFileAction extends MoveFileAction {
  commit() {
    fs.copyFileSync(this.sourceFile, this.targetFile)
  }
}

export class FileWriteAction extends FileSystemAction {
  constructor(targetFilePath, content) {
    super()
    this.targetFilePath = ensure(targetFilePath, `${this.constructor.name}: targetFilePath must not be empty`)
    this.content = ensure(content, `${this.constructor.name}: content must not be empty`)
  }

  validate() {
    const parentDirectory = path.dirname(this.targetFilePath)

    if (!fs.statSync(parentDirectory).isDirectory()) {
      throw new Error(`parentDirectory ${parentDirectory} must be a directory`)
    }

    try {
      fs.accessSync(parentDirectory, fs.constants.W_OK)
    } catch(error) {
      throw new Error(`parentDirectory ${parentDirectory} must be writable`)
    }
  }

  commit() {
    fs.writeFileSync(this.targetFilePath, this.content)
  }
}

export class CreateDirectoryAction extends FileSystemAction {
  constructor(targetDirectoryPath) {
    super()
    this.targetDirectoryPath = ensure(targetDirectoryPath, `${this.constructor.name}: targetDirectoryPath must not be empty`)
  }

  validate() {
    const parentDirectory = path.dirname(this.targetDirectoryPath)

    if (!fs.statSync(parentDirectory).isDirectory()) {
      throw new Error(`parentDirectory ${parentDirectory} must be a directory`)
    }

    try {
      fs.accessSync(parentDirectory, fs.constants.W_OK)
    } catch(error) {
      throw new Error(`parentDirectory ${parentDirectory} must be writable`)
    }
  }

  commit() {
    fs.mkdirSync(this.targetDirectoryPath)
  }
}

// ACTUALLY THIS SHOULD BE DONE VIA OPTIONS.
export class EnsureDirectoryAction extends CreateDirectoryAction {
  commit() {
    if (!fs.existsSync(this.targetDirectoryPath)) super.commit()
  }
}

export class RemoveFileAction extends FileSystemAction {
  constructor(targetFilePath) {
    super()
    this.targetFilePath = ensure(targetFilePath, `${this.constructor.name}: targetFilePath must not be empty`)
  }

  validate() {
    if (!fs.statSync(this.targetFilePath).isFile()) {
      throw new Error(`${this.constructor.name}.targetFilePath ${this.targetFilePath} must be a file`)
    }

    // TODO: Can I delete the file?
    // const parentDirectory = path.dirname(this.targetFilePath)

    // try {
    //   fs.accessSync(parentDirectory, fs.constants.W_OK)
    // } catch(error) {
    //   throw new Error(`parentDirectory ${parentDirectory} must be writable`)
    // }
  }

  commit() {
    fs.unlinkSync(this.targetFilePath)
  }
}

export class RemoveDirectoryAction extends FileSystemAction {
  constructor(targetDirectoryPath) {
    super()
    this.targetDirectoryPath = ensure(targetDirectoryPath, `${this.constructor.name}: targetDirectoryPath must not be empty`)
  }

  validate() {
    if (!fs.statSync(this.targetDirectoryPath).isDirectory()) {
      throw new Error(`${this.constructor.name}.targetDirectoryPath ${this.targetDirectoryPath} must be a directory`)
    }

    // TODO: Can I delete the directory?
    // const parentDirectory = path.dirname(this.targetDirectoryPath)

    // try {
    //   fs.accessSync(parentDirectory, fs.constants.W_OK)
    // } catch(error) {
    //   throw new Error(`parentDirectory ${parentDirectory} must be writable`)
    // }
  }

  commit() {
    this.deleteFolderRecursive(this.targetDirectoryPath)
  }

  // https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty
  deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        var curPath = path + "/" + file
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          this.deleteFolderRecursive(curPath)
        } else { // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  }
}

// TODO: add tests.
export class ConsoleLogAction extends FileSystemAction {
  constructor(message) {
    super()
    this.message = ensure(message, `${this.constructor.name}: message must not be empty`)
  }

  validate() {
    return true
  }

  commit() {
    console.log(`~ ${this.message}`)
  }
}
