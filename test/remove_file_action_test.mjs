import test from 'ava'
import assert from 'assert'
import { RemoveFileAction } from '../'

/* The constructor. */
test('RemoveFileAction cannot be instantiated without targetFilePath', t => {
  assert.throws(() => new RemoveFileAction(), /targetFilePath/)
  t.pass()
})

test('RemoveFileAction can be instantiated with targetFilePath', t => {
  assert.doesNotThrow(() => new RemoveFileAction('README.md'))
  t.pass()
})

test('RemoveFileAction has targetFilePath property', t => {
  const action = new RemoveFileAction('README.md')
  assert(action.targetFilePath)
  t.pass()
})

/* RemoveFileAction.prototype.validate() */
test('RemoveFileAction.prototype.validate() throws an error if the parent directory of targetFilePath does not exist', t => {
  const action = new RemoveFileAction('/a/b/c')
  assert.throws(() => action.validate(), /ENOENT/)
  t.pass()
})

// test('RemoveFileAction.prototype.validate() throws an error if the parent directory of targetDirectory is not a directory', t => {
//   const action = new RemoveFileAction('test/move_file_action_test.mjs/test')
//   assert.throws(() => action.validate(), /must be a directory/)
//   t.pass()
// })

// test('RemoveFileAction.prototype.validate() throws an error if the parent directory of targetDirectory is not writable', t => {
//   const action = new RemoveFileAction('/sys/mydir')
//   assert.throws(() => action.validate(), /must be writable/)
//   t.pass()
// })

/* RemoveFileAction.prototype.message() */
test('RemoveFileAction.prototype.message() contains information about what is being moved where', t => {
  const action = new RemoveFileAction('README.md')
  assert(action.message().match(/\README.md/))
  t.pass()
})

/*
  Leaving RemoveFileAction.prototype.commit() untested intentionally,
  because it's a bit harder to do and requires cleanup etc.
*/
