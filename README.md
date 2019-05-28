# About

[![Build status][BS img]][Build status]

Alternative `fs` API that returns actions that can be easily tested.

So rather than using `fs.mkdir` and having a new directory as a result, use:

```js
import { CreateDirectoryAction } from 'fs-actions'

const action = new CreateDirectoryAction('logs')
action.commit()
```

This might look like a lot of typing for nothing, but if you return these actions from functions, then you'll get something that's easily testable.

Furthermore you can return list of actions:

```js
import { FileActions, CreateDirectoryAction } from 'fs-actions'

const actions = new FileActions
actions.add(new CreateDirectoryAction('logs'))

actions.commit()
```

This is especially useful, if you're working on a script that will run at once. You'll build all the actions up front, so they are easily testable, and then commit them at once.

Additionally this library does some basic validations, so it won't happen that you'd be trying to write a file into a non-existing directory etc.

# API

## FileSystemActions

An array-like structure meant to avoid iterating over the actions manually.

```js
/*
  The constructor takes a splat of actions.

  All the actions must have  `.validate`, `.message` and `.commit`
  methods. These actions might be instances of a class that extends
  `FileSystemAction`, but it's not a requirement.
*/
const actions = new FileSystemActions(...[new CreateDirectoryAction('logs')])

/*
  Call the `.validate` method on all the actions.

  If the validation fails, an error will be raised.
*/
try {
  actions.validate()
} catch(error) {
  // TODO: handle validation errors.
  // As of now, there's no custom ValidationError class,
  // see https://github.com/botanicus/fs-actions/issues/1
}

/*
  Commit all the actions to the FS.

  As the validations supposedly run beforehand, we don't expect errors here,
  but they might happen.
*/
actions.commit()

/*
  If it's so desired, we can specify where output of the `.message`
  method is going to be logged.
*/
actions.commit((message) => logger.info(message))
```

## FileSystemAction

Superclass meant for creating new action classes. Useless on its own.

Currently only defines `.validate`, `.message` and `.commit` methods that throws an error guiding the developer to define these in his action class.

## MoveFileAction

Alternative of the `mv` utility. Works only on moving a file into an existing directory.

```js
const action = new MoveFileAction('/etc/profile', '/home/botanicus/backup')

/*
  Make sure the file exists, is a file and that the target directory exists as well.
*/
try {
  action.validate()
} catch(error) {
 // TODO: handle validation errors.
}

console.log(action.message())
action.commit()
```

## FileWriteAction

Writes content in string into a new file.

```js
const action = new FileWriteAction('/home/botanicus/data.json', "line 1\nline 2\n")

/*
  Make sure the parent directory of the target file exists.
*/
try {
  action.validate()
} catch(error) {
 // TODO: handle validation errors.
}

console.log(action.message())
action.commit()
```

## CreateDirectoryAction

Alternative to the `mkdir` utility, without the `-p` argument.

```js
const action = new CreateDirectoryAction('/home/botanicus/new_project')

/*
  Make sure the parent directory of the target directory exists.
*/
try {
  action.validate()
} catch(error) {
 // TODO: handle validation errors.
}

console.log(action.message())
action.commit()
```

[Build status]: https://travis-ci.org/botanicus/fs-actions

[BS img]: https://travis-ci.org/botanicus/fs-actions.svg?branch=master
