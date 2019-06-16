import test from 'ava'
import assert from 'assert'
import { RemoveDirectoryAction } from '../'

/* The constructor. */
test('RemoveDirectoryAction cannot be instantiated without targetDirectoryPath', t => {
  assert.throws(() => new RemoveDirectoryAction(), /targetDirectoryPath/)
  t.pass()
})

test('RemoveDirectoryAction can be instantiated with targetDirectoryPath', t => {
  assert.doesNotThrow(() => new RemoveDirectoryAction('README.md'))
  t.pass()
})

test('RemoveDirectoryAction has targetDirectoryPath property', t => {
  const action = new RemoveDirectoryAction('README.md')
  assert(action.targetDirectoryPath)
  t.pass()
})

/* RemoveDirectoryAction.prototype.validate() */
test('RemoveDirectoryAction.prototype.validate() throws an error if the parent directory of targetDirectoryPath does not exist', t => {
  const action = new RemoveDirectoryAction('/a/b/c')
  assert.throws(() => action.validate(), /ENOENT/)
  t.pass()
})

// test('RemoveDirectoryAction.prototype.validate() throws an error if the parent directory of targetDirectory is not a directory', t => {
//   const action = new RemoveDirectoryAction('test/move_directory_action_test.mjs/test')
//   assert.throws(() => action.validate(), /must be a directory/)
//   t.pass()
// })

// test('RemoveDirectoryAction.prototype.validate() throws an error if the parent directory of targetDirectory is not writable', t => {
//   const action = new RemoveDirectoryAction('/sys/mydir')
//   assert.throws(() => action.validate(), /must be writable/)
//   t.pass()
// })

/*
  Leaving RemoveDirectoryAction.prototype.commit() untested intentionally,
  because it's a bit harder to do and requires cleanup etc.
*/
