const db = require('../../data/db-config');

module.exports = {
  find,
  findById,
  add,
  update,
  remove
};

function find() {
  return db('books');
}

function findById(id) {
  return db('books').where({ id }).first();
}

async function add(book) {
  const [id] = await db('books').insert(book);
  return findById(id);
}

async function update(id, changes) {
  await db('books').where({ id }).update(changes);
  return findById(id);
}

function remove(id) {
  return db('books').where({ id }).del();
}
