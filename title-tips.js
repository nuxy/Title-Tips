/*
 *  Title Tips
 *  Pretty output of HTML title attribute values on mouse events
 *
 *  Copyright 2011-2015, Marc S. Brooks (http://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Dependencies:
 *    jquery.js
 */

if (!window.jQuery || (window.jQuery && parseInt(window.jQuery.fn.jquery.replace('.', '')) < parseInt('1.8.3'.replace('.', '')))) {
	throw new Error('Tidy-Table requires jQuery 1.8.3 or greater.');
}

(function($) {
	var methods = {
		"init": function(options) {

			// default options
			var settings = $.extend({
				alignPos:   'right',
				animEasing: 'linear',
				animSpeed:  'slow',
				eventType:  'click'
			}, options);

			return this.each(function() {
				var $this = $(this);
					data  = $this.data();

				if ( $.isEmptyObject(data) ) {
					$this.data({
						nodes:   $this.find('[title]'),
						options: settings
					});

					$this.TitleTips('generate');
				}
			});
		},

		"destroy": function() {
			return this.each(function() {
				$(this).removeData();
			});
		},

		"generate": function() {
			var $this = $(this),
				data  = $this.data();

			var active = null;

			// process elements that contain [title] attribute
			data.nodes.each(function() {
				var elm = $(this),
					obj = createTooltip( elm.attr('title') );

				elm.removeAttr('title', null);

				// toggle visibility on mouse events
				elm.bind(data.options.eventType, function() {
					var elmPosX   = $(this).position().left,
						elmPosY   = $(this).position().top,
						elmHeight = $(this).height(),
						elmWidth  = $(this).width();

					$(this).append(obj);

					var objPosX   = elmPosX,
						objPosY   = elmPosY,
						objHeight = obj.height(),
						objWidth  = obj.width();

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
						display: 'block',
						left:    objPosX,
						top:     elmPosY - (objHeight / 2) - (elmHeight * 2)
					});

					if (!$.support.opacity) {
						obj.css('opacity','show');
					}
					else {
						if (active) { return }

						obj.stop().animate({
							opacity: 1,
							queue:   false
						},
						data.options.animSpeed, data.options.animEasing);

						active = true;
					}
				});

				elm.mouseout(function() {
					if (!$.support.opacity) {
						obj.css({
							display: 'none',
							opacity: 'hide'
						});
					}
					else {
						if (!active) { return }

						obj.animate({
							opacity: 0,
							queue:   false
						},
						data.options.animSpeed, data.options.animEasing,
							function() {
								$(this).css('display','none');
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
		}
	};

	$.fn.TitleTips = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else
		if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		}
		else {
			$.error('Method ' +  method + ' does not exist on jQuery.TitleTips');
		}
	};

	/*
	 * Return a new tooltip object
	 */
	function createTooltip(text) {
		var content
			= $('<span></span>')
				.addClass('title_tips content')
				.append(text);

		var image
			= $('<div></div>')
				.addClass('title_tips image')
				.append(content);

		var tooltip
			= $('<div></div>')
				.addClass('title_tips tooltip')
				.append(image);

		return tooltip;
	}
})(jQuery);
