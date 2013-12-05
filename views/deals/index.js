'use strict';

exports.init = function(req, res, next){
	
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  workflow.on('validate', function() {
    if (!req.body.name) {
      workflow.outcome.errors.push('Name is required.');
      return workflow.emit('response');
    }
    
    workflow.emit('addDeal');
  });
  
  workflow.on('addDeal', function() {
    var dealToAdd = {
      name:  req.body.name,
      pageID:  req.body.pageID,
      userCreated: {
        id: req.user._id,
        name: req.user.username,
        time: new Date().toISOString()
      }
    };
    
    req.app.db.models.Deal.create(dealToAdd, function(err, status) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      workflow.outcome.record = status;
      return workflow.emit('response');
    });
  });
	
  workflow.emit('validate');
};


exports.read = function(req, res, next){
  req.app.db.models.Deal.findById(req.params.id).exec(function(err, deal) {
    if (err) {
      return next(err);
    }
    
    if (req.xhr) {
      res.send(deal);
    } else {
       res.render('deals/details', { data: { record: JSON.stringify(deal) } });
    }
  });
};