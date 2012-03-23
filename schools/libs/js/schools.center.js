
/**
 * schools.center.js
 * Handles the UI for the center view of the Schools app for CitySync
 */
 
 var App = function(){
    
    // Public vars
    var baseURL = 'http://pdxcitysync.org/api/schools/';
    //var baseURL = 'http://localhost:8888/api.civicapps.org/schools/';

    return{
    
        /**
         * getSchools
         * @params {object} args    Includes school type and search radius from user selection 
         */
        getSchools:function(args){
            
            //Call the Schools API
            query = 'near?lat='+CitySync.user.location.lat+'&long='+CitySync.user.location.long+'&type='+args.type+'&range='+args.range;               
            $.getJSON(baseURL+query, function(data){
            //console.log(data);
                if(!data){
                
                    $('.error p').text('There was an error processing your search. Try your search again, or try adjusting your selections.');
                
                }else if(!data.results){
                    // No results found

                    schoolsHTML = '<div id="schools-list"><ul><li class="header-row"><p class="header-label school-name">School name</p><p class="header-label ayp-rating">AYP Rating</p><p class="header-label state-rating">State Rating</p></li><li class="no-results"><p class="school-name">There were no schools found in your search. Try increasing your radius, or changing the school type.</p><li class="footer-row"><p class="header-label school-name back">&lsaquo; BACK</p></li></ul></div>';
            
                    $('.widget-center').html(schoolsHTML);
                    
                    $('p.back').on('click',function(){
                            app.clearUI();
                        });
                } else {
                    // Prep and place container
                    schoolsHTML = '<div id="schools-list"><ul><li class="header-row"><p class="header-label school-name">School name</p><p class="header-label ayp-rating">AYP Rating</p><p class="header-label state-rating">State Rating</p></li><li class="footer-row"><p class="header-label school-name back">&lsaquo; BACK</p></li></ul></div>';
            
                    $('.widget-center').html(schoolsHTML);
                    
                    
                    // Gather IDs and send to detail grabber
                    var schoolsArr = [];
                    for(school in data.results){
                        schoolsArr.push(data.results[school].SchoolID);
                    }
                    
                    app.getDetails(schoolsArr);                    
                }
            })
        },
    
    
        /**
         * clearUI
         * Used for the "back" button - resets the UI and presents the initial form
         */
        clearUI: function(){
            $('.widget-center').html(formHTML);
            //console.log(formHTML);
            
            /** 
            /* NOTE: Probably a better way to do this, but I forget at the moment... 
            /* HTML is being taken out and put back in, so listener loses track
            /* of the lisnten-ee
             */
            
            $('#submit-button p').on("click",function(){            
                var data = [];
                data.type = $('#type').val();
                data.range = $('#range').val();
                data.lat = $('#coords').data('lat');
                data.long = $('#coords').data('long');
                
                app.getSchools(data);        
            });
            
            CitySync.resizeFrame(document.body.scrollHeight);

        },
        
        /**
         * getDetails
         * @params {object} schools    Contains school data from API call
         * Displays list of school results returned by API
         */
        getDetails: function(schools){
                        
            for(var x = 0; x < schools.length; x++){
                $.getJSON(baseURL+'/school/'+schools[x], function(data){
                    if(!data){
                        $('.error p').text('There were no data found for this school ID. Please change your search and try again.');
                    } else {
                        
                        // This is used to color-class the ratings
                        var aypClass;
                        var stateClass;
                        
                        switch(data.results.AypDesignation){
                            case 'MET':
                                aypClass = 'green';
                                break;
                            case 'NOT MET':
                                aypClass = 'red';
                                break;
                        }
                        
                        switch(data.results.OverallRating){
                            case 'Outstanding':
                                stateClass = 'green';
                                break;
                            case 'Satisfactory':
                                stateClass = 'orange';
                                break;
                            default:
                                stateClass = 'red';
                                break;
                        }
                        
                        
                        schoolHTML = '<li id="'+data.results.SchoolID+'"><p class="school-name"><a data-url="http://dev.pdxcitysync.org/'+CitySync.appdata.fullurl+'?appvars=schoolID-'+data.results.SchoolID+'">'+data.results.SchoolName+'</a></p><p class="ayp-rating '+aypClass+'">'+data.results.AypDesignation+'</p><p class="state-rating '+stateClass+'">'+data.results.OverallRating+'</p></li>';
                        
                        $('#schools-list .footer-row').before(schoolHTML);
                        CitySync.resizeFrame($('.widget-center').height());
                        
                        /** 
                        * Handling "clear" button
                        */
                        $('p.back').on('click',function(){
                            app.clearUI();
                        });
                        
                        /**
                         * Click handler for links to full app, pssing SchoolID as GET var
                         */
                        $('li a').on('click',function(){
                            parent.window.location.href = $(this).data('url');
                        });
                    }
                });                
            }
        }
     };
 };

 var formHTML = '';

 var app = App();
 
 /** 
  * Handling the UI with jQuery
  */
  
  $(function(){
  
    // Authentication isn't yet enabled. Passing dummy values. 
    
    // Initialize the app
    var init = CitySync.init({
        appID:'1234',
        appURL:'pass'               
    });
    
    if(init == "success"){
      
        formHTML = $('.widget-center').html();
        
         /** 
          * Handling "search" button
          */
        $('#submit-button p').on("click",function(){   
            var data = {}; 
            data.type = $('#type').val();
            data.range = $('#range').val();
            app.getSchools(data);
        });
    }
    
  
  });
 