/* This file contains main script for website
 * Style related scripts is located in style.js
 */
/* global document jQuery */

// initialize when document is ready
jQuery(document).ready(function($) {

	// initialize Flickity
	var $slider = $('.js-slider').find('.slides').flickity({
		imagesLoaded: true,
		pageDots: false
	});

	var sliderFlick = $slider.data('flickity');
	var $sliderNav = $slider.siblings('.slides-nav');
	var $sliderNavButton = $sliderNav.find('.bullet');

	$slider.on('cellSelect', function() {
		$sliderNavButton.filter('.is-selected').removeClass('is-selected');
		$sliderNavButton.eq(sliderFlick.selectedIndex).addClass('is-selected');
	});

	$sliderNav.on('click', '.bullet', function(e) {
		var index = $(this).index();
		$slider.flickity('select', index);
		e.preventDefault();
	});

	// initialize magnificPopup
	$('.js-popup-link').magnificPopup({
		type: 'inline',
		mainClass: 'mfp-animation',
		removalDelay: 200
	});

	//AUDIO PLAYER
	var audioPlayer = $('.audio-player');
	var playerInterval = null;
	var section = $('body').find('.audio-player-container .audios .audio');
	var audio = audioPlayer.find('.audio audio');
	var totalIndex = audioPlayer.find('.audio').length;

	//AUDIO CONTROL
	var audioControl = $('.player-control');
	var playButton = audioControl.find('.player-button.play');
	var pauseButton = audioControl.find('.player-button.pause');
	var replayButton = audioControl.find('.player-button.replay');
	var fullButton = audioControl.find('.player-button.fullscreen-enter');
	var exitFullButton = audioControl.find('.player-button.fullscreen-exit');

	// Tommy 26.11.18
	function shuffleAudio() {
		var $audio = $('.audio-player-container .audios.random .audio');
		if($audio.length > 0) {
			$audio.shuffle();
		}
	}

	function audioReset() {
		shuffleAudio();
		audioTrigger('pause');
		audio.prop("currentTime",0);
		clearInterval(playerInterval);
		$('body').find('.audio-player-container .audios .audio').removeClass('is-current');
		$('body').find('.audio-player-container .audios .audio').first().addClass('is-current');
		playButton.removeClass('is-hidden');
		pauseButton.addClass('is-hidden');
		audio.removeClass('is-playing');
	}
	// End Tommy 26.11.18

	function audioNext() {
		var currentSection = audioPlayer.find('.audio.is-current');
		var currentIndex = currentSection.index();

		if(currentIndex < (totalIndex - 1)) {
			playerInterval = setInterval(function() {
				currentSection.removeClass('is-current').next().addClass('is-current');
				audioTrigger('play');
			}, 350);
		}
		else {
			clearInterval(playerInterval);
		}
	}

	function audioTrigger(event) {
		var currentAudio = audioPlayer.find('.audio.is-current audio');

		currentAudio.trigger(event);
		clearInterval(playerInterval);
	}

	//Tommy Update Audio player 15.08.18 
	var iVal = null;
	
	function fadedControl() {
		clearInterval(iVal);
		iVal = setInterval(function() {
			$('.player-control').addClass('faded');
		}, 1000);
	}

	//Tommy update mousemove 23.08.18
	$(document).mousemove(function() {
		var currentSection = audioPlayer.find('.audio.is-current');
		var currentIndex = currentSection.index();

		$('.player-control').removeClass('faded');
		clearInterval(iVal);

		if(currentIndex < (totalIndex - 1) && !audio.on('playing')) {
			iVal = setInterval(function() {
				$('.player-control').addClass('faded');
			}, 1000);
		}
	});
	//End Tommy update mousemove 23.08.18

	//AUDIO RESET
	audio.on('playing', function() {
		audio.addClass('is-playing');
		playButton.addClass('is-hidden');
		pauseButton.removeClass('is-hidden');
		fadedControl();
	});

	audio.on('pause', function() {
		audio.removeClass('is-playing');
	});
	 
	audio.on('ended', function() {
		var currentSection = audioPlayer.find('.audio.is-current');
		var currentIndex = currentSection.index();

		if(currentIndex == (totalIndex - 1)) {
			playButton.removeClass('is-hidden');
			pauseButton.addClass('is-hidden');
			$('.player-control').removeClass('faded');
			clearInterval(iVal);
		}
		
		audio.removeClass('is-playing');

		audioNext();
 	});

	playButton.on('click', function() {
		audioTrigger('play');
	});

	pauseButton.on('click', function() {
		audioTrigger('pause');
		playButton.removeClass('is-hidden');
		pauseButton.addClass('is-hidden');
		$('.player-control').removeClass('faded');
		clearInterval(iVal);
	});

	replayButton.on('click', function() {
		audioReset();
	});

	fullButton.on('click', function() {
		fullButton.addClass('is-hidden');
		exitFullButton.removeClass('is-hidden');
		openFullscreen();
	});

	exitFullButton.on('click', function() {
		fullButton.removeClass('is-hidden');
		exitFullButton.addClass('is-hidden');
		closeFullscreen();
	});
	//End Tommy Update Audio player 15.08.18

	//Tommy 14.08.18 Fix short key
	//SHORT KEY
	var keySpace = 32;

	$(document).keyup(function(e) {
  	if (e.keyCode == keySpace) {
			if(audio.hasClass('is-playing')) {
				pauseButton.click();
			}
			else {
				playButton.click();
			}
		}
	});
	//Tommy 14.08.18 Fix short key
	
	function adminMainHeight() {
		var headerHeight = $('.site-header').height();
		var mainHeight = ($(window).height() - headerHeight);
		var adminMainH = mainHeight - $('.design-by').height() - 119;
		var pageContainerH = mainHeight - $('.design-by').height() - 71;

		$('.admin-main').css('min-height', mainHeight - 1);
		$('.admin-page').css('min-height', adminMainH);
		$('.page-container').css('min-height', pageContainerH);
	}

	adminMainHeight();

	$(window).resize(function() {
		adminMainHeight();

		if($(window).width() > 1023) {
			$('.aside-nav-menu').slideDown('100');
		}
		else {
			$('.aside-nav-menu').slideUp('100');
		}
	});

	$('.menu-toggle.show-menu').click(function() {
		$('.aside-nav-menu').slideDown('300');
		$(this).addClass('is-hidden');
		$('.menu-toggle.hide-menu').removeClass('is-hidden');
	});

	$('.menu-toggle.hide-menu').click(function() {
		$('.aside-nav-menu').slideUp('300');
		$(this).addClass('is-hidden');
		$('.menu-toggle.show-menu').removeClass('is-hidden');
	});

	//Tommy 06.08.18
	$('.notice-close').click(function() {
		$(this).parent('.action-notice').addClass('is-hidden');
	});
	//End Tommy 06.08.18

	//Tommy 14.08.18
	var elem = document.documentElement;
	
	$(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    var event = state ? 'FullscreenOn' : 'FullscreenOff';

    if(event == 'FullscreenOff') {
			fullButton.removeClass('is-hidden');
			exitFullButton.addClass('is-hidden');
		}
	});

  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
		}
	}
	
  function closeFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	}
	//End Tommy 14.08.18

	//Tommy 23.08.18
	$(function() {
		//fullButton.trigger('click');
	});
	//End Tommy 23.08.18
	
	//Tommy 5.09.18
	$('.js-select2').select2({ width: '100%' });
	//End Tommy 5.09.18

});
