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
    dataStore:[],
    appStartTimeStamp:null,
    currentPageTimestamp:null,
    pageOrder:1,
    prevPage:"index",
    timeTracker:function(curTimeStamp){
        var floorTimeStamp = this.currentPageTimestamp;
        this.currentPageTimestamp = curTimeStamp;
        return moment.duration(moment(curTimeStamp).diff(moment(floorTimeStamp)))._milliseconds;
    },
    textAnalyticsEngine:function(inputTxt){
        var backspaceCount = 0;
        var totalKeyPressCount = 0
        var timeStartTyping=0;
        var timeStopTyping=0;
        var timeSpentInField=0;
        var finalInputValue;
        var finalInputLength;
        var intelliWordChanges = [""];
        var intelliWordIndex = 0;
        var inputStream = ""

        inputTxt.change(function(e){
            finalInputValue = inputTxt.val();
            finalInputLength = inputTxt.val().length;
            timeStopTyping = e.timeStamp;
            timeSpentInField = moment.duration(moment(timeStopTyping).diff(moment(timeStartTyping)));
            intelliWordChanges.shift();
            console.log(intelliWordChanges);
        }).keypress(function(e){
            totalKeyPressCount++;
            if(e.keyCode != 8){
                inputStream += e.key;
            }

            if(e.keyCode == 8){
                backspaceCount++;
                if(inputTxt.val().length==1){
                    intelliWordIndex++;
                    intelliWordChanges[intelliWordIndex] = inputStream;
                    inputStream ="";
                }

            }
            if(inputTxt.val().length == 1){
                timeStartTyping = e.timeStamp;
            }

        });


    },
    util:{
        getPageTitleFromUrl:function(absUrl){
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
        this.onDeviceReady();
        //document.addEventListener('deviceready', this.onDeviceReady, false);
    },


    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
        app.appStartTimeStamp = moment().valueOf();
        app.currentPageTimestamp = app.appStartTimeStamp;
        $(window).on("pagecontainerload",function(event,data){

            var pageAnalytics = {};

            pageAnalytics.timeStamp = event.timeStamp;
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
            var isInputPresent = inputTxt.length ? "yes":"no";
            pageAnalytics.isInputPresent = isInputPresent;

            if(inputTxt.length){
                var backspaceCount = 0;
                var totalKeyPressCount = 0
                var timeStartTyping=0;
                var timeStopTyping=0;
                var timeSpentInField=0;
                var finalInputValue;
                var finalInputLength;
                var intelliWordChanges = [""];
                var intelliWordIndex = 0;
                var inputStream = ""

                inputTxt.change(function(e){
                    finalInputValue = inputTxt.val();
                    finalInputLength = inputTxt.val().length;
                    timeStopTyping = e.timeStamp;
                    /*console.log(timeStartTyping);*/
                    console.log(timeStopTyping);
                    timeSpentInField = moment.duration(moment(timeStopTyping).diff(moment(timeStartTyping)));
                    intelliWordChanges.shift();
                    var inputStatistics = {
                        backspaceCount:backspaceCount,
                        totalKeyPressCount:totalKeyPressCount,
                        timeStartTyping:timeStartTyping,
                        timeStopTyping:timeStopTyping,
                        timeSpentInField:timeSpentInField,
                        finalInputValue:finalInputValue,
                        finalInputLength:finalInputLength,
                        intelliWordChanges:intelliWordChanges,
                        intelliWordIndex:intelliWordIndex

                    }
                    //console.log(inputStatistics);

                }).keypress(function(e){
                    totalKeyPressCount++;
                    if(e.keyCode != 8){
                        inputStream += e.key;
                    }

                    if(e.keyCode == 8){
                        backspaceCount++;
                        if(inputTxt.val().length==1){
                            intelliWordIndex++;
                            intelliWordChanges[intelliWordIndex] = inputStream;
                            inputStream ="";
                        }

                    }
                    if(inputTxt.val().length == 1){
                        timeStartTyping = e.timeStamp;
                    }

                }).focus(function(e){
                    console.log(e.timeStamp);
                });

           }else{
                pageAnalytics.inputStats = null;
            }



        })

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();