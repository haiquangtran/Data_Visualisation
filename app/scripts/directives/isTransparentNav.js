'use strict';
/* TODO: Ideally this should be put into a directive. If you have time do it. */

var transparent = true;

var navBar = {
  checkScrollForTransparentNavbar: debounce(function () {
    if ($(document).scrollTop() > 150) {
      if (transparent) {
        transparent = false;
        $('nav[role="navigation"]').removeClass('navbar-transparent');
      }
    } else {
      if (!transparent) {
        transparent = true;
        $('nav[role="navigation"]').addClass('navbar-transparent');
      }
    }
  }, 30)
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
};
