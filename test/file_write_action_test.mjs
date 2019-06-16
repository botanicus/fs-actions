import test from 'ava'
import assert from 'assert'
import { FileWriteAction } from '../'

/* The constructor. */
test('FileWriteAction cannot be instantiated without targetFilePath', t => {
  assert.throws(() => new FileWriteAction(), /targetFilePath/)
  t.pass()
})

test('FileWriteAction cannot be instantiated without content', t => {
  assert.throws(() => new FileWriteAction('file.txt'), /content/)
  t.pass()
})

test('FileWriteAction can be instantiated with targetFilePath and content', t => {
  assert.doesNotThrow(() => new FileWriteAction('file.txt', 'Lorem ipsum ...'))
  t.pass()
})

test('FileWriteAction has targetFilePath and content properties', t => {
  const action = new FileWriteAction('file.txt', 'Lorem ipsum ...')
  assert(action.targetFilePath)
  assert(action.content)
  t.pass()
})

/* FileWriteAction.prototype.validate() */
test('FileWriteAction.prototype.validate() throws an error if the sourceFile does not exist', t => {
  const action = new FileWriteAction('/a/b/c/file.txt', 'Lorem ipsum ...')
  assert.throws(() => action.validate(), /ENOENT/)
  t.pass()
})

test('FileWriteAction.prototype.validate() throws an error if the parent directory of the targetFilePath is not a directory', t => {
  const action = new FileWriteAction('test/move_file_action_test.mjs/file.js', 'Lorem ipsum ...')
  assert.throws(() => action.validate(), /must be a directory/)
  t.pass()
})

/*
  Leaving FileWriteAction.prototype.commit() untested intentionally,
  because it's a bit harder to do and requires cleanup etc.
*/
