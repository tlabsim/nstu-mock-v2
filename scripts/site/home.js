$(document).ready(function() { 
	
	$('.feature-tile-content').tCarousel({
		id: 1,
		fade: true,
		auto: 5000,
		speed: 1500,
		visible:1,
		vertical:true,
		haltOnMouseOver: true
	});
	$('.image-carousel').tCarousel({
		id: 2,
		auto: 5000,
		speed: 1500,
		visible:1,
		vertical:true
	});	
	
	$('#bar1-carousel').tCarousel({
		id: 3,
		btnPrev: '#bar1-carousel-controls .prev',
		btnNext: '#bar1-carousel-controls .next',
		auto: 5000,
		speed: 1500,
		visible:1,
		vertical:false,
		fade: true,
		circular: true
	});
	
	var topic_carousel_options = {
		init: false,		
		controlContainerVisible: false,
		auto: false,
		speed: 1000,
		visible:3,
		vertical:true,		      
		indicatorsVisible: false,
		circular: false,
		haltOnMouseOver: true,
		breakpoints: [
			{				
				min: 0,
				max: 767,
				init: true,
				auto: 5000,
				visible: 1,
				circular: true,
				controlContainerVisible: true,
				indicatorsVisible: true
			}
		]
	};
	
	$('#news-items').tCarousel($.extend(topic_carousel_options, {
		id: 4,
		btnPrev: '#news-carousel-container .prev',
		btnNext: '#news-carousel-container .next',
		controlContainer: '#news-carousel-container',
		indicatorUL: '#news-tc-indicators'
	}));	
	
	
	$('#notices-items').tCarousel($.extend(topic_carousel_options, {
		id: 5,
		btnPrev: '#notices-carousel-container .prev',
		btnNext: '#notices-carousel-container .next',
		controlContainer: '#notices-carousel-container',
		indicatorUL: '#notices-tc-indicators'
	}));	
	$('#happening-items').tCarousel($.extend(topic_carousel_options, {
		id: 6,
		btnPrev: '#happening-carousel-container .prev',
		btnNext: '#happening-carousel-container .next',
		controlContainer: '#happening-carousel-container',
		indicatorUL: '#happening-tc-indicators'
	}));	
	$('#events-items').tCarousel($.extend(topic_carousel_options, {
		id: 7,
		btnPrev: '#events-carousel-container .prev',
		btnNext: '#events-carousel-container .next',
		controlContainer: '#events-carousel-container',
		indicatorUL: '#events-tc-indicators'
	}));	
	
	/*Number crunch*/
	
	$('#number-crunch').tCarousel({
		id: 8,
		btnPrev: '#number-crunch-carousel-control .prev',
		btnNext: '#number-crunch-carousel-control .next',
		controlContainer: '#number-crunch-carousel-control',
		init: true,		
		fade: true,
		controlContainerVisible: true,
		auto: false,
		speed: 500,
		visible:4,
		scroll: 3,
		vertical:false,		      		
		indicatorUL: '#number-crunch-carousel-indicators',
		indicatorsVisible: true,
		circular: false,
		haltOnMouseOver: false,
		breakpoints: [
			{				
				min: 0,
				max: 599,
				auto: false,
				visible: 1,
				scroll: 1
			},
			{				
				min: 600,
				max: 899,
				auto: false,
				visible: 2,
				scroll: 2
			},
			{				
				min: 900,
				max: 1199,
				auto: false,
				visible: 3,
				scroll: 3
			}
		]
	});
	
	$('#nstu-pulse').tCarousel({
		id: 9,
		btnPrev: '#nstu-pulse-carousel-control .prev',
		btnNext: '#nstu-pulse-carousel-control .next',
		controlContainer: '#nstu-pulse-carousel-control',
		init: true,		
		controlContainerVisible: true,
		auto: false,
		speed: 500,
		visible:4,
		scroll: 3,
		vertical:false,		      		
		indicatorUL: '#nstu-pulse-carousel-indicators',
		indicatorsVisible: true,
		circular: false,
		haltOnMouseOver: false,
		liDefaultCSS: {'width': '25%', 'height':'auto'},
		breakpoints: [
			{				
				min: 0,
				max: 599,
				auto: false,
				visible: 1,
				scroll: 1,
				liDefaultCSS: {'width': '100%', 'height':'auto'}
			},
			{				
				min: 600,
				max: 899,
				auto: false,
				visible: 2,
				scroll: 2,
				liDefaultCSS: {'width': '50%', 'height':'auto'}
			},
			{				
				min: 900,
				max: 1199,
				auto: false,
				visible: 3,
				scroll: 3,
				liDefaultCSS: {'width': '33.33%', 'height':'auto'}
			}
		]
	});
	
	
	var copy_featured_d2m = function()
	{
		var contents = $('#featured-tile-container').html();
		if (contents != null)
		{			
			contents = contents.trim();			
			if(contents.length>0)
			{		
				var mobile_featured_container = $('#mobile-featured-tile-container');					
				if(mobile_featured_container.length > 0)
				{
					$('#featured-tile-container').html('');
					mobile_featured_container.html(contents);
				}
			}
		}
	};
	
	var copy_featured_m2d = function()
	{
		var contents = $('#mobile-featured-tile-container').html();	
		if (contents != null)
		{
			contents = contents.trim();			
			if(contents.length>0)
			{			
				var featured_container = $('#featured-tile-container');					
				if(featured_container.length > 0)
				{
					$('#mobile-featured-tile-container').html('');
					featured_container.html(contents);
				}
			}
		}
	};
	
	$(window).resize(function(){
		var width = $(this).width();
		if(width < 700)
		{
			copy_featured_d2m();
		}
		else
		{
			copy_featured_m2d();
		}
		
		if(width <1200)
		{
			top_float_bar.removeClass('float-top');	
			$('#topbar-float').hide();
			$('#topbar').show();
			$('#topbar-absolute').width(100).removeClass('shadowed');
		}	
	});
	
	var window_width = $(window).width();	
	if(window_width < 700)
	{		
		copy_featured_d2m();
	}	
	
    var top_float_bar = $('#top-float-bar');

	var pre_scroll_top = 0;
    $(window).scroll(function () {
		var window_width = $(this).width();	
		if(window_width >= 1200)
		{
			var st = $(this).scrollTop();
			if (st >= 500 && pre_scroll_top < 500) {				
				top_float_bar.addClass('float-top').animate({'top':'0px'}, 300);	
				$('#topbar-float').show();
				$('#topbar').hide();				
			} 
			else if (st < 500 && pre_scroll_top >= 500)
			{
				top_float_bar.animate({'top':'-100px'}, 300, function(){$(this).removeClass('float-top')});	
				$('#topbar-float').hide();
				$('#topbar').show();
			}
			pre_scroll_top = st;
		}
    });	
	
	var animate_topbar_float_logo_mouseenter = function(){		
		$('#topbar-float').show();
		$('#topbar-float-logo').show().animate({'left':'100px'}, 400);
		$('#topbar-float-title').show().animate({'left':'200px'}, 600, function(){
			$('#topbar-absolute').width('400px').addClass('shadowed');		
		});				
	};
	
	var animate_topbar_float_logo_mouseleave = function(){		
		$('#topbar-absolute').removeClass('shadowed');		
		$('#topbar-float-title').animate({'left':'0px'}, 300, function(){
			$(this).hide();
			$('#topbar-float-logo').animate({'left':'0px'}, 300, function(){
				$(this).hide();
				$('#topbar-absolute').width('100px');
			});
		});
	};
	
	$('#NSTU-tile').mouseenter(function(){		
		var _window = $(window);
		if(_window.width()>=1200)
		{
			if(_window.scrollTop()>500)
			{
				animate_topbar_float_logo_mouseenter();
			}
		}
	});
	
	$('#NSTU-tile').mouseleave(function(){		
		var _window = $(window);
		if(_window.width()>=1200)
		{
			if(_window.scrollTop()>500)
			{
				animate_topbar_float_logo_mouseleave();
			}
		}
	});

}); 