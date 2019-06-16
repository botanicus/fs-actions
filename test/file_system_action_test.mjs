import test from 'ava'
import assert from 'assert'
import { FileSystemAction } from '../'

const action = new FileSystemAction()

test('FileSystemAction.prototype.validate() throws a non implemented error', t => {
  assert.throws(() => action.validate(), /Override FileSystemAction.validate/)
  t.pass()
})

test('FileSystemAction.prototype.commit() throws a non implemented error', t => {
  assert.throws(() => action.commit(), /Override FileSystemAction.commit/)
  t.pass()
})
