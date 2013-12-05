'use strict';

exports = module.exports = function(app, mongoose) {
  var pageSchema = new mongoose.Schema({
    data: { type: String, default: '' },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    }
  });
  pageSchema.plugin(require('./plugins/pagedFind'));
	app.db.model('Page', pageSchema);
};
