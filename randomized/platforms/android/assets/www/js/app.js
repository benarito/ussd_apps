/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	dataStore: [],
	swahili: [{
		href: 'airtime.html',
		text: "Muda Wa Maongezi"
	}, {
		href: 'balance_enquiry.html',
		text: "Uliza Salio"
	}, {
		href: 'utility_payment.html',
		text: 'Malipo Ya Huduma'
	}, {
		href: 'funds_transfer.html',
		text: 'Kuhamisha Pesa'
	}, {
		href: 'cheque_book_request.html',
		text: 'Maombi ya Hundi'
	}, {
		href: 'mini_statement.html',
		text: 'Taarifa Fupi'
	}, {
		href: 'full_statement.html',
		text: 'Taarifa Kamili'
	}, {
		href: 'withdraw_cash.html',
		text: 'Kutoa Pesa'
	}, {
		href: 'settings.html',
		text: 'Mpangilio'
	}],

	english: [{
		href: 'airtime.html',
		text: "Airtime"
	}, {
		href: 'balance_enquiry.html',
		text: "Balance Enquiry"
	}, {
		href: 'utility_payment.html',
		text: 'Utility Payment'
	}, {
		href: 'funds_transfer.html',
		text: 'Funds Transfer'
	}, {
		href: 'cheque_book_request.html',
		text: 'Cheque Book Request'
	}, {
		href: 'mini_statement.html',
		text: 'Mini Statement'
	}, {
		href: 'full_statement.html',
		text: 'Full Statement'
	}, {
		href: 'withdraw_cash.html',
		text: 'Withdraw Cash'
	}, {
		href: 'settings.html',
		text: 'Settings'
	}],
	populateDs: function(item) {
		this.dataStore.push(item);
	},
	surveyId: null,
	appStartTimeStamp: null,
	currentPageTimestamp: null,
	pageOrder: 1,
	prevPage: "index",
	timeTracker: function(curTimeStamp) {
		var floorTimeStamp = this.currentPageTimestamp;
		this.currentPageTimestamp = curTimeStamp;
		return moment.duration(moment(curTimeStamp).diff(moment(floorTimeStamp)))._milliseconds;
	},
	textAnalyticsEngine: function(inputTxt) {
		var backspaceCount = 0;
		var totalKeyPressCount = 0
		var timeStartTyping = 0;
		var timeStopTyping = 0;
		var timeSpentInField = 0;
		var finalInputValue;
		var finalInputLength;
		var intelliWordChanges = [""];
		var intelliWordIndex = 0;
		var inputStream = ""

		inputTxt.change(function(e) {
			finalInputValue = inputTxt.val();
			finalInputLength = inputTxt.val().length;
			timeStopTyping = e.timeStamp;
			timeSpentInField = moment.duration(moment(timeStopTyping).diff(moment(timeStartTyping)));
			intelliWordChanges.shift();
			console.log(intelliWordChanges);
		}).keypress(function(e) {
			totalKeyPressCount++;
			if (e.keyCode != 8) {
				inputStream += e.key;
			}

			if (e.keyCode == 8) {
				backspaceCount++;
				if (inputTxt.val().length == 1) {
					intelliWordIndex++;
					intelliWordChanges[intelliWordIndex] = inputStream;
					inputStream = "";
				}

			}
			if (inputTxt.val().length == 1) {
				timeStartTyping = e.timeStamp;
			}

		});


	},
	util: {
		getPageTitleFromUrl: function(absUrl) {
			var pageIdMatch = /\/(\w+)\./;
			return pageIdMatch.exec(absUrl)[1];
		}

	},

	// Application Constructor
	initialize: function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		//this.onDeviceReady();
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},


	onDeviceReady: function() {

		if (app.surveyId == null) {
				$.mobile.changePage("survey_id.html", {
					role: "dialog"
				});
			}

		$(document).on('pageinit', 'div:jqmData(role="page")', function(event){

			if (app.surveyId == null) {
				$.mobile.changePage("survey_id.html", {
					role: "dialog"
				});
			}

			var emenu = $("#english-menu");
			if(emenu) {
				app.populateEnglishMenu();
			}

			var kmenu = $("#swahili-menu");
			if(kmenu) {
				app.populateSwahiliMenu();
			}
		});

		document.addEventListener("pause", function() {
			app.save();
		}, false);

		document.addEventListener("pause", function() { app.save(); }, false);

		app.appStartTimeStamp = app.getTimeStamp();
		app.currentPageTimestamp = app.appStartTimeStamp;
		app.english = app.shuffle(app.english);
		app.swahili = app.shuffle(app.swahili);

		$(window).on("pagecontainerload", function(event, data) {

			var pageAnalytics = {};

			pageAnalytics.timeStamp = app.getTimeStamp();
			pageAnalytics.timeSpent = app.timeTracker(event.timeStamp);

			var absUrl = data.absUrl;
			var thePreviousPage = app.prevPage;
			var currentPage = app.util.getPageTitleFromUrl(absUrl);
			pageAnalytics.previousPage = thePreviousPage;
			pageAnalytics.pageName = currentPage;

			pageAnalytics.pageOrder = app.pageOrder;
			app.pageOrder++;
			app.prevPage = currentPage;
			var inputTxt = $(data.page).find("input");
			var isInputPresent = inputTxt.length ? "yes" : "no";
			pageAnalytics.isInputPresent = isInputPresent;
			pageAnalytics.inputStats = null;

			var inputFieldAnalytics = null;

			if (inputTxt.length) {
				var backspaceCount = 0;
				var totalKeyPressCount = 0
				var timeStartTyping = 0;
				var timeStopTyping = 0;
				var timeSpentInField = 0;
				var finalInputValue;
				var finalInputLength;
				var intelliWordChanges = [""];
				var intelliWordIndex = 0;
				var inputStream = ""

				inputTxt.change(function(e) {
					finalInputValue = inputTxt.val();
					finalInputLength = inputTxt.val().length;
					timeStopTyping = app.getTimeStamp();
					timeSpentInField = moment.duration(moment(timeStopTyping).diff(moment(timeStartTyping)))._milliseconds;
					intelliWordChanges.shift();
					var inputStatistics = {
						backspaceCount: backspaceCount,
						totalKeyPressCount: totalKeyPressCount,
						timeStartTyping: timeStartTyping,
						timeStopTyping: timeStopTyping,
						timeSpentInField: timeSpentInField,
						finalInputValue: finalInputValue,
						finalInputLength: finalInputLength,
						intelliWordChanges: intelliWordChanges.toString(),
						intelliWordIndex: intelliWordIndex

					}
					pageAnalytics.inputStats = inputStatistics;
					app.populateDs(pageAnalytics);


				}).keyup(function(e) {
					totalKeyPressCount++;
					if (e.keyCode != 8 || e.keyCode != 46) {
						inputStream += e.key;
					}

					if (e.keyCode == 8 || e.keyCode == 46) {
						backspaceCount++;
						if (inputTxt.val().length == 1) {
							intelliWordIndex++;
							intelliWordChanges[intelliWordIndex] = inputStream;
							inputStream = "";
						}

					}
					if (inputTxt.val().length == 1) {
						timeStartTyping = app.getTimeStamp();
					}

				}).focus(function(e) {
					// console.log(e.timeStamp);
				});

			} else {
				app.populateDs(pageAnalytics);
			}



		});

		$(document).on("click", "#survey-complete", function() {

			app.save();

		});

		$(document).on("click", "#survey-id-submit", function() {

			var x = $("#survey-id").val();

			if (x !== "") {

				app.surveyId = x;
				$('[data-role=dialog]').dialog("close");

			}

		});

	},

	shuffle: function(array) {
		var currentIndex = array.length,
			temporaryValue, randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	},

	populateEnglishMenu: function() {
		var menu = $("#english-menu");
		var content = "";
		for (var i = 0; i < app.english.length; i++) {
			var item = app.english[i];
			content += '<a href="' + item.href + '" data-role="button"data-theme="c" data-icon="carat-r" data-iconpos="right" data-transition="slide" class="ui-link ui-btn ui-btn-c ui-icon-carat-r ui-btn-icon-right ui-shadow ui-corner-all" role="button">' + item.text + '</a>';
		}
		menu.html(content);
	},

	populateSwahiliMenu: function() {
		var menu = $("#swahili-menu");
		var content = "";
		for (var i = 0; i < app.swahili.length; i++) {
			var item = app.swahili[i];
			content += '<a href="' + item.href + '" data-role="button" data-theme="c" data-icon="carat-r" data-iconpos="right" data-transition="slide" class="ui-link ui-btn ui-btn-c ui-icon-carat-r ui-btn-icon-right ui-shadow ui-corner-all" role="button">' + item.text + '</a>';
		}
		menu.html(content);
	},

	getTimeStamp: function() {

		var date = new Date();

		return date.getTime();
	},

	save: function() {
		$.mobile.loading('show', {
			text: 'Saving',
			theme: 'z',
			textVisible: true
		});
		$.ajax({
			type: "POST",
			url: "http://ec2-54-173-205-147.compute-1.amazonaws.com/busara/busara.php",
			data: {
				analytics: app.dataStore,
				application: 'randomized',
				user: "40004" + app.surveyId,
				english: app.english,
				swahili: app.swahili
			},
			dataType: "text",
			error: function() {
				//$('.ui-loader').hide();
				$.mobile.loading('hide');
				//TODO logic  to resend request
			},
			success: function(data) {
				//$('.ui-loader').hide();
				$.mobile.loading('hide');
				app.dataStore = [];

			}
		});
	}
};

app.initialize();