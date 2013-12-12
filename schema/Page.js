'use strict';

exports = module.exports = function(app, mongoose) {
  var pageSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    },
    categories: [String]
  });
  pageSchema.plugin(require('./plugins/pagedFind'));
  app.db.model('Page', pageSchema);
};
