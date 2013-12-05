'use strict';

exports = module.exports = function(app, mongoose) {
  var dealSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    pageID: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    }
  });
  app.db.model('Deal', dealSchema);
};
