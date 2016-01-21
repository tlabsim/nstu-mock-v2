$(document).ready(function() { 
	//google map in footer
	function initialize() {
		var mapCanvas = document.getElementById('footer-map-canvas');
		var mapOptions = {
		  center: new google.maps.LatLng(22.794437, 91.100707),
		  zoom: 14,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var map = new google.maps.Map(mapCanvas, mapOptions);
	}
							  
	google.maps.event.addDomListener(window, 'load', initialize);
	
	var cwt_frame_count = 33;
	var cwt_current_frame = 1;
	var frame_duration = 20;
	var cwt_frame_width = 120;
	var cwt_container = $('#footer-cwt-logo');	
	
	var animate_cwt = function()
	{			
		animate_cwt2();
	};
	
	var animate_cwt2 = function()
	{		
		var ho = (cwt_current_frame-1)*cwt_frame_width;		
		cwt_container.css('background-position', '-'+ho + 'px 0px');
		cwt_current_frame++;	
		if(cwt_current_frame<cwt_frame_count)
		{					
			setTimeout(animate_cwt2, frame_duration);
		}	
	};
	
	var rev_animate_cwt = function()
	{	
		rev_animate_cwt2();
	};
	
	var rev_animate_cwt2 = function()
	{
		var ho = (cwt_current_frame-1)*cwt_frame_width;		
		cwt_container.css('background-position', '-'+ho + 'px 0px');
		cwt_current_frame--;
		if(cwt_current_frame>=1)
		{					
			setTimeout(rev_animate_cwt2, frame_duration);
		}	
	};
	
	//setup_cwt_animation();	
	cwt_container.mouseenter(animate_cwt);
	cwt_container.mouseleave(rev_animate_cwt);
}); 