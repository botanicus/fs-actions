import test from 'ava'
import assert from 'assert'
import { FileSystemAction } from '../'

const action = new FileSystemAction()

test('FileSystemAction.prototype.validate() throws a non implemented error', t => {
  assert.throws(() => action.validate(), /Override this method/)
  t.pass()
})

test('FileSystemAction.prototype.message() throws a non implemented error', t => {
  assert.throws(() => action.message(), /Override this method/)
  t.pass()
})

test('FileSystemAction.prototype.commit() throws a non implemented error', t => {
  assert.throws(() => action.commit(), /Override this method/)
  t.pass()
})
