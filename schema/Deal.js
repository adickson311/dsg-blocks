'use strict';

exports = module.exports = function(app, mongoose) {
  var dealSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
    dealID: { type: String, default: '' },
    inStoreOnly: { type: Boolean, default: '' },
    online: { type: Boolean, default: false },
    categories:[{
      name: { type: String, default: ''},
      order: { type: Number, default: '' },  
    }],
    startDate: { type: Date, default: new Date() },
    endDate: { type: Date, default: new Date() },
    headline: { type: String, default: '' },
    disclaimer: { type: String, default: '' },
    redPrice: { type: String, default: '' },
    lPrice1: { type: String, default: '' },
    lPrice2: { type: String, default: '' },
    link: { type: String, default: '' },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    }
  });
  app.db.model('Deal', dealSchema);
};
