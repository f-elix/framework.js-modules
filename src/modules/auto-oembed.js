/**
 * @author Deux Huit Huit
 *
 * module to manage oembed components
 */
(function ($, global, undefined) {
	
	'use strict';
	
	var win = $(window);
	var site = $('#site');
	var page = $();
	var components = [];
	var isFirstTime = true;
	var BTN_PLAY_SEL = '.js-auto-oembed-play';
	var PLAYER_SEL = '.js-auto-oembed-player';
	var CTN_SEL = '.js-auto-oembed-ctn';
	var IS_PLAYING_CLASS = 'is-playing';
	var DATA_KEY = 'auto-oembed';
	
	var embedOne = function (ctx, force) {
		var vPlayer = ctx.find(PLAYER_SEL);
		var autoLoad = vPlayer.attr('data-autoload');
		
		if (!force) {
			if ($.mobile && autoLoad !== 'mobile' && autoLoad !== 'all') {
				return;
			}
			if (!$.mobile && autoLoad === 'none') {
				return;
			}
		}
		
		var oembed = ctx.data(DATA_KEY) || App.components.create('oembed', {
			container: ctx,
			player: vPlayer
		});
		ctx.data(DATA_KEY, oembed);
		components.push(oembed);
		oembed.load();
		return oembed;
	};
	
	var embedAll = function (ctx) {
		var scope = ctx.is(CTN_SEL) ? ctx : ctx.find(CTN_SEL);
		scope.each(function () {
			embedOne($(this));
		});
	};
	
	var onPlayBtnClick = function (e) {
		var t = $(this);
		var vCtn = t.closest(CTN_SEL);
		var oembed = vCtn.data(DATA_KEY);
		
		if (!oembed) {
			oembed = embedOne(vCtn, true);
		}
		
		if (!!oembed) {
			vCtn.addClass(IS_PLAYING_CLASS);
		}
		
		return global.pd(e);
	};
	
	var onPageEnter = function (key, data) {
		page = $(data.page.key());
		if (!isFirstTime) {
			embedAll(page);
		}
	};
	
	var onPageLeave = function () {
		page.find(CTN_SEL).each(function () {
			var t = $(this);
			var vPlayer = t.find(PLAYER_SEL);
			var oembed = t.data(DATA_KEY);
			t.removeClass(IS_PLAYING_CLASS);
			if (!!oembed) {
				oembed.destroy();
			}
			t.data(DATA_KEY, null);
		});
		page = $();
		components = [];
	};
	
	var onSiteLoaded = function () {
		isFirstTime = false;
		embedAll(page);
	};
	
	var onInfiniteScrollLoaded = function (key, data) {
		if (!!data.ctn) {
			embedAll(data.ctn);
		}
	};
	
	var onArticleChangerEnter = function (key, data) {
		if (!!data.item) {
			embedAll(data.item);
		}
	};
	
	var init = function () {
		site.on($.click, BTN_PLAY_SEL, onPlayBtnClick);
	};
	
	var actions = function () {
		return {
			page: {
				enter: onPageEnter,
				leaving: onPageLeave
			},
			site: {
				loaded: onSiteLoaded
			},
			infiniteScroll: {
				pageLoaded: onInfiniteScrollLoaded
			},
			articleChanger: {
				enter: onArticleChangerEnter
			}
		};
	};
	
	App.modules.exports('auto-oembed', {
		init: init,
		actions: actions
	});
	
})(jQuery, window);
