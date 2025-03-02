exports.seed = function(knex) {
  return knex('books').truncate()
    .then(function () {
      return knex('books').insert([
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          year: 1960,
          genre: 'Fiction',
          description: 'The story of racial injustice and the loss of innocence in the American South.'
        },
        {
          title: '1984',
          author: 'George Orwell',
          year: 1949,
          genre: 'Dystopian',
          description: 'A novel about a totalitarian future society.'
        },
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          year: 1925,
          genre: 'Fiction',
          description: 'A story that explores themes of decadence and idealism.'
        }
      ]);
    });
};
