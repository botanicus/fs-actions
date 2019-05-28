import test from 'ava'
import assert from 'assert'
import { FileSystemActions } from '../'

const list = [
  {
    validate: new Function(),
    message: new Function(),
    commit: new Function()
  },
  {
    validate: new Function(),
    message: new Function(),
    commit: new Function()
  }
]

/* The constructor. */
test('FileSystemActions can be instantiated without any arguments', t => {
  assert.doesNotThrow(() => new FileSystemActions())
  const actions = new FileSystemActions()
  assert.strictEqual(actions.actions.length, 0)
  t.pass()
})

test('FileSystemActions can be instantiated with a list of valid actions', t => {
  assert.doesNotThrow(() => new FileSystemActions(...list))
  const actions = new FileSystemActions(...list)
  assert.strictEqual(actions.actions.length, list.length)
  t.pass()
})

test('FileSystemActions cannot be instantiated with a list of other objects', t => {
  assert.throws(() => new FileSystemActions({}), /must have .validate/)
  t.pass()
})

/* FileSystemActions.prototype.add() */
test('FileSystemActions.prototype.add() takes a list of valid actions', t => {
  const actions = new FileSystemActions()
  assert.doesNotThrow(() => actions.add(...list))
  assert.strictEqual(actions.actions.length, list.length)
  t.pass()
})

test('FileSystemActions.prototype.add() does not take other objects', t => {
  const actions = new FileSystemActions()
  assert.throws(() => actions.add({}), /must have .validate/)
  t.pass()
})

/* FileSystemActions.prototype.validate() */
test('FileSystemActions.prototype.validate() validates all the objects and returns true on success', t => {
  const actions = new FileSystemActions(...list)
  assert.doesNotThrow(() => actions.validate())
  assert.deepEqual(actions.validate(), true)
  t.pass()
})

/* Note that the error on failure is actually expected to be raised in each action's .validate method. */
test('FileSystemActions.prototype.validate() validates all the objects and raises an error on failure', t => {
  const actionFailingValidation = {
    validate: () => throw 'Validation error',
    message: new Function(),
    commit: new Function()
  }
  const actions = new FileSystemActions(actionFailingValidation)
  assert.throws(() => actions.validate())
  t.pass()
})

/*
  Leaving FileSystemActions.prototype.commit() untested intentionally,
  because it's a bit harder to do and requires cleanup etc.
*/
