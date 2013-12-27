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
      page: req.body.page.id,
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
  req.app.db.models.Deal.findById(req.params.id).populate('page').exec(function(err, deal) {
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
    
    /*if (!req.body.name) {
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
    }*/
    
    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }
    
    workflow.emit('patchDeal');
  });
  
  
  
  workflow.on('patchDeal', function() {
    var fieldsToSet = {
      name: req.body.name,
      page: req.body.page,
      headline: req.body.headline,
      disclaimer: req.body.disclaimer,
      available: req.body.available,
      inStoreOnly: req.body.inStoreOnly,
      online: req.body.online,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      link: req.body.link.toLowerCase()
    };
    
    req.app.db.models.Deal.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, deal) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      workflow.outcome.record = deal;
      return workflow.emit('response');
    });
  });
  
  workflow.emit('validate');
};

exports.categories = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.on('validate', function() {
    /*if (!req.body.name) {
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
    }*/
    
    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }
    
    workflow.emit('patchDeal');
  });
  
  
  
  workflow.on('patchDeal', function() {
    var fieldsToSet = {
      categories: req.body.categories
    };
    
    req.app.db.models.Deal.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, deal) {
      if (err) {
        return workflow.emit('exception', err);
      }
      
      workflow.outcome.record = deal;
      return workflow.emit('response');
    });
  });
  
  workflow.emit('validate');
};