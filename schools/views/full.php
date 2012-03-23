<?php
    
    /**
    
     This file contains the app's full display.
    
     The $_GET var 'appvars' is used to pass data from your widget to your application via CitySync.
     Since appvars is a single variable, I'm using characters in place of what you'd normally find
     in variables appended to a URL. In this example, I'm using a pipe to separate multiple variables, 
     and '-' in place of '='.
     
     This page contains the structural HTML for the data display, and the content is handled and 
     displayed via ../libs/js/schools.js and ../libs/js/ui.js.
    
    **/
    
    if(isset($_GET['appvars'])){
        
        $vars = $_GET['appvars'];
        $vars = explode("|", $vars);
        
        $data = Array();
        foreach($vars as $var){  
            $var = explode("-", $var);
            $data[$var[0]] = $var[1];
        }
        
    }

?>


<div id="cs-schools" class="application" <?php if(isset($data['schoolID'])){ echo 'data-id=' . $data['schoolID']; }?>>
        <div id="cs-schools-head">
            <h2>Your Local School</h2>

            <div id="cs-schools-list">Loading...</div>
        </div>

        <div id="cs-schools-main">
            <div id="cs-schools-details">
                <h3>Loading...</h3><a class="button" href="">website</a>

                <p class="contact"><span class="phone">503-555-1234</span> &bull; <span class="address">546 NE 12th Ave, Portland OR, 97322</span></p>
            </div>

            <div id="cs-schools-data">
                <div id="ratings">
                    <p id="ayp"><span class="label">Federal Adequate Yearly Progress Report:</span><img src="images/help_icon.png" title="Adequate Yearly Progress, required under the No Child Left Behind act for schools and districts, measures improvement towards Federal goals ranging from teachers' qualifications to students' test scores. Failure to meet AYP goals can lead to a series of measures including allowing students to transfer to other schools to appointing a new school principal, and other punitive measures." style="float:right; margin: 2px 0 0 6px"/><span class="number">?</span></p>

                    <p id="overall"><span class="label">Oregon Report Card Overall Rating:</span><img src="images/help_icon.png" title="Published annualy, the Oregon Statewide Report Card rates a school's overall progress based on student performance. A school designated as 'In Need of Improvement' must file a comprehensive school improvement plan with the Superintendent of Public Instruction, the school district board, and the school's 21st Century Schools Council." style="float:right; margin: 2px 0 0 6px"/><span class="number">?</span></p>
            </div>
                
                
        <!-- Panels -->
                <nav id="panel-nav">
                    <ul>
                        <li id="overview" class="panel-link active">overview</li>
                        <li id="achievement" class="panel-link">Academic Achievement</li>
                        <li class="year">2010-2011</li>
                    </ul>
                </nav>
                
                <!-- Panel: Overview -->
                <div class="panel active" id="overview-panel">
                    <div class="chunk" id="student-population">
                        <h4>Student Population</h4>

                        <div class="tr-chart">
                            <div id="teacher-ratio">
                                <img src="images/teacher.png">

                                <p><span class="number">1</span> Teachers</p>
                            </div>

                            <div id="tag">
                                <p>for every</p>
                            </div>

                            <div id="student-ratio"></div>
                        </div>

                        <div class="data">
                            <ul>
                                <li id="totalStudents"><span class="label">Total Students</span><span class="number">?</span></li>

                                <li id="avgAttendance"><span class="label">Average Attedance</span><span class="number">?</span></li>
                            </ul>
                        </div>
                    </div><!-- /chunk -->

                    <div class="chunk" id="class-size">
                        <h4>Class Size</h4>

                        <div id="class-size-chart" class="chart"></div>

                        <div class="data">
                            <ul>
                                <li id="sizeLessThan20"><span class="label">Fewer Than 20 Students</span><span class="number">?</span></li>

                                <li id="size20to25"><span class="label">20 to 25 Students</span><span class="number">?</span></li>

                                <li id="size26to30"><span class="label">26 to 30 Students</span><span class="number">?</span></li>

                                <li id="sizeMoreThan30"><span class="label">More than 30 Students</span><span class="number">?</span></li>
                            </ul>
                        </div>
                    </div><!-- /chunk -->

                    <div class="chunk last" id="staffing">
                        <h4>Staffing</h4>

                        <div id="staffing-chart" class="chart"></div>

                        <div class="data">
                            <ul>
                                <li id="fte-teachers"><span class="label">Total Full-Time Teachers</span><span class="number">?</span></li>

                                <li id="assistants"><span class="label">Educational Assistants</span><span class="number">?</span></li>

                                <li id="other"><span class="label">Other Staff</span><span class="number">?</span></li>

                                <li id="admins"><span class="label">Administrators</span><span class="number">?</span></li>
                            </ul>
                        </div>
                    </div><!-- /chunk -->
                </div>
                
                
                <!-- Panel: Achievements -->
                <div class="panel" id="achievement-panel">
                    <div class="chunk" id="academic">
                        <h4>Academic Achievement</h4>

                        <p class="desc">Percentage of students meeting Oregon state standards on Oregon Statewide Assessments</p>

                        <div class="record">
                            <div class="score">
                                <h5 class="state-reading">Reading: <span class="number">?</span></h5>

                                <p class="sr-comparison"></p>
                            </div>

                            <div class="chart" id="reading-chart"></div>

                            <div class="key"></div>
                        </div>

                        <div class="record">
                            <div class="score">
                                <h5 class="state-math">Math: <span class="number">?</span></h5>

                                <p class="sm-comparison"></p>
                            </div>

                            <div class="chart" id="math-chart"></div>

                            <div class="key"></div>
                        </div>

                        <div class="record">
                            <div class="score">
                                <h5 class="state-science">Science: <span class="number">?</span></h5>

                                <p class="sc-comparison"></p>
                            </div>

                            <div class="chart" id="science-chart"></div>

                            <div class="key"></div>
                        </div>

                        <div class="record">
                            <div class="score">
                                <h5 class="state-writing">Writing: <span class="number">?</span></h5>

                                <p class="sw-comparison"></p>
                            </div>

                            <div class="chart" id="writing-chart"></div>

                            <div class="key"></div>
                        </div>
                    </div><!-- /chunk -->

                    <div class="chunk" id="sat">
                        <h4>SAT Scores</h4>

                        <p>Compared to State and National averages</p>

                        <h5 class="sat-math">Math <span class="number">?</span></h5>
                        <div class="chart" id="sat-math-chart"></div>

                        <h5 class="sat-verbal">Verbal <span class="number">?</span></h5>
                        <div class="chart" id="sat-verbal-chart"></div>

                        <h5 class="sat-written">Written <span class="number">?</span></h5>
                        <div class="chart" id="sat-written-chart"></div>
                        
                    </div><!-- /chunk -->
                </div>
            </div>
        </div>

        <div id="cs-schools-side">
            <div id="cs-schools-news">
                Loading news...
            </div>

            <div id="cs-schools-events">
                Loading events...
            </div>
        </div><br style="clear:both;">
    </div>
    
    <!-- App JS -->
    <script src="libs/js/schools.js" type="text/javascript"></script>
    <script src="libs/js/ui.js" type="text/javascript"></script>

    <!-- g.Raphael: Could be replaced by Google Viz API -->
    <script src="libs/js/raphael/raphael-min.js" type="text/javascript"></script>
    <script src="libs/js/raphael/g.raphael-min.js" type="text/javascript"></script>
    <script src="libs/js/raphael/g.pie-min.js" type="text/javascript"></script>
    <script src="libs/js/raphael/g.bar-min.js" type="text/javascript"></script>
    
    <!-- Google Visualization API -->
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">
        google.load("visualization", "1", {packages:["corechart"]});
    </script>