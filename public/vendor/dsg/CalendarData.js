define([], function(){
  var CalendarData = {
	schema: {
		slotgroups:[ 
			{
				name: "Ticker",
				items: ["fl", "r", "test", "bannerHat"]
			},
			{
				name: "Priorities",
				items: ["a", "p", "b1", "b2"]
			},
			{
				name: "Trending",
				items: ["c1", "c2", "c3"]
			},
			{
				name: "Top Products",
				items: ["c4", "c5", "c6"]
			},
			{
				name: "Spotlight",
				items: ["c7", "c8", "c9"]
			},
			{
				name: "Brands",
				items: ["d1", "d2", "d3"]
			},
			{
				name: "Company Support",
				items : ["e1", "e2", "e3"]
			},
			{
				name: 'Mobile',
				items : ["t", "m1", "m2", "m3", "m4", "m5"]
			}
		]
	},
	days: [
		{
			name: "Tuesday",
			date: "11/24/2013",
			slotgroups:[ 
				{
					name: "Ticker",
					items: [
						{slot: "fl", value: "(0010) $20 off orders $100 or more"},
						{slot: "r", value: "FS No Minimum & FRS FTWR"},
						{slot: "test", value: ""},
						{slot: "bannerHat", value: "Countdown to Black Friday Gift Guide"}
					],
				},
				{
					name: "Priorities",
					items: [
						{slot: "a", value: "Black Friday Pre-Sale"},
						{slot: "p", value: "Holiday Hub"},
						{slot: "b1", value: "World Cup Pre-Sale"},
						{slot: "b2", value: "Gift Guide"}
					]
				},
				{
					name: "Trending",
					items: [
						{slot: "c1", value: "Turkeybowl"},
						{slot: "c2", value: "Hunt"},
						{slot: "c3", value: "Weekly Deals"}
					]
				},
				{
					name: "Top Products",
					items: [
						{slot: "c4", value: "Golf (TaylorMade - All I Want for Christmas)"},
						{slot: "c5", value: "Derrick Rose Launch"},
						{slot: "c6", value: "World Cup (adidas Samba Launch)"}
					]
				},
				{
					name: "Spotlight",
					items: [
						{slot: "c7", value: "Jersey Report"},
						{slot: "c8", value: "Gift Locker"},
						{slot: "c9", value: "St. Jude"}
					]
				},
				{
					name: "Brands",
					items: [
						{slot: "d1", value: "Nike"},
						{slot: "d2", value: "UA"},
						{slot: "d3", value: "The North Face"}
					]
				},
				{
					name: "Company Support",
					items : [
						{slot: "e1", value: "Scorecard"},
						{slot: "e2", value: "Mobile"},
						{slot: "e3", value: "The Pros"}
					]
				},
				{
					name: 'Mobile',
					items : [
						{slot: "t", value: "(0010) $20 off orders $100 or more"},
						{slot: "m1", value: "$20 off orders $100 or more"},
						{slot: "m2", value: "Black Friday Pre-Sale"},
						{slot: "m3", value: "World Cup Pre-Sale"},
						{slot: "m4", value: "Holiday Hub"},
						{slot: "m5", value: "Turkeybowl"}
					]
				}
			]
		},
		{
			name: "Wednesday",
			date: "11/24/2013",
			slotgroups:[ 
				{
					name: "ticker", 
					items: [
						{slot: "fl", value: "(0010) $20 off orders $100 or more"},
						{slot: "r", value: "FS No Minimum & FRS FTWR"},
						{slot: "test", value: ""},
						{slot: "bannerHat", value: "Countdown to Black Friday Gift Guide"}
					],
				},
				{
					name: "priorities",
					items: [
						{slot: "a", value: "Black Friday Pre-Sale"},
						{slot: "p", value: "Holiday Hub"},
						{slot: "b1", value: "World Cup Pre-Sale"},
						{slot: "b2", value: "Gift Guide"}
					]
				},
				{
					name: "trending",
					items: [
						{slot: "c1", value: "Turkeybowl"},
						{slot: "c2", value: "Hunt"},
						{slot: "c3", value: "Weekly Deals"}
					]
				},
				{
					name: "topProducts",
					items: [
						{slot: "c4", value: "Golf (TaylorMade - All I Want for Christmas)"},
						{slot: "c5", value: "Derrick Rose Launch"},
						{slot: "c6", value: "World Cup (adidas Samba Launch)"}
					]
				},
				{
					name: "spotlight",
					items: [
						{slot: "c7", value: "Jersey Report"},
						{slot: "c8", value: "Gift Locker"},
						{slot: "c9", value: "St. Jude"}
					]
				},
				{
					name: "brands",
					items: [
						{slot: "d1", value: "Nike"},
						{slot: "d2", value: "UA"},
						{slot: "d3", value: "The North Face"}
					]
				},
				{
					name: "companySupport",
					items : [
						{slot: "e1", value: "Scorecard"},
						{slot: "e2", value: "Mobile"},
						{slot: "e3", value: "The Pros"}
					]
				},
				{
					name: 'mobile',
					items : [
						{slot: "t", value: "(0010) $20 off orders $100 or more"},
						{slot: "m1", value: "$20 off orders $100 or more"},
						{slot: "m2", value: "Black Friday Pre-Sale"},
						{slot: "m3", value: "World Cup Pre-Sale"},
						{slot: "m4", value: "Holiday Hub"},
						{slot: "m5", value: "Turkeybowl"}
					]
				}
			]
		}
	]
}
return CalendarData;
});