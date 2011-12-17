/*
 *  Tulip Title Tips 1.0
 *  Pretty output of title attribute values on mouse events
 *
 *  Copyright 2011-2012, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 *    jquery-ui.js
 */

(function($) {
	var element;
	var methods = {
		init : function(options) {

			// default options
			var settings = $.extend({
				alignPos   : 'right',
				animEasing : 'linear',
				animSpeed  : 'slow',
				eventType  : 'click'
			}, options);

			// support Id and className
			element = ( $(this).attr('id') )
				? '#' + $(this).attr('id')
				: '.' + $(this).attr('class');

			return this.each(function() {
				var $this = $(this),
					data  = $this.data(element);

				if (!data) {
					$(this).data(element, {
						container : $(element),
						nodes     : $(element).find('[title]'),
						options   : settings
					});

					$(this).TulipTips('generate');
				}
			});
		},

		destroy : function() {
			return this.each(function() {
				$(this).removeData(element);
			});
		},

		generate : function() {
			return this.each(function() {
				var $this = $(this),
					data  = $this.data(element);

				// process elements that contain [title] attribute
				data.nodes.each(function() {
					var elm = $(this);
					var obj = createTooltip( elm.attr('title') );

					elm.removeAttr('title', null);

					elm.hover(function() {
						var elmPosX   = $(this).position().left;
						var elmPosY   = $(this).position().top;
						var elmHeight = $(this).height();
						var elmWidth  = $(this).width();

						$(this).append(obj);

						var objPosX   = elmPosX;
						var objPosY   = elmPosY;
						var objHeight = obj.height();
						var objWidth  = obj.width();

						// calculate target position
						switch(data.options.alignPos) {
							case 'center':
								objPosX = elmPosX + (elmWidth  / 2);
							break;
							case 'left':
								objPosX = elmPosX - objWidth;
							break;
							case 'right':
								objPosX = elmPosX + elmWidth;
							break;
						}

						obj.css({
							display : 'block',
							left    : objPosX,
							top     : elmPosY - (objHeight / 2) - (elmHeight * 2)
						});
					});

					// toggle visibility on mouse events
					elm.bind(data.options.eventType, function(event) {
						if ($.browser.msie) {
							obj.css({
								opacity : 'show'
							});
						}
						else {
							obj.stop().animate({
								opacity : 1
							},
							data.options.animSpeed, data.options.animEasing);
						}
					});

					elm.mouseout(function(event) {
						event.preventDefault();

						if ($.browser.msie) {
							obj.css({
								display : 'none',
								opacity : 'hide'
							});
						}
						else {
							obj.stop().animate({
								opacity : 0
							},
							data.options.animSpeed, data.options.animEasing,
								function() {
									$(this).css({
										display : 'none'
									});
								}
							);
						}
					});
				});
			});
		}
	};

	$.fn.TulipTips = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1) );
		}
		else
		if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.TulipTips');
		}
	};

	/*
	 * Return a new tooltip object
	 */
	function createTooltip(text) {
		var content
			= $('<span></span>')
				.addClass('tulip_tips content')
				.append(text);

		var image
			= $('<div></div>')
				.addClass('tulip_tips image')
				.append(content);

		var shadow
			= $('<div></div>')
				.addClass('tulip_tips shadow')
				.append(image);

		var object
			= $('<div></div>')
				.addClass('tulip_tips object')
				.append(shadow);

		return object;
	}
})(jQuery);