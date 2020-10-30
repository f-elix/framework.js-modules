/**
 *  @author Deux Huit Huit
 *
 *  Prefetch on hover
 */
(function() {
	'use strict';

	const sels = {
		siteLinks: `a[href*="${window.location.host}"], a[href^="/"]`
	};

	const HOVER_PERIOD = 500;
	const HOVER_DELAY = 250;
	const TOUCH_DELAY = 50;

	let prefetchedUrl = [];

	const createPrefetchLink = (link) => {
		if (prefetchedUrl.includes(link.href) || window.location.href.includes(link.href)) {
			return;
		}
		const prefetchLink = document.createElement('link');
		prefetchLink.rel = 'prefetch';
		prefetchLink.href = link.href;
		document.head.appendChild(prefetchLink);
		prefetchedUrl.push(link.href);
	};

	const prefetchOnHover = (el) => {
		let hovering = false;
		let hoverStart = 0;
		let hoverEnd = 0;
		let hoverTime = 0;

		const onLinkHover = (e) => {
			hovering = true;
			hoverTime += hoverEnd - hoverStart;
			hoverEnd = 0;
			hoverStart = Date.now();
			if (hoverTime >= HOVER_PERIOD) {
				createPrefetchLink(el);
				return;
			}
			const isTouch = e.touches;
			setTimeout(
				() => {
					if (hovering) {
						createPrefetchLink(el);
					}
				},
				isTouch ? TOUCH_DELAY : HOVER_DELAY
			);
		};

		const onLinkHoverEnd = () => {
			hovering = false;
			hoverEnd = Date.now();
		};

		el.addEventListener('mouseenter', onLinkHover);
		el.addEventListener('mouseleave', onLinkHoverEnd);
		el.addEventListener('touchstart', onLinkHover);
		el.addEventListener('touchend', onLinkHoverEnd);
	};

	const init = () => {
		const siteLinks = document.querySelectorAll(sels.siteLinks);

		siteLinks.forEach((link) => {
			prefetchOnHover(link);
		});
	};

	App.modules.exports('prefetch-on-hover', () => {
		init
	});
})();