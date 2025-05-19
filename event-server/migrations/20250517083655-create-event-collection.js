module.exports = {
  async up(db, client) {
    await db.createCollection('events');
  },

  async down(db, client) {
    await db.collection('events').drop();
  }
};