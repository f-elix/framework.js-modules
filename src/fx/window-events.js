/**
 * Centralize window events to avoid duplicates and improve global performance
 * @author Deux Huit Huit
 *
 * App.fx.notify('window.on', {
 * 		event: 'event', // (eg. 'scroll', 'resize', 'orientationchange', etc)
 * 		handler: myHandlerFunction
 * });
 *
 * App.fx.notify('window.off', {
 * 		event: 'sameevent',
 * 		handler: sameHandler
 * });
 *
 */
(function () {
	'use strict';

	const listeners = {};

	const handleEvents = (event) => {
		const handlers = listeners[event.type];
		handlers.forEach((handler) => {
			handler(event);
		});
	};

	const on = (key, { event, handler }) => {
		const evt = listeners[event];
		if (evt) {
			evt.add(handler);
			return;
		}
		listeners[event] = new Set();
		listeners[event].add(handler);
		window.addEventListener(event, handleEvents);
	};

	const off = (key, { event, handler }) => {
		const evt = listeners[event];
		if (!evt) {
			return;
		}
		evt.delete(handler);
		if (evt.size === 0) {
			window.removeEventListener(event, handleEvents);
			delete listeners[event];
		}
	};

	App.fx.exports('window.on', on);
	App.fx.exports('window.off', off);
})();
