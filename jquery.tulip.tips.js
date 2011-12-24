/*
 *  Tulip Title Tips
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
				eventType  : 'click',
				pngAlpha   : true
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

				var active = null;

				// process elements that contain [title] attribute
				data.nodes.each(function() {
					var elm = $(this);
					var obj = createTooltip( elm.attr('title') );

					elm.removeAttr('title', null);

					// toggle visibility on mouse events
					elm.bind(data.options.eventType, function() {
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

						if ($.browser.msie && data.options.pngAlpha) {
							obj.css({
								opacity : 'show'
							});
						}
						else {
							if (active) { return }

							obj.stop().animate({
								opacity : 1,
								queue   : false
							},
							data.options.animSpeed, data.options.animEasing);

							active = true;
						}
					});

					elm.mouseout(function() {
						if ($.browser.msie && data.options.pngAlpha) {
							obj.css({
								display : 'none',
								opacity : 'hide'
							});
						}
						else {
							if (!active) { return }

							obj.stop().animate({
								opacity : 0,
								queue   : false
							},
							data.options.animSpeed, data.options.animEasing,
								function() {
									$(this).css({
										display : 'none'
									});
								}
							);

							active = null;
						}
					});

					// prevent bubbling
					obj.bind(data.options.eventType, function(event) {
						event.stopPropagation();
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
