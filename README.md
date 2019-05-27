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

## FileSystemAction

## MoveFileAction

## FileWriteAction

## CreateDirectoryAction


[Build status]: https://travis-ci.org/botanicus/fs-actions

[BS img]: https://travis-ci.org/botanicus/fs-actions.svg?branch=master
