'use strict';

exports = module.exports = function(app, mongoose) {
  var pageSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    },
    categories:  { type: [String], default: ["Top Deals"] }
  });
  pageSchema.plugin(require('./plugins/pagedFind'));
  app.db.model('Page', pageSchema);
};
