import test from 'ava'
import assert from 'assert'
import { CreateDirectoryAction } from '../'

/* The constructor. */
test('CreateDirectoryAction cannot be instantiated without targetDirectoryPath', t => {
  assert.throws(() => new CreateDirectoryAction(), /targetDirectoryPath/)
  t.pass()
})

test('CreateDirectoryAction can be instantiated with targetDirectoryPath', t => {
  assert.doesNotThrow(() => new CreateDirectoryAction('test'))
  t.pass()
})

test('CreateDirectoryAction has targetDirectoryPath property', t => {
  const action = new CreateDirectoryAction('test')
  assert(action.targetDirectoryPath)
  t.pass()
})

/* CreateDirectoryAction.prototype.validate() */
test('CreateDirectoryAction.prototype.validate() throws an error if the parent directory of targetDirectoryPath does not exist', t => {
  const action = new CreateDirectoryAction('/a/b/c')
  assert.throws(() => action.validate(), /ENOENT/)
  t.pass()
})

test('CreateDirectoryAction.prototype.validate() throws an error if the parent directory of targetDirectory is not a directory', t => {
  const action = new CreateDirectoryAction('test/move_file_action_test.mjs/test')
  assert.throws(() => action.validate(), /must be a directory/)
  t.pass()
})

test('CreateDirectoryAction.prototype.validate() throws an error if the parent directory of targetDirectory is not writable', t => {
  const action = new CreateDirectoryAction('/sys/mydir')
  assert.throws(() => action.validate(), /must be writable/)
  t.pass()
})

/* CreateDirectoryAction.prototype.message() */
test('CreateDirectoryAction.prototype.message() contains information about what is being moved where', t => {
  const action = new CreateDirectoryAction('test')
  assert(action.message().match(/test/))
  t.pass()
})

/*
  Leaving CreateDirectoryAction.prototype.commit() untested intentionally,
  because it's a bit harder to do and requires cleanup etc.
*/
