module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany(
      { role: { $exists: false } },
      { $set: { role: 'USER' } }
    );
  },

  async down(db, client) {
    await db.collection('users').updateMany(
      {},
      { $unset: { role: "" } }
    );
  }
};