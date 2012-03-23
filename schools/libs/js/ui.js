$(function(){

    // Show active panels
    $('.panel.active').show();

    console.log('Active section: '+ $('#panel-nav li.active').attr('id'));

    // Listen to Panel Nav
    $('#panel-nav li').click(function(){
        
        // What'd they click?
        choice = $(this).attr('id');
            
        // Hide active panel    
        $('.panel.active').hide().removeClass('active');
        $('.panel#'+choice+'-panel').show().addClass('active');
        
        // Swap nav states
        $('#panel-nav li.active').removeClass('active');
        $('#panel-nav li#'+choice).addClass('active');
        
        CitySync.resizeFrame(document.body.scrollHeight);

        
    });
    
    // Tooltips
    $("img[title]").tooltip();
    

});