require.config({
    baseUrl: 'vendor/',
    paths: {
        jquery: 'jquery/jquery-1.10.2',
				dsgCalendar: 'dsg/DSGCalendar',
				calendarData: 'dsg/CalendarData'
    }
});

require([
  'jquery',
	'dsgCalendar',
], function($, DSGCalendar){
  var dataPath = 'http://dsp.imageg.net/graphics/media/dsp/ad/calendar.json';
	DSGCalendar.initialize(dataPath);
});