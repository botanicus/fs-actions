import test from 'ava'
import assert from 'assert'
import { MoveFileAction } from '../'

/* The constructor. */
test('MoveFileAction cannot be instantiated without sourceFile', t => {
  assert.throws(() => new MoveFileAction(), /sourceFile/)
  t.pass()
})

// test('MoveFileAction cannot be instantiated without targetDirectory', t => {
//   assert.throws(() => new MoveFileAction('file.txt'), /targetDirectory/)
//   t.pass()
// })

test('MoveFileAction can be instantiated with sourceFile and targetDirectory', t => {
  assert.doesNotThrow(() => new MoveFileAction('file.txt', '/tmp'))
  t.pass()
})

// test('MoveFileAction has sourceFile and targetDirectory properties', t => {
//   const action = new MoveFileAction('file.txt', '/tmp')
//   assert(action.sourceFile)
//   assert(action.targetDirectory)
//   t.pass()
// })

/* MoveFileAction.prototype.validate() */
test('MoveFileAction.prototype.validate() throws an error if the sourceFile does not exist', t => {
  const action = new MoveFileAction('file.txt', '/tmp')
  assert.throws(() => action.validate(), /ENOENT/)
  t.pass()
})

test('MoveFileAction.prototype.validate() throws an error if the sourceFile is not a file', t => {
  const action = new MoveFileAction('/tmp', '/tmp')
  assert.throws(() => action.validate(), /must be a file/)
  t.pass()
})

test('MoveFileAction.prototype.validate() throws an error if the targetDirectory does not exist', t => {
  const action = new MoveFileAction('test/move_file_action_test.mjs', '/a/b/c')
  assert.throws(() => action.validate(), /ENOENT/)
  t.pass()
})

test('MoveFileAction.prototype.validate() throws an error if the targetDirectory is not a directory', t => {
  const action = new MoveFileAction('test/move_file_action_test.mjs', 'test/move_file_action_test.mjs')
  assert.throws(() => action.validate(), /must be a directory/)
  t.pass()
})

test('MoveFileAction.prototype.validate() throws an error if the targetDirectory is not writable', t => {
  const action = new MoveFileAction('test/move_file_action_test.mjs', '/sys')
  assert.throws(() => action.validate(), /must be writable/)
  t.pass()
})

/*
  Leaving MoveFileAction.prototype.commit() untested intentionally,
  because it's a bit harder to do and requires cleanup etc.
*/
