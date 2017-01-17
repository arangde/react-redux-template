import pmongo from 'promised-mongo';

let MONGODB_URI = 'reduxtest';

if (process.env.MONGODB_URI) MONGODB_URI = process.env.MONGODB_URI;

const db = pmongo(MONGODB_URI, {
  authMechanism: 'ScramSHA1'
}, ['todos']);

console.log('Setup db.reduxtest with "todos" collections');

const todos = [
  'Prepare new Billing format',
  'Create benefits presentation',
  'Prepare productivity report',
  'Review non-exempt evaluations',
  'Update insurance information',
];

async function setup() {
  // clear users and todos collections
  await db.todos.drop();
  console.log('Cleared "todos" collections');

  // load todos
  for (var i = 0; i < todos.length; i++) {
    await db.todos.update({todo: todos[i]}, {$set: {
      todo: todos[i],
      completed: false,
    }}, {upsert: true});
  }

  console.log('Finished creating sample todos');

  db.close();

  process.exit();
}

setup();
