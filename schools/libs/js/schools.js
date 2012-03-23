
    schoolDetails = null;
    classSizeCachedHTML = $('#class-size').html(); // caching this for later when we need to put it back.

    /**
     * init
     * Makes the initial request for list of schools from CivicApps API via PHP proxy
     */
    function init() {
        var req = $.getJSON('libs/php/query.php', function(data) {
            //console.log('Attempting to retrieve JSON data...');
            showList(data);
        }).error(function(jqXHR, textStatus, errorThrown) {
            //console.log("error " + textStatus);
            //console.log("incoming Text " + jqXHR.responseText);
        }).complete(function() {
            //console.log("Request complete!");
        });
        
    }    
    
    
    /******************
     ** GETTING INFO **
     ******************/
    
    /**
     * getSchoolDetails
     * @param {number} id      School ID
     * Retrieves and displays detail information for school, as well as news and events feed
     */
    function getSchoolDetails(id) {    
    
    // TODO: Could be nice to grab the daily schedule from school pages
    // TODO: Is there a way to get individual event feeds for the schools?
        var newsFeed = 'http://www.pps.k12.or.us/news/feed.xml',
            eventsFeed = 'http://www.trumba.com/calendars/ppss_calendar.rss';
        
        //console.log('Retrieving data for schoolID ' + id + '...');
        
        school = getObjects(schoolDetails, 'SchoolID', id);
        school = school[0];
        
        $('#cs-schools-details h3').text(school.SchoolName);
        $('#cs-schools-details a.button').attr('href', 'http://' + school.Url);
        $('#cs-schools-details span.phone').text(school.PhoneNumber);
        $('#cs-schools-details span.address').text(school.StreetAddress1 + ' Portland OR, ' + school.Zip);
        
        getRSSfeed(newsFeed, "news");
        getRSSfeed(eventsFeed, "events");    
        
        // Clear charts?
        $('.chart').html('');
        $('#class-size').html(classSizeCachedHTML);
    }

    /**
     * getRSSfeed
     * @param {string} url      URL to the rss feed to be loaded
     * @param {string} type     'news' or 'events', used to route data to handler
     * Retrieves and passes RSS feed to appropriate handler
     */
    function getRSSfeed(url, type) {
        console.log('Retrieving RSS feed at ' + url + '...');
        $.getJSON('libs/php/xml-reader.php?url=' + url, function(data) {    
            //$('.result').html(data);
            console.log('Feed was parsed and returned!');
            if (type == "news") {
                showNews(data, 6);
            } else {
                showEvents(data, 6);
            }
        }).error(function(jqXHR, textStatus, errorThrown) {
            console.log("error " + textStatus);
            console.log("incoming Text " + jqXHR.responseText);
        }).complete(function() {
            console.log("Request complete!");
        });
    }
    
    /**
     * getSchoolData
     * @param {number} id       School ID of data to be retrieved
     * Retrieves and passes school detail information to showSchoolData()
     */
    function getSchoolData(id) {
        req = $.getJSON('libs/php/query.php?q=data&id=' + id, function(data) {
            console.log('Attempting to retrieve JSON school data for School ID ' + id + '...');
            showSchoolData(data);
        }).error(function(jqXHR, textStatus, errorThrown) {
            console.log("error " + textStatus);
            console.log("incoming Text " + jqXHR.responseText);
        }).complete(function() {
            console.log("Request complete!");
        });
    } 
    
    
    /*********************
     ** DISPLAYING INFO **
     ********************/

    /**
     * showNews
     * @param {object} data         Items from RSS feed
     * @param {number} count        Limit number of items to display
     * Writes news from the RSS feed to the page
     */    
     function showNews(data, count) {
        
        title = data.title;
        news = data.items; 
           
        //console.log(news);
        newsHTML = '<h4>Portland Public Schools Headlines</h4>';
        newsHTML += '<ul id="cs-schools-news-list">';
        $.each(news, function(i) {
            if (i < count) {
                newsHTML += '<li><h5><a href="' + this.url + '">' + this.title + '</a></h5><p class="date">' + this.date + '</p></li>';
                i++;
            }
        });
        newsHTML += '<li class="more"><a href="http://www.pps.k12.or.us/news/index.htm">More news ></a></li>';
        $('#cs-schools-news').html(newsHTML);
    }

    /**
     * showList
     * @param {object} data         List of schools returned from CivicApps API call
     * Generates the drop down menu on the app's full display from the data returned from the CivicApps API
     */  
    function showList(data) {
        schoolDetails = data;
        
        // If an ID is passed, load details for that school.
        if($('#cs-schools').data('id') != undefined){
            console.log('Grabbing schoolID ' + $('#cs-schools').data('id'));
            getSchoolDetails($('#cs-schools').data('id'));
            getSchoolData($('#cs-schools').data('id'));
        }
        
        listHTML = '<select id="school-list">';
        $.each(data, function(i) {
            var selection='';
            if($('#cs-schools').data('id') == this.SchoolID){ selection = ' selected="selected"';}
            listHTML += '<option value="' + this.SchoolID +'"' + selection +'">' + this.SchoolName + '</option>';
        });
        listHTML += '</select>';
        $('#cs-schools-list').html(listHTML);    

        $('#school-list').change(function() {
            getSchoolDetails($("select#school-list option:selected").attr('value'));
            getSchoolData($("select#school-list option:selected").attr('value'));
        });
        
    }
    
    /**
     * showEvents
     * @param {object} data         Items from RSS feed
     * @param {number} count        Limit number of items to display
     * Writes events from the RSS feed to the page
     */  
     function showEvents(data, count) {
        console.log('Building calendar items...');
        var events = data.items;
        var eventsHTML = '<h4>School District Events</h4><ul id="cs-schools-events-list">';
        $.each(events, function(i) {
            if (i < count) {
                eventsHTML += '<li><h5><a href="' + this.url + '">' + this.title + '</a></h5><p class="date">' + this.date + '</p></li>';
                i++;
            }
        });
        eventsHTML += '<li class="more"><a href="http://www.pps.k12.or.us/upcoming-events/index.htm">More events ></a></li>';
        $('#cs-schools-events').html(eventsHTML);
        
        // Resize frame once content has been placed
        CitySync.resizeFrame(document.body.scrollHeight);        
                
        // Open all links in new window
        $('a[href^="http://"]').attr("target", "_blank");
        
    }    
    
    
    /**
     * drawChart
     * @param {object} scores       Score data for the current school
     * Creates and displays the school perfomance bar graphs. Uses Google Visualization API
     */      
     function drawChart(scores) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Year');
        data.addColumn('number', 'School');
        data.addColumn('number', 'District');
        data.addColumn('number', 'State');
        data.addRows([
            ['2010-2011', scores.school, scores.district, scores.state]
        ]);
        var options = {
            chartArea: {
                left: 28,
                right: 0,
                width: '75%'
            },
            width: 400,
            height: 200,
            vAxis: {
                maxValue: 100,
                minValue: 0,
                gridlines: {
                    count: 5,
                    color: '#dedede'
                }
            }
        };
        var chart = new google.visualization.ColumnChart(document.getElementById(scores.target));
        chart.draw(data, options);
    }

    /**
     * drawSATChart
     * @param {object} scores       Score data for the current school
     * Creates and displays the school's SAT results bar graphs. Uses Google Visualization API
     */ 
    function drawSATChart(scores) {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Year');
        data.addColumn('number', 'School');
        data.addColumn('number', 'State');
        data.addColumn('number', 'National');
        data.addRows([
            ['2010-2011', scores.school, scores.state, scores.national]
        ]);
        var options = {
            chartArea: {
                left: 28,
                right: 0,
                width: '75%'
            },
            width: 400,
            height: 200,
            vAxis: {
                maxValue: 100,
                minValue: 0,
                gridlines: {
                    count: 5,
                    color: '#dedede'
                }
            }
        };
        var chart = new google.visualization.ColumnChart(document.getElementById(scores.target));
        chart.draw(data, options);
    }

    /**
     * showSchoolData
     * @param {object} data       School data
     * Displays the school's overall data, including performance, class sizes, etc.
     */ 
    function showSchoolData(data) {    
        var results = data.results;
        $('#cs-schools-data #ratings #ayp span.number').text(results.AypDesignation);
        $('#cs-schools-data #ratings #overall span.number').text(results.OverallRating);
        if (results.AypDesignation == "MET") {
            $('#cs-schools-data #ratings #ayp span.number').addClass('green').removeClass('red');
        } else {
            $('#cs-schools-data #ratings #ayp span.number').addClass('red').removeClass('green');
        }
        if (results.OverallRating == "Outstanding") {
            $('#cs-schools-data #ratings #overall span.number').addClass('green').removeClass('red orange');
        } else if (results.OverallRating == "Satisfactory") {
            $('#cs-schools-data #ratings #overall span.number').addClass('orange').removeClass('green red');
        } else {
            $('#cs-schools-data #ratings #overall span.number').addClass('red').removeClass('green orange');
        }    
    
    
    // Overview Data
        $('#student-population li#totalStudents .number').text(results.SchoolInformation.StudentPopulation.NumberOfStudents);
        $('#student-population li#avgAttendance .number').text(results.SchoolInformation.Attendance.AttendancePctCurrYear);    
    
    
    // Class Sizes
        var classSize = results.SchoolInformation.ClassSize;    
    
    // TODO: There's probabaly a better way to do this...
        var chartData = [];
        chartData[0] = Math.round(classSize.SchoolFewerThan20StudentsPct);
        chartData[1] = Math.round(classSize.School20to25StudentsPct);
        chartData[2] = Math.round(classSize.School26to30StudentsPct);
        chartData[3] = Math.round(classSize.SchoolMoreThan30StudentsPct);
        
        if (classSize.SchoolFewerThan20Students == 0 && classSize.School20to25Students == 0 && classSize.School26to30Students == 0 && classSize.SchoolMoreThan30Students == 0) {    
            // NOTE: Need to find a better way to present no data...
            console.log('No data aprovided');
            var noDataHTML = '<h4>Class Size</h4><p class="no-data"><em>Data not provided.</em></p>';
            $('#class-size').html(noDataHTML);
        } else {
            $('#class-size li#sizeLessThan20 .number').text(classSize.SchoolFewerThan20Students);
            $('#class-size li#size20to25 .number').text(classSize.School20to25Students);
            $('#class-size li#size26to30 .number').text(classSize.School26to30Students);
            $('#class-size li#sizeMoreThan30 .number').text(classSize.SchoolMoreThan30Students);    
    
            // Charts
            g = Raphael('class-size-chart');
            g.piechart(100, 80, 80, [chartData[0], chartData[1], chartData[2], chartData[3]]);
        }
        
        $('#staffing li#fte-teachers .number').text(results.SchoolInformation.Staffing.Teachers);
        $('#staffing li#assistants .number').text(results.SchoolInformation.Staffing.EducationalAssistants);
        $('#staffing li#other .number').text(results.SchoolInformation.Staffing.OtherStaff);
        $('#staffing li#admins .number').text(results.SchoolInformation.Staffing.SchoolAdministrators);    
    
    // Charting
        var teachers = parseInt(results.SchoolInformation.Staffing.Teachers),
            assistants = parseInt(results.SchoolInformation.Staffing.EducationalAssistants),
            other = parseInt(results.SchoolInformation.Staffing.OtherStaff),
            admins = parseInt(results.SchoolInformation.Staffing.SchoolAdministrators),
            total = teachers + assistants + other + admins;
 
        console.log("Placing staffing chart...");
        
        var staffingData = [];            
        staffingData[0] = Math.round((teachers / total) * 100);
        staffingData[1] = Math.round((assistants / total) * 100);
        staffingData[2] = Math.round((other / total) * 100);
        staffingData[3] = Math.round((admins / total) * 100);
        
        sc = Raphael('staffing-chart');
        sc.piechart(100, 80, 80, [staffingData[0], staffingData[1], staffingData[2], staffingData[3]]);    
    
    
    //Academic Achievements
           
    // State testing results
        $('.state-reading .number').text(results.Performance.AchievementData.ReadStudExceedMeetAllGradePctCurrYear + "%");
        $('.state-math .number').text(results.Performance.AchievementData.MathStudExceedMeetAllGradePctCurrYear + "%");
        $('.state-science .number').text(results.Performance.AchievementData.ScienceStudExceedMeetAllGradePctCurrYear + "%");
        $('.state-writing .number').text(results.Performance.AchievementData.WriteStudExceedMeetAllGradePctCurrYear + "%");    
    
    // Setting up score objects
    // Because the dataset refers to scores greater than 95% as '> 95', we have to trim that out before we do math.
    // checkObject() also uses parseInt to convert the data set's strings to numeric values as well.
    
        achievmentData = checkObject(results.Performance.AchievementData);

        var reading = [];
        reading.school = achievmentData.ReadStudExceedMeetAllGradePctCurrYear;
        reading.district = achievmentData.DistReadStudExceedMeetAllGradePctPrevYear;
        reading.state = achievmentData.ReadGradesPerfStatePctPrevYear;

        var math = [];
        math.school = achievmentData.MathStudExceedMeetAllGradePctCurrYear;
        math.district = achievmentData.DistMathStudExceedMeetAllGradePctPrevYear;
        math.state = achievmentData.MathGradesPerfStatePctPrevYear;
        
        var science = [];
        science.school = achievmentData.ScienceStudExceedMeetAllGradePctCurrYear;
        science.district = achievmentData.DistScienceStudExceedMeetAllGradePctPrevYear;
        science.state = achievmentData.ScienceGradesPerfStatePctPrevYear;
        
        var writing = [];
        writing.school = achievmentData.WriteStudExceedMeetAllGradePctCurrYear;
        writing.district = achievmentData.DistWriteStudExceedMeetAllGradePctPrevYear;
        writing.state = achievmentData.WriteGradesPerfStatePctPrevYear;
        
        var readingp = achievmentData.ReadStudExceedMeetAllGradePctPrevYear,
            sciencep = achievmentData.ScienceStudExceedMeetAllGradePctPrevYear,
            mathp = achievmentData.MathStudExceedMeetAllGradePctPrevYear,
            writep = achievmentData.WriteStudExceedMeetAllGradePctPrevYear;
        
        var readingDiff = readingp - reading.school,
            mathDiff = mathp - math.school,
            scienceDiff = sciencep - science.school,
            writeDiff = writep - writing.school;    
   
    // Writing the differences:
        if (readingDiff > 0) {
            $('.sr-comparison').text('Down ' + readingDiff + '% from last year').addClass('less');
        } else {
            $('.sr-comparison').text('Up ' + Math.abs(readingDiff) + '% from last year').addClass('more');
        }
        if (writeDiff > 0) {
            $('.sw-comparison').text('Down ' + writeDiff + '% from last year').addClass('less');
        } else {
            $('.sw-comparison').text('Up ' + Math.abs(writeDiff) + '% from last year').addClass('more');
        }
        if (mathDiff > 0) {
            $('.sm-comparison').text('Down ' + mathDiff + '% from last year').addClass('less');
        } else {
            $('.sm-comparison').text('Up ' + Math.abs(mathDiff) + '% from last year').addClass('more');
        }
        if (scienceDiff > 0) {
            $('.sc-comparison').text('Down ' + scienceDiff + '% from last year').addClass('less');
        } else {
            $('.sc-comparison').text('Up ' + Math.abs(scienceDiff) + '% from last year').addClass('more');
        }    
    
    // Charting
    reading.school = parseInt(reading.school);
    math.school = parseInt(math.school);
    science.school = parseInt(science.school);
    writing.school = parseInt(writing.school);
           
    // Using Google Visualization API
        reading.target = 'reading-chart';
        drawChart(reading);
        math.target = 'math-chart';
        drawChart(math);
        science.target = 'science-chart';
        drawChart(science);
        writing.target = 'writing-chart';
        drawChart(writing);    
    
    // SAT Scores
        satScores = checkObject(results.Performance.SATScores);
        if (results.SchoolType == "HSG") {
            if(satScores.SATMathScoreAvg > 0){
                
                $('.sat-math .number').text(satScores.SATMathScoreAvg);
                $('.sat-verbal .number').text(satScores.SATVerbalScoreAvg);
                $('.sat-written .number').text(satScores.SATWrittenScoreAvg);
                
                // Charting SAT Scores
                var satMath = [],
                    satVerbal = [],
                    satWritten = [];
                
                satMath.target = 'sat-math-chart';
                satMath.school = parseInt(satScores.SATMathScoreAvg);
                satMath.state = parseInt(satScores.StateSATMathScoreAvg);
                satMath.national = parseInt(satScores.NationalSATMathScoreAvg);
                
                satVerbal.target = 'sat-verbal-chart';
                satVerbal.school = parseInt(satScores.SATVerbalScoreAvg);
                satVerbal.state = parseInt(satScores.StateSATVerbalScoreAvg);
                satVerbal.national = parseInt(satScores.NationalSATVerbalScoreAvg);
                
                satWritten.target = 'sat-written-chart';
                satWritten.school = parseInt(satScores.SATWrittenScoreAvg);
                satWritten.state = parseInt(satScores.StateSATWrittenScoreAvg);
                satWritten.national = parseInt(satScores.NationalSATWrittenScoreAvg);
                                 
                drawSATChart(satMath);
                drawSATChart(satVerbal);
                drawSATChart(satWritten);
                                    
            } else {
                // Data not available
                $('#sat').html('<h4>SAT Scores</h4><p class="no-data"><em>Data not provided.</em></p>');
            
            }
        } else {
            $('#sat').hide();
        }    
    
    
    // Teacher to Student Ratio
        students = parseInt(results.SchoolInformation.StudentPopulation.NumberOfStudents);
        ratio = students / (teachers + assistants);
        studentImg = '<div style="text-align:left; margin-bottom: 7px;">';
        for (i = 0; i <= ratio; i++) {
            studentImg += '<img src="images/student.png" class="student" />';
        }
        studentImg += '</div><p><span class="number">' + Math.round(ratio) + '</span> Students</p>'
        $('#student-ratio').html(studentImg);    
    // Show      
        $('#cs-schools-side').fadeIn();
        $('#cs-schools-main').fadeIn();
        
    // Resize view    
        socket.postMessage(document.body.scrollHeight);

        
    }
    
    function chartThis(target, type, data) {    
        console.log("Placing chart in " + target + "...");
        r = Raphael(target);
        var values = [];
        for (x in data) {
            values.concat(x);
        }
        if (type == "pie") {
            r.piechart(130, 130, 80, []);
        } else if (type == "bar") {
            console.log("bar");
        }
    }
    
    
    // Helper bunnies
    function getObjects(obj, key, val) {
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getObjects(obj[i], key, val));
            } else if (i == key && obj[key] == val) {
                objects.push(obj);
            }
        }
        return objects;
    }
    
    function trimScore(string){
        
        if(string != undefined && string[0] == '>'){
            crusty = string.split(" ");
            trimmed = crusty[1];
            console.log(trimmed)
            return trimmed;
        }

    }

    function checkObject(obj){
        for(x in obj){            
            if(obj[x][0] == '>'){
                obj[x] = trimScore(obj[x]);
            }
            obj[x]=parseInt(obj[x]);
        }
        return obj;
    }
    
// Get this party started:
$(function(){
    init();
});
