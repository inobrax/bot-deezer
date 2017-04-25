(function() {
	if (typeof document.getElementsByClassName === 'function') {
		var widgets = document.getElementsByClassName('deezer-widget-player');
	} else {
		var widgets = document.querySelectorAll('deezer-widget-player');
	}

	for (var i = 0, end = widgets.length; i < end; i++) {
		widgets[i].innerHTML = '';

		var iframe = document.createElement('iframe');

		iframe.src = widgets[i].getAttribute('data-src');
		iframe.scrolling = widgets[i].getAttribute('data-scrolling');
		iframe.frameBorder = widgets[i].getAttribute('data-frameborder');
		iframe.setAttribute('frameBorder', widgets[i].getAttribute('data-frameborder'));
		iframe.allowTransparency = widgets[i].getAttribute('data-allowTransparency');
		iframe.width = widgets[i].getAttribute('data-width');
		iframe.height = widgets[i].getAttribute('data-height');

		widgets[i].appendChild(iframe);
	}
}());