'use strict';

exports.init = function(req, res){
  res.render('pages/index');
};

exports.find = function(req, res, next){
  req.query.data = req.query.name ? req.query.data : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';
  
  var filters = {isActive: true};
  if (req.query.data) {
    filters.data = new RegExp('^.*?'+ req.query.name +'.*$', 'i');
  }
  
  if (req.query.isActive) {
    filters.isActive = req.query.isActive;
  }
  
  if (req.query.roles && req.query.roles === 'admin') {
    filters['roles.admin'] = { $exists: true };
  }
  
  if (req.query.roles && req.query.roles === 'account') {
    filters['roles.account'] = { $exists: true };
  }
  
  req.app.db.models.Page.pagedFind({
    filters: filters,
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }
    
    if (req.xhr) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      res.render('pages/index', { data: { results: JSON.stringify(results) } });
    }
  });
};

exports.read = function(req, res, next){
  var outcome = {};
  
  var getRecord = function(callback) {
    req.app.db.models.Page.findById(req.params.id).exec(function(err, page) {
      if (err) {
        return next(err);
      }
      
      outcome.page = page;
      return callback(null, 'done');
    });
  };
  
  var getDeals = function(callback) {
    var searchFields = {
      'page': req.params.id
    };
    
    if(!req.query.allDeals) {
      searchFields.isActive = true;
    }
    
    req.app.db.models.Deal.find(searchFields).exec(function(err, deals) {
      if (err) {
        return next(err);
      }
      
      outcome.deals = deals;
      return callback(null, 'done');
    });
  };
  
  var asyncFinally = function(err, results) {
    if (err) {
      return next(err);
    }
    
    if (req.xhr) {
      res.send(outcome.page);
    } else {
      res.render('pages/details', { 
        data: { 
          record: JSON.stringify(outcome.page),
          deals: JSON.stringify(outcome.deals)
        }
      });
    }
  };
  
  require('async').parallel([getDeals, getRecord], asyncFinally);
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  workflow.on('validate', function() {
    if (!req.body.name) {
      workflow.outcome.errors.push('Name is required.');
      return workflow.emit('response');
    }
    
    workflow.emit('addPage');
  });
  
  workflow.on('addPage', function() {
    var pageToAdd = {
      name: req.body.name,
      userCreated: {
        id: req.user._id,
        name: req.user.username,
        time: new Date().toISOString()
      }
    };
    
    req.app.db.models.Page.create(pageToAdd, function(err, status) {
      if (err) {
        console.log('bad save');
        return workflow.emit('exception', err);
      }
      
      workflow.outcome.record = status;
      return workflow.emit('response');
    });
  });
  
  console.log('ok');
  
  workflow.emit('validate');
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.on('validate', function() {
    /*if (!req.body.categories) {
      workflow.outcome.errfor.categories = 'required';
      return workflow.emit('response');
    }*/
    
    workflow.emit('patchPage');
  });
  
  workflow.on('patchPage', function() {
    var fieldsToSet = {
      isActive: req.body.isActive
    };
    
    req.app.db.models.Page.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, page) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('response');
      
      /*page.populate('name', function(err, page) {
        if (err) {
          return workflow.emit('exception', err);
        }
        
        workflow.outcome.page = page;
        workflow.emit('response');
      });*/
    });
  });
  
  workflow.emit('validate');
};

exports.categories = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.on('validate', function() {
    if (!req.body.categories) {
      workflow.outcome.errfor.categories = 'required';
      return workflow.emit('response');
    }
    
    workflow.emit('patchPage');
  });
  
  workflow.on('patchPage', function() {
    var fieldsToSet = {
      categories: req.body.categories
    };
    
    req.app.db.models.Page.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, page) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.emit('response');
      
      /*page.populate('name', function(err, page) {
        if (err) {
          return workflow.emit('exception', err);
        }
        
        workflow.outcome.page = page;
        workflow.emit('response');
      });*/
    });
  });
  
  workflow.emit('validate');
};

exports.deals = function(req, res, next){
  req.app.db.models.Deal.find({'page': req.params.id, 'isActive': true}).exec(function(err, results) {
    if (err) {
      return next(err);
    }
    res.json(results);
  });
};

exports.preview = function(req, res, next){
  req.app.db.models.Page.findById(req.params.id).exec(function(err, page) {
    if (err) {
      return next(err);
    }
    
    if (req.xhr) {
      res.send(page);
    } else {
      res.render('pages/preview', { 
        data: { 
          dealType: req.query.dealType,
          record: page
        }
      });
    }
  });
};