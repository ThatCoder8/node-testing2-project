exports.up = function(knex) {
  return knex.schema.createTable('books', tbl => {
    tbl.increments('id');
    tbl.string('title', 255).notNullable();
    tbl.string('author', 255).notNullable();
    tbl.integer('year').unsigned();
    tbl.string('genre', 255);
    tbl.text('description');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('books');
};
