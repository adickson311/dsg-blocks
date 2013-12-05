define([
  'jquery',
	'calendarData'
], function($, data){
  var DSGCalendar = {
		options: {
			container: 'calendar-container',
		},
		data: {},
		activeSlot: {},
		isActive: false,
		initialize: function(dataPath){
			var that = this;
			
			// Testing - the module accepts pre-loaded data. In production, this would load the data via ajax.
			this.data = data;
			this.render();
			//this.loadData(dataPath);
			
			$('.dup').on('click', function(e){
				e.preventDefault();
				that.duplicateLast();	
			});
			
			$('.calendar-container').on('click', '.slot p' ,function(e){
				e.stopPropagation();
				if(!that.isActive){
					that.activeSlot = $(this).parent();
					that.activateSlot();
				} else {
					if($(this).parent() != that.activeSlot){
						// Out with the old
						that.deactivateSlot();
												
						// In with the new
						that.activeSlot = $(this).parent();
						that.activateSlot();
					}
				}
			});
						
			// Press the enter key
			$(document).keypress(function(e) {
		    if(e.which == 13) {
					if(that.isActive)
						that.deactivateSlot();
		    }
			});
			
			//$('.ticker').addClass('vertical-collapse');
		},		
		loadData: function(dataPath){
			var that = this;
			$.getJSON(dataPath, function(data){
				that.data = data;
				that.render();
			});
		},
		render: function(){
			this.renderKey(this.data.days[0]);
			for(day in this.data.days){
				this.renderDay(this.data.days[day]);
			}
		},
		renderKey: function(day){
			var dayElem = $('<div class="day key"><p class="header-block">&nbsp;</p><p class="header-block">&nbsp;</p></div>');
			
			for(g in day.slotgroups){
				var groupObj = day.slotgroups[g],
				groupElem = $('<div class="group ' + groupObj.name.toLowerCase().replace(/ /g, '') + ' cf"><p class="group-name">' + groupObj.name + '</p></div>'),
				groupKeyElem = $('<div class="key-group"></div>');
				
				for (i in groupObj.items){
					var itemObj = groupObj.items[i],
					itemElem = $('<div class="slot"><div class="box"><p>' + itemObj.slot +'</p></div></div>');
					groupKeyElem.append(itemElem);
				}
				groupElem.append(groupKeyElem);
				dayElem.append(groupElem);
			}
			
			$('.' + this.options.container + ' .dup').before(dayElem);
		},
		renderDay: function(day){
			var dayElem = $('<div class="day"><p class="header-block">'+ day.name+'</p><p class="header-block">'+ day.date+'</p></div>');
			
			for(g in day.slotgroups){
				var groupObj = day.slotgroups[g],
				groupElem = $('<div class="group ' + groupObj.name.toLowerCase().replace(/ /g, '') + '"></div>');
				
				for (i in groupObj.items){
					var itemObj = groupObj.items[i],
							itemElem;
					
					if(itemObj.value == ''){
						itemObj.value = '&nbsp;';
					}
					
					itemElem = $('<div class="slot"><div class="box"><p>' + itemObj.value +'</p></div></div>');
					groupElem.append(itemElem);
				}
				dayElem.append(groupElem);
			}
			
			$('.' + this.options.container + ' .dup').before(dayElem);
		},
		duplicateLast: function(){
			$('.calendar-container .dup').before($('.day:last').clone());
		},
		activateSlot: function(){
			var that = this,
					slotElem = $(this.activeSlot),
					pel = slotElem.find('p'),
					iel = $('<input id="textEdit" />');
			
			that.isActive = true;
			
			// Set the text value of the input
			iel.attr('value', pel.text());
			
			iel.on('blur', function(){
				that.deactivateSlot();
			});
			
			// Hide the P tag
			pel.addClass('hide');
			
			slotElem.append(iel);
			iel.focus();
		},
		deactivateSlot: function(){
			var slotElem = this.activeSlot,
					pel = slotElem.find('p'),
					iel  = slotElem.find('input');
			
			this.isActive = false;
			
			// Check the value for CHANGED
			if(iel.val() != pel.text()){
				slotElem.addClass('change');
				pel.text(iel.val());
			}
			
			// Flip the display black
			pel.removeClass('hide');
			slotElem.find('input').remove()
		}
	}
  return DSGCalendar;
});