/*!
 * tCarousel by TLABS
 * Extension of jCarouselLite
 */

(function($) {                                          // Compliant with jquery.noConflict()
    $.tCarousel = {
        version: '1.0'
    };

    $.fn.tCarousel = function(options) { 
		options = $.extend({}, $.fn.tCarousel.options, options || {});
        return this.each(function() {   // Returns the element collection. Chainable.			
            var running, resetInvoked,
                animCss, sizeCss,
                div = $(this), ul, originalLi, initialLi, li, liDefaultCSS,
                liSize, ulSize, divSize, liIndicators,
				init, vertical, circular, speed, scroll, start, auto, controlContainerVisible, indicatorsVisible, breakpoints, fade, window_width,
                numVisible, initialItemLength, itemLength, calculatedTo, currentIndex, autoTimeout, eventAttached;

            initComponents();
			initVariables();                    // Set the above variables after initial calculations
            attachWindowResizeEvent();
			if(init)
			{
				prepare();
				initStyles();                       // Set the appropriate styles for the carousel div, ul and li
				initSizes();                        // Set appropriate sizes for the carousel div, ul and li
				initIndicators();
				attachEventHandlers();              // Attach event handlers for carousel to respond				
			}
			
            function go(to) {
				if(resetInvoked==true) {return false;}
                if(!running) {
                    clearTimeout(autoTimeout);  // Prevents multiple clicks while auto-scrolling - edge case
                    calculatedTo = to;

                    if(options.beforeStart) {   // Call the beforeStart() callback
                        options.beforeStart.call(this, visibleItems());
                    }

                    if(circular) {      // If circular, and "to" is going OOB, adjust it
                        adjustOobForCircular(to);
                    } else {                    // If non-circular and "to" is going OOB, adjust it.
                        adjustOobForNonCircular(to);
                    }                           // If neither overrides "calculatedTo", we are not in edge cases.

					currentIndex = calculatedTo;
					if (circular)
					{
						currentIndex = (calculatedTo - numVisible)%initialItemLength;
					}
					
                    animateToPosition({         // Animate carousel item to position based on calculated values.
                        start: function() {
							//console.log("id: " + options.id + " | Animation Started");		
							if(resetInvoked==true)
							{
								console.log("Starting but Reset Invoked from " + options.id );
								ul.stop(true, true);								
								running = false;								
								reset();
							}
							else
							{
								running = true;
								if(fade)
								{
									fadeItems();
								}
							}
                        },
                        done: function() {							
							//console.log("id: " + options.id + " | Animation completed");
                            if(options.afterEnd) {
                                options.afterEnd.call(this, visibleItems());
                            }
                            if(!resetInvoked && auto) {
                                setupAutoScroll();
                            }
                            running = false;
							//alert("Reset Invoked");
							if(resetInvoked==true)
							{
								//console.log("Done! Reset Invoked from "+ options.id);
								reset();
							}
                        }
                    });
										
					if(liIndicators) {
						
						//console.log("To: " + to + ", CalculatedTo: " + calculatedTo + ", Current index: " + index);
						liIndicators.each(function(i) {                        
							if($(this).attr("page")==currentIndex)
							{
								$(this).addClass('selected');
							}
							else
							{
								$(this).removeClass('selected');
							}
						});
					}

                    if(!circular) {     // Enabling / Disabling buttons is applicable in non-circular mode only.
                        disableOrEnableButtons();
                    }
                }
                return false;
            }

            function initComponents()
			{
				init = false;
				eventAttached = false;
				running = false;
				resetInvoked = false;
				
				ul = div.find(">ul");
                initialLi = ul.find(">li");
                initialItemLength = initialLi.size();
				originalLi = initialLi;		
				liIndicators = null;
			}
			
			function initVariables() {		
				init = options.init;
				vertical = options.vertical;
				circular = options.circular;
				visible = options.visible;
				start = options.start;
				scroll = options.scroll;
				speed = options.speed;
				auto = options.auto;
				fade = options.fade;
				controlContainerVisible = options.controlContainerVisible;
				indicatorsVisible = options.indicatorsVisible;
				liDefaultCSS = options.liDefaultCSS;
				breakpoints = options.breakpoints;
							
				if(breakpoints)
				{					
					if(breakpoints.length > 0)
					{
						window_width = $(window).width();						
						for(i=0; i<breakpoints.length; i++)
						{
							var b = breakpoints[i];
							if(b)
							{
								//alert(b.min + " "+b.max);
								if(window_width >= b.min && window_width <= b.max)
								{
									if(typeof(b.init) != "undefined") {init = b.init;}
									if(typeof(b.circular) != "undefined") {circular = b.circular;}
									if(typeof(b.visible) != "undefined") {visible = b.visible;}
									if(typeof(b.scroll) != "undefined") {scroll = b.scroll;}
									if(typeof(b.speed) != "undefined") {speed = b.speed;}
									if(typeof(b.auto) != "undefined") {auto = b.auto;}
									if(typeof(b.fade) != "undefined") {fade = b.fade;}
									if(typeof(b.controlContainerVisible) != "undefined") {controlContainerVisible = b.controlContainerVisible;}
									if(typeof(b.indicatorsVisible) != "undefined") {indicatorsVisible = b.indicatorsVisible;}
									if(typeof(b.liDefaultCSS) != "undefined") {liDefaultCSS = b.liDefaultCSS;}
									break;
								}								
							}
						}						
					}
				}	
				
				if(options.controlContainer)
				{
					if(controlContainerVisible)
					{
						$(options.controlContainer).show();
					}
					else
					{
						$(options.controlContainer).hide();
					}
				}
				
				if(options.indicatorUL)
				{
					if(indicatorsVisible)
					{
						$(options.indicatorUL).show();
					}
					else
					{
						$(options.indicatorUL).hide();
					}
				}
            }
			
			function prepare()
			{
				animCss = vertical ? "top" : "left";
                sizeCss = vertical ? "height" : "width";                

                // To avoid a scenario where number of items is just 1 and visible is 3 for example.
                numVisible = initialItemLength < visible ? initialItemLength : visible;

                if(circular) {
                    var $lastItemSet = initialLi.slice(initialItemLength-numVisible).clone();
                    var $firstItemSet = initialLi.slice(0,numVisible).clone();

                    ul.prepend($lastItemSet)        // Prepend the lis with final items so that the user can click the back button to start with
                        .append($firstItemSet);     // Append the lis with first items so that the user can click the next button even after reaching the end

                    start += numVisible;    // Since we have a few artificial lis in the front, we will have to move the pointer to point to the real first item
                }
				
				li = $("li", ul);
                itemLength = li.size();
                calculatedTo = start;
			}

            function initStyles() {
                div.css("visibility", "visible");   // If the div was set to hidden in CSS, make it visible now

                li.css({
                    overflow: "hidden",
                    "float": vertical ? "none" : "left" // Some minification tools fail if "" is not used
                });

                ul.css({
                    margin: "0",
                    padding: "0",
                    position: "relative",
                    "list-style": "none",
                    "z-index": "1"
                });

                div.css({
                    overflow: "hidden",
                    position: "relative",
                    "z-index": "2",
                    left: "0px"
                });

                // For a non-circular carousel, if the start is 0 and btnPrev is supplied, disable the prev button
                if(!circular && options.btnPrev && start == 0) {
                    $(options.btnPrev).addClass("disabled");
                }
            }

            function initSizes() {
				var width=0, owidth=0, height=0, oheight=0;
				$.each(li, function(i)
				{
					var w, ow, h, oh;
					w = $(this).width();
					h = $(this).height();
					ow = $(this).outerWidth(true);
					oh = $(this).outerHeight(true);
					if(w > width) {width = w;}
					if(h > height) {height = h;}
					if(ow > owidth) {owidth = ow;}
					if(oh > oheight) {oheight = oh;}
				});
				//console.log("li-length: "+ li.length + ", h: "+ oheight);                
				
				liSize = vertical ? height : width;
                ulSize = liSize * itemLength;       // size of full ul(total length, not just for the visible items)
                divSize = liSize * numVisible;      // size of entire div(total length for just the visible items)

                // Generally, LI's dimensions should be specified explicitly in a style-sheet
                // But in the case of img (with width and height attr), we can derive LI's dimensions and set here
                // May be applicable for other types of LI children if their dimensions are explicitly specified
                // Individual LI dimensions
                li.css({
                    width: width,
                    height: height
                });

                // Size of the entire UL. Including hidden and visible elements
                // Will include LI's (width + padding + border + margin) * itemLength - Using outerwidth(true)
                ul.css(sizeCss, ulSize+"px")
                    .css(animCss, -(calculatedTo * liSize));

                // Width of the DIV. Only the width of the visible elements
                // Will include LI's (width + padding + border + margin) * numVisible - Using outerwidth(true)
                div.css(sizeCss, divSize+"px");
            }
			
			function initIndicators()
			{
				liIndicators = null;
				if(options.indicatorUL) 
				{
					$(options.indicatorUL).empty();
					var indicator_count = Math.ceil((originalLi.length-numVisible)/scroll)+1;
					for(i=0; i<indicator_count;i++)
					{
						$(options.indicatorUL).append('<li class="tc-indicator" page=""><div></div></li>');
					}
					
					liIndicators = $(options.indicatorUL).find("li");
					liIndicators.eq(0).addClass("selected");
					
					liIndicators.each(function(i) {
						var i_s = 0;
						if(i==indicator_count-1)
						{
							i_s = originalLi.length - numVisible;
						}
						else
						{
							i_s = i*scroll;
						}
						var p = circular ? numVisible + i_s : i_s;
                        $(this).click(function() {
                            return go(p);
                        });
						$(this).attr("page", i_s);
                    });
				}
			}

            function attachEventHandlers() {
                if(options.btnPrev) {
                    $(options.btnPrev).click(function() {
                        return go(calculatedTo - scroll);
                    });
                }

                if(options.btnNext) {
                    $(options.btnNext).click(function() {
                        return go(calculatedTo + scroll);
                    });
                }   
				
				if(!vertical)
				{
					div.on('swipeleft', function(){
						return go(calculatedTo - scroll);
					});
					div.on('swiperight', function(){
						return go(calculatedTo + scroll);
					});
				}
				

                if(options.mouseWheel && div.mousewheel) {
                    div.mousewheel(function(e, d) {
                        return d > 0 ?
                            go(calculatedTo - scroll) :
                            go(calculatedTo + scroll);
                    });
                }

                if(auto) {
                    setupAutoScroll();
                }
				
				if(options.haltOnMouseOver)
				{
					div.mouseenter(function(){
						if(auto && autoTimeout)
						{
							//console.log("Id :"+ options.id + " | auto: " + autoTimeout);
							clearTimeout(autoTimeout);
							autoTimeout = 0;
							//console.log("Id :"+ options.id + " | MouseOver");
						}
					});	
					div.mouseleave(function(){
						if(auto) 
						{
                            setupAutoScroll();
							//console.log("Id :"+ options.id + " | MouseLeave");
                        }
					});						
				}
				eventAttached = true;
            }
			
			function attachWindowResizeEvent() {
				$(window).resize(function(){
					resetInvoked = true;
					//console.log("id: " + options.id + " | Reset invoked: " + resetInvoked);
					ul.stop(true, true);
					ul.stop(true, true);
					ul.stop(true, true);
					clearTimeout(autoTimeout);
					autoTimeout = 0;	
					reset();
				});
			}

            function setupAutoScroll() {
				if(resetInvoked==true) return;
                autoTimeout = setTimeout(function() {					
					go(calculatedTo + scroll);					
                }, auto);
            }

            function visibleItems() {
                return li.slice(calculatedTo).slice(0,numVisible);
            }

            function adjustOobForCircular(to) {
                var newPosition;

                // If first, then goto last
                if(to <= start - numVisible - 1) {
                    newPosition = to + initialItemLength + scroll;
                    ul.css(animCss, -(newPosition * liSize) + "px");
                    calculatedTo = newPosition - scroll;

                    //console.log("Before - Positioned at: " + newPosition + " and Moving to: " + calculatedTo);
                }

                // If last, then goto first
                else if(to >= itemLength - numVisible + 1) {
                    newPosition = to - initialItemLength - scroll;
                    ul.css(animCss, -(newPosition * liSize) + "px");
                    calculatedTo = newPosition + scroll;

                    //console.log("After - Positioned at: " + newPosition + " and Moving to: " + calculatedTo);
                }
            }

            function adjustOobForNonCircular(to) {
                // If user clicks "prev" and tries to go before the first element, reset it to first element.
                if(to < 0) {
                    calculatedTo = 0;
                }
                // If "to" is greater than the max index that we can use to show another set of elements
                // it means that we will have to reset "to" to a smallest possible index that can show it
                else if(to > itemLength - numVisible) {
                    calculatedTo = itemLength - numVisible;
                }

                /*console.log("Item Length: " + itemLength + "; " +
                    "To: " + to + "; " +
                    "CalculatedTo: " + calculatedTo + "; " +
                    "Num Visible: " + numVisible);*/
            }

            function disableOrEnableButtons() {
                $(options.btnPrev + "," + options.btnNext).removeClass("disabled");
                $( (calculatedTo-options.scroll<0 && options.btnPrev)
                    ||
                    (calculatedTo+options.scroll > itemLength-numVisible && options.btnNext)
                    ||
                    []
                ).addClass("disabled");
            }

            function animateToPosition(animationOptions) {                
				if(resetInvoked==true) 
				{
					return;
				}
				running = true;		
				//console.log("id: " + options.id + " | Animation Assigned");				
                ul.animate(
                    animCss == "left" ?
                    { left: -(calculatedTo*liSize) } :
                    { top: -(calculatedTo*liSize) },

                    $.extend({
                        duration: speed,
                        easing: options.easing
                    }, animationOptions)
                );
            }
			
			function fadeItems()
			{				
				var f = li.slice(calculatedTo - numVisible < 0? 0 : calculatedTo - numVisible, calculatedTo);
				var c = li.slice(calculatedTo, calculatedTo + numVisible);
				var l = li.slice(calculatedTo + numVisible, calculatedTo + 2 * numVisible);
				
				li.css({'opacity': 1});
				
				if(f.size() > 0)
				{
					f.animate({'opacity': 0}, speed);
				}
				if(c.size() > 0) // will always be true perhaps
				{
					c.animate({'opacity': 1}, speed);
				}
				if(l.size() > 0)
				{
					l.animate({'opacity': 0}, speed);
				}
				
				//console.log("Id: " + options.id + " | CurrentIndex: " + currentIndex + " | NumVisible: " + numVisible + " | Sizes: " + f.size() + ", " + c.size() + ", " + l.size());
			}
			
			function reset()
			{					
				if(running==true)
				{
					ul.stop(true);
					running = false;
					setTimeout(reset, 200);					
				}
				else
				{		
					div.css({'width': 'auto', 'height':'auto'})
					ul.css({'width': 'auto', 'height':'auto', 'left':'0px', 'top': '0px'});
					ul.empty().append(originalLi);				
					ul.find('li').css(liDefaultCSS);
					ul.find('li > img').css({'width': '100%',});				
					initVariables();
					//console.log("id: " + options.id + " | Init: " + init);
					if(init===true)
					{
						prepare();
						initStyles();    
						initSizes();    
						initIndicators();
						attachEventHandlers();  
						resetInvoked = false;
						if(auto) 
						{
							setupAutoScroll();
						}												
						//console.log("id: " + options.id + " | Reset invoked: " + resetInvoked);						
					}
				}
			}			
        });
    };

    $.fn.tCarousel.options = {
		id: 1,
		init: true,
        controlContainer: null,
		controlContainerVisible: false,
		btnPrev: null,              // CSS Selector for the previous button
        btnNext: null,              // CSS Selector for the next button
        indicatorUL: null,           // ul containing list of indicators
		indicatorsVisible: false,
        liDefaultCSS: {'width': 'auto', 'height':'auto'},
		mouseWheel: false,          // Set "true" if you want the carousel scrolled using mouse wheel
        auto: null,                 // Set to a numeric value (800) in millis. Time period between auto scrolls
		speed: 200,                 // Set to a numeric value in millis. Speed of scroll
        easing: null,               // Set to easing (bounceout) to specify the animation easing
		fade: false,
        vertical: false,            // Set to "true" to make the carousel scroll vertically
        circular: true,             // Set to "true" to make it an infinite carousel
        visible: 3,                 // Set to a numeric value to specify the number of visible elements at a time
        start: 0,                   // Set to a numeric value to specify which item to start from
        scroll: 1,                  // Set to a numeric value to specify how many items to scroll for one scroll event		
		haltOnMouseOver: false,
		breakpoints: null,
        beforeStart: null,          // Set to a function to receive a callback before every scroll start
        afterEnd: null              // Set to a function to receive a callback after every scroll end
    };

})(jQuery);