'use strict';

exports.init = function(req, res){
  res.render('pages/index');
};

exports.find = function(req, res, next){
  req.query.data = req.query.name ? req.query.data : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';
  
  var filters = {};
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
  req.app.db.models.Page.findById(req.params.id).exec(function(err, page) {
    if (err) {
      return next(err);
    }
    
    if (req.xhr) {
      res.send(page);
    } else {
      req.app.db.models.Deal.find({'page.id': req.params.id}).exec(function(err, deals) {
        res.render('pages/details', { data: { record: JSON.stringify(page), deals: JSON.stringify(deals) } });
      });
    }
  });
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

exports.deals = function(req, res, next){
  req.app.db.models.Deal.find({'page.id': req.params.id}).exec(function(err, results) {
    if (err) {
      return next(err);
    }
    res.json(results);
  });
};