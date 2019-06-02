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
      if (!action.validate || !action.message || !action.commit) {
        throw `Action ${action} must have .validate, .message and .commit methods`
      }
    })

    this.actions.push(...actions)
  }

  validate() {
    this.actions.forEach((action) => action.validate())
    return true
  }

  commit(log = (message) => console.log(message)) {
    this.actions.forEach((action) => {
      log(action.message())
      action.commit()
    })
  }
}

export class FileSystemAction {
  validate() {
    throw new Error('Override this method in your subclass of FileSystemAction')
  }

  message() {
    throw new Error('Override this method in your subclass of FileSystemAction')
  }

  commit() {
    throw new Error('Override this method in your subclass of FileSystemAction')
  }
}

export class MoveFileAction extends FileSystemAction {
  constructor(sourceFile, targetDirectory) {
    super()
    this.sourceFile = ensure(sourceFile, 'MoveFileAction: sourceFile must not be empty')
    this.targetDirectory = ensure(targetDirectory, 'MoveFileAction: targetDirectory must not be empty')
  }

  validate() {
    if (!fs.statSync(this.sourceFile).isFile()) {
      throw new Error(`sourceFile ${this.sourceFile} must be a file`)
    }

    if (!fs.statSync(this.targetDirectory).isDirectory()) {
      throw new Error(`targetDirectory ${this.targetDirectory} must be a directory`)
    }

    try {
      fs.accessSync(this.targetDirectory, fs.constants.W_OK)
    } catch(error) {
      throw new Error(`targetDirectory ${this.targetDirectory} must be writable`)
    }
  }

  message() {
    return `~ mv ${this.sourceFile} ${this.targetDirectory}`
  }

  commit() {
    fs.rename(this.sourceFile, this.targetDirectory)
  }
}

export class FileWriteAction extends FileSystemAction {
  constructor(targetFilePath, content) {
    super()
    this.targetFilePath = ensure(targetFilePath, 'FileWriteAction: targetFilePath must not be empty')
    this.content = ensure(content, 'FileWriteAction: content must not be empty')
  }

  message() {
    return `Writing ${this.targetFilePath}`
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
}

export class CreateDirectoryAction extends FileSystemAction {
  constructor(targetDirectoryPath) {
    super()
    this.targetDirectoryPath = ensure(targetDirectoryPath, 'CreateDirectoryAction: targetDirectoryPath must not be empty')
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

  message() {
    return `~ mkdir ${this.targetDirectoryPath}`
  }

  commit() {
    fs.mkdir(this.targetDirectoryPath)
  }
}

export class RemoveFileAction extends FileSystemAction {
  constructor(targetFilePath) {
    super()
    this.targetFilePath = ensure(targetFilePath, 'RemoveFileAction: targetFilePath must not be empty')
  }

  validate() {
    if (!fs.statSync(this.targetFilePath).isFile()) {
      throw new Error(`this.targetFilePath ${this.targetFilePath} must be a file`)
    }

    // TODO: Can I delete the file?
    // const parentDirectory = path.dirname(this.targetFilePath)

    // try {
    //   fs.accessSync(parentDirectory, fs.constants.W_OK)
    // } catch(error) {
    //   throw new Error(`parentDirectory ${parentDirectory} must be writable`)
    // }
  }

  message() {
    return `~ rm ${this.targetFilePath}`
  }

  commit() {
    fs.unlink(this.targetFilePath)
  }
}

export class RemoveDirectoryAction extends FileSystemAction {
  constructor(targetDirectoryPath) {
    super()
    this.targetDirectoryPath = ensure(targetDirectoryPath, 'RemoveDirectoryAction: targetDirectoryPath must not be empty')
  }

  validate() {
    if (!fs.statSync(this.targetDirectoryPath).isDirectory()) {
      throw new Error(`this.targetDirectoryPath ${this.targetDirectoryPath} must be a directory`)
    }

    // TODO: Can I delete the directory?
    // const parentDirectory = path.dirname(this.targetDirectoryPath)

    // try {
    //   fs.accessSync(parentDirectory, fs.constants.W_OK)
    // } catch(error) {
    //   throw new Error(`parentDirectory ${parentDirectory} must be writable`)
    // }
  }

  message() {
    return `~ rm -r ${this.targetDirectoryPath}`
  }

  commit() {
    fs.rmdir(this.targetDirectoryPath)
  }
}
