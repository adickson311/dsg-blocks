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
      page: {
        id:  req.body.page.id,
        name:  req.body.page.name
      },
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

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.on('validate', function() {
    if (!req.body.isActive) {
      req.body.isActive = 'no';
    }
    
    if (!req.body.username) {
      workflow.outcome.errfor.username = 'required';
    }
    else if (!/^[a-zA-Z0-9\-\_]+$/.test(req.body.username)) {
      workflow.outcome.errfor.username = 'only use letters, numbers, \'-\', \'_\'';
    }
    
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
    }
    else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
      workflow.outcome.errfor.email = 'invalid email format';
    }
    
    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }
    
    workflow.emit('updateDeal');
  });
  
  workflow.on('updateDeal', function() {
    var fieldsToSet = {
      isActive: req.body.isActive,
      username: req.body.username,
      email: req.body.email.toLowerCase(),
      search: [
        req.body.username,
        req.body.email
      ]
    };
    
    req.app.db.models.Deal.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, deal) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      // DO SOMETHING HERE
    });
  });
  
  workflow.emit('validate');
};