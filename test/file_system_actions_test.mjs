import test from 'ava'
import assert from 'assert'
import { FileSystemActions } from '../'

const list = [
  {
    validate: new Function,
    message: new Function,
    commit: new Function
  }
]

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
