/* This file extends the limit of style.css
 * Style related scripts including polyfill should be written here
 */
/* global window document history MouseEvent getParameterByName hasChild Stickyfill anime scrollMonitor svg4everybody */

(function() {

	const $body = document.querySelector('body');

	let windowWidth = document.documentElement.clientWidth;

	// svg polyfill
	svg4everybody();

	// sticky polyfill
	const stickyElements = document.getElementsByClassName('js-sticky');

	for (let i = stickyElements.length - 1; i >= 0; i -= 1) {
		Stickyfill.add(stickyElements[i]);
	}

	// anime.js animation
	function animeSlide(target, duration, height, opacity, delay) {
		anime.remove(target);
		target.style.overflow = 'hidden';

		const animation = anime({
			targets: target,
			height,
			opacity,
			duration,
			delay,
			easing: 'easeOutQuad'
		});

		function hideElement() {
			if (height === 0) {
				target.style.display = 'none';
			}
		}

		animation.finished.then(hideElement);
	}

	function animeSlideDown(target, duration, delay) {
		let targetHeight;

		target.style.display = 'block';
		target.style.height = 'auto';
		targetHeight = target.offsetHeight;
		target.style.height = 0;
		animeSlide(target, duration, targetHeight, 1, delay);
	}

	function animeSlideUp(target, duration, delay) {
		animeSlide(target, duration, 0, 0, delay);
	}

	// scroll to targeted id
	function scrollTo(event, element) {
		const scrollY = window.scrollY,
			scrollTarget = element.dataset.scrollTarget || element.hash || '',
			$scrollTarget = document.querySelector(`[id='${scrollTarget.substring(1)}']`),
			scrollTargetY = $scrollTarget.getBoundingClientRect().top,
			scrollDuration = element.dataset.scrollDuration || 200,
			$offset = document.querySelector(element.dataset.scrollOffset) || '',
			offsetY = $offset.offsetHeight || 0;

		const prop = {
			y: 0
		};

		if ($scrollTarget) {
			const animation = anime({
				targets: prop,
				y: scrollTargetY + scrollY - offsetY,
				round: 1,
				duration: scrollDuration,
				easing: 'easeOutQuad',
				update: function() {
					window.scrollTo(0, prop.y);
				}
			});
			event.preventDefault();
		}
	}

	// scroller function
	/* data-scroll-target="[selector]" -> scroll to target
	   data-scroll-offset="[selector]" -> offset of selector height
	   data-scroll-duration="[duration]" -> how long is scrolling animation
	*/
	const scrollFunction = function(event) {
		const $scrolls = document.querySelectorAll('.js-scroll');

		$scrolls.forEach(scroll => scroll.addEventListener('click', function(event) { scrollTo(event, this); }));
	}();

	// unwrapper function: fixing calculation bug because of scrollbar
	const unwrapperFunction = function(event) {
		const $unwrapper = document.querySelectorAll('.js-unwrapper');
		let math = `calc(50% - ${windowWidth}px/2)`;

		function unwrapperInit() {
			windowWidth = document.documentElement.clientWidth;

			if (windowWidth >= 1152) {
				math = `calc(50% - ${windowWidth}px/2)`;

				$unwrapper.forEach(element => {
					element.style.marginLeft = math;
					element.style.marginRight = math;
				});
			} else {
				$unwrapper.forEach(element => {
					element.style.marginLeft = null;
					element.style.marginRight = null;
				});
			}
		}

		unwrapperInit();
		window.addEventListener('resize', unwrapperInit);
	}();

	// init scrollMonitor
	const sceneFunction = function() {
		const $scenes = document.querySelectorAll('.js-scene');

		function sceneInit($this) {
			const sceneOffset = parseInt($this.dataset.sceneOffset) || 0;
			const sceneWatcher = scrollMonitor.create($this, sceneOffset);

			sceneWatcher.enterViewport(function() {
				this.watchItem.classList.add('in-viewport');
			});

			sceneWatcher.exitViewport(function() {
				this.watchItem.classList.remove('in-viewport');
			});
		}

		$scenes.forEach(scene => sceneInit(scene));
	}();

	// tab function, can use scroll to function
	/* data-tab-type="normal|collapse" -> collapse tab can be closed individually
	   data-tab-group="[name]" -> tab grouping
	   data-tab-duration="[ms]" -> how long is tab animation if tab method is auto
	*/
	const tabFunction = function() {
		const $tabs = document.querySelectorAll('.js-tab');

		function tabInit() {
			const $tabTargets = document.querySelectorAll('.js-tab-target'),
				$firstTabs = document.querySelectorAll('[data-tab-group]:first-child'),
				$firstTabTargets = document.querySelectorAll('[data-tab-group].js-tab-target:first-child'),
				queryString = getParameterByName('tab'),
				$this = document.querySelector(`a[href="#${queryString}"]`),
				$tabTarget = $this && document.querySelector($this.hash);

			$tabTargets.forEach(element => element.style.display = 'none');
			$firstTabTargets.forEach(element => element.style.display = 'block');
			$firstTabs.forEach(element => element.classList.add('is-tabbed'));

			if (queryString && $tabTarget) {
				const $tabGroup = document.querySelectorAll(`[data-tab-group="${$tabTarget.dataset.tabGroup}"]`),
					$tabTargetGroup = document.querySelectorAll(`[data-tab-group="${$tabTarget.dataset.tabGroup}"].js-tab-target`);

				$tabTargetGroup.forEach(element => element.style.display = 'none');
				$tabGroup.forEach(element => element.classList.remove('is-tabbed'));
				$this.classList.add('is-tabbed');
				$tabTarget.style.display = 'block';
				$tabTarget.classList.add('is-tabbed');
			}
		}

		function tabSwitch(event, $this) {
			const $tabTarget = document.querySelector($this.hash);

			if ($tabTarget) {
				const $tabGroup =  document.querySelectorAll(`[data-tab-group="${$tabTarget.dataset.tabGroup}"]`),
					$tabTargetGroup = document.querySelectorAll(`.js-tab-target[data-tab-group="${$tabTarget.dataset.tabGroup}"]`),
					tabType = $this.dataset.tabType || 'tab',
					tabTarget = $this.hash.substring(1),
					tabDuration = $this.dataset.tabDuration || 200,
					tabScrollTarget = $this.dataset.scrollTarget;

				if (!$tabTarget.classList.contains('is-tabbed')) {
					let closeDuration = 0;

					$tabTargetGroup.forEach(element => {
						if (element.classList.contains('is-tabbed')) {
							closeDuration = tabDuration/2;
						}
					});

					$tabTargetGroup.forEach(element => animeSlideUp(element, closeDuration, 0));
					animeSlideDown($tabTarget, tabDuration, 0);
					$tabGroup.forEach(element => element.classList.remove('is-tabbed'));
					$this.classList.add('is-tabbed');
					$tabTarget.classList.add('is-tabbed');

					if (tabScrollTarget) {
						setTimeout(function() {
							scrollTo(event, $this);
						}, closeDuration);
					}

					if (window.history && history.pushState) {
						history.replaceState('', '', '?tab' + '=' + tabTarget);
					}
				} else {
					if (tabType === 'collapse') {
						$tabTargetGroup.forEach(element => animeSlideUp(element, tabDuration, 0));
						$this.classList.remove('is-tabbed');
						$tabTarget.classList.remove('is-tabbed');

						if (window.history && history.pushState) {
							history.replaceState('', '', '?');
						}
					}
				}

				event.preventDefault();
			}
		}

		tabInit();
		$tabs.forEach(tab => tab.addEventListener('click', function(event) { tabSwitch(event, this); }));
	}();

	// toggle function, can use scroll to function
	/* data-toggle-trigger="click|hover" -> how will toggle be triggered
	   data-toggle-target="[selector]" -> toggle target
	   data-toggle-area="[selector]" -> toggle will end outside this area
	   data-toggle-animation="slide|manual" -> how toggle is handled
	   data-toggle-duration="[ms]" -> how long is toggle animation
	   data-toggle-focus="[selector]" -> toggle will focus on targeted form
	   data-toggle-iteration="infinite|once" -> once will only trigger toggle once
	   data-toggle-state="undefined|toggled" -> toggle state on page load
	   data-toggle-keyclose="false|true" -> toggle target can be closed by keydown
	   data-scroll-target="[selector]" -> scroll to target
	*/
	const toggleFunction = function() {
		const $toggles = document.querySelectorAll('.js-toggle'),
			$togglesImage = document.querySelectorAll('.js-toggle[data-toggle-type="image"]');

		function toggleInit($this) {
			const eventClick = new MouseEvent('click'),
				eventMouse = new MouseEvent('mouseenter');

			if ($this.dataset.toggleState === 'toggled') {
				toggleOpen(eventClick, $this);
				toggleOpen(eventMouse, $this);
			}
		}

		function toggleOpen(event, $this) {
			const toggleTrigger = $this.dataset.toggleTrigger || 'click',
				toggleTarget = $this.dataset.toggleTarget || $this.hash,
				$toggleTarget = document.querySelector(toggleTarget),
				$toggleArea = document.querySelector($this.dataset.toggleArea) || $this,
				$toggleFocus = document.querySelector($this.dataset.toggleFocus),
				toggleAnimation = $this.dataset.toggleAnimation || 'slide',
				toggleDuration = $this.dataset.toggleDuration || 200,
				toggleIteration = $this.dataset.toggleIteration || 'infinite',
				toggleScrollTarget = $this.dataset.scrollTarget,
				toggleKeyclose = $this.dataset.toggleKeyclose || false,
				bodyClass = toggleTarget.substring(1),
				preventDefault = $this.dataset.toggleTarget ? false : true;

			if (!$toggleTarget) return false;

			if (!$this.classList.contains('js-toggle')){
				return false;
			}

			if (event.type === 'mouseenter' || event.type === 'touchstart') {
				if (toggleTrigger === 'hover') {
					const $toggleLinkToggled = $toggleArea.querySelectorAll('.js-toggle.is-toggled');

					if (toggleIteration === 'once') {
						$this.classList.remove('js-toggle');
					}

					$toggleLinkToggled.forEach(toggle => {
						if (toggle !== $this) {
							toggle.classList.remove('is-toggled');
						}
					});

					const $toggleAllToggled = $toggleArea.querySelectorAll('.is-toggled'),
						$toggleCurrentToggled = [];

					$toggleAllToggled.forEach(toggle => {
						if (toggle !== $this && toggle !== $toggleTarget) {
							$toggleCurrentToggled.push(toggle);
						}
					});

					if (toggleAnimation === 'slide') {
						$toggleCurrentToggled.forEach(toggle => animeSlideUp(toggle, toggleDuration/2, 0));
					}

					$toggleCurrentToggled.forEach(toggle => toggle.classList.remove('is-toggled'));

					if ($this.classList.contains('is-toggled') === false) {
						$this.classList.add('is-toggled');
						$toggleTarget.classList.add('is-toggled');
						if (toggleAnimation === 'slide') {
							animeSlideDown($toggleTarget, toggleDuration, toggleDuration/2);
						}
					}

					$toggleArea.addEventListener('mouseleave', function(event) {
						toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
					});
					$body.addEventListener('click', function(event) {
						toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
					});
					$body.addEventListener('touchend', function(event) {
						toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
					});
				}
			} else if (event.type === 'click') {
				if (toggleTrigger === 'click') {
					if (toggleIteration === 'once') {
						$this.classList.remove('js-toggle');
					}

					if ($this.classList.contains('is-toggled') || $toggleTarget.classList.contains('is-toggled')) {
						if (!hasChild($this, $toggleArea)) {
							$this.classList.remove('is-toggled');
							$this.classList.add('is-untoggling');
							$toggleTarget.classList.remove('is-toggled');
							$toggleTarget.classList.add('is-untoggling');
							$body.classList.add(bodyClass+'-is-untoggling');
							setTimeout(function() {
								$this.classList.remove('is-untoggling');
								$toggleTarget.classList.remove('is-untoggling');
								$body.classList.remove(bodyClass+'-is-toggled', bodyClass+'-is-untoggling');
							}, toggleDuration);
							if (toggleAnimation === 'slide') {
								animeSlideUp($toggleTarget, toggleDuration/2, 0);
							}
						}
					} else {
						$this.classList.add('is-toggling');
						$toggleTarget.classList.add('is-toggling');
						$body.classList.add(bodyClass+'-is-toggling');

						setTimeout(function() {
							$this.classList.remove('is-toggling');
							$this.classList.add('is-toggled');
							$toggleTarget.classList.remove('is-toggling');
							$toggleTarget.classList.add('is-toggled');
							$body.classList.remove(bodyClass+'-is-toggling');
							$body.classList.add(bodyClass+'-is-toggled');

							if ($toggleFocus) {
								$toggleFocus.focus();
							}
						}, toggleAnimation === 'manual' ? 1 : toggleDuration);

						if (toggleScrollTarget) {
							scrollTo(event, $this);
						}
						if (toggleAnimation === 'slide') {
							animeSlideDown($toggleTarget, toggleDuration, 0);
						}

						$body.addEventListener('click', function(event) {
							toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
						});
						$body.addEventListener('touchend', function(event) {
							toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
						});

						if (toggleKeyclose === 'true') {
							document.addEventListener('keydown', function(event) {
								toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass);
							});
						}
					}

					if (preventDefault === true) {
						event.preventDefault();
					}
				}
			}
		}

		function toggleClose(event, $this, toggleTrigger, $toggleTarget, $toggleArea, toggleAnimation, toggleDuration, bodyClass) {
			if ($this.classList.contains('is-toggled') || $toggleTarget.classList.contains('is-toggled')) {
				if ((toggleTrigger === 'hover' && event.type !== 'click') || (toggleTrigger === 'click' && event.type === 'keydown')) {
					$this.classList.remove('is-toggled');
					$this.classList.add('is-untoggling');
					$toggleTarget.classList.remove('is-toggled');
					$toggleTarget.classList.add('is-untoggling');
					setTimeout(function() {
						$this.classList.remove('is-untoggling');
						$toggleTarget.classList.remove('is-untoggling');
					}, toggleDuration);
					if (toggleAnimation === 'slide') {
						animeSlideUp($toggleTarget, toggleDuration/2, 0);
					}
				} else {
					if ($this !== event.target && !hasChild($this, event.target) && $toggleArea !== event.target && !hasChild($toggleArea, event.target)) {
						$this.classList.remove('is-toggled');
						$this.classList.add('is-untoggling');
						$toggleTarget.classList.remove('is-toggled');
						$toggleTarget.classList.add('is-untoggling');
						$body.classList.add(bodyClass+'-is-untoggling');
						setTimeout(function() {
							$this.classList.remove('is-untoggling');
							$toggleTarget.classList.remove('is-untoggling');
							$body.classList.remove(bodyClass+'-is-toggled', bodyClass+'-is-untoggling');
						}, toggleDuration);
						if (toggleAnimation === 'slide') {
							animeSlideUp($toggleTarget, toggleDuration/2, 0);
						}
					}
				}
			}
		}

		$toggles.forEach(toggle => {
			toggleInit(toggle);
			toggle.addEventListener('click', function(event) { toggleOpen(event, this); });
			toggle.addEventListener('mouseenter', function(event) { toggleOpen(event, this); });
			toggle.addEventListener('touchstart', function(event) { toggleOpen(event, this); });
		});
	}();

	// mover function (will move elements depending of breakpoints)
	/* data-mover-breakpoint="[width]" -> mover breakpoint width
	   data-mover-target="[selector]" -> mover will append selected element to this selector
	*/
	const moverFunction = function() {
		const $movers = document.querySelectorAll('.js-mover');

		function moverStart(element) {
			const $this = element;

			$this.insertAdjacentHTML('beforebegin', '<div class="js-mover-source"></div>');

			const $moverSource = $this.previousElementSibling,
				$moverTarget = document.querySelector($this.dataset.moverTarget),
				moverBreakpoint = $this.dataset.moverBreakpoint;
			let windowWidth = document.documentElement.clientWidth;

			if (windowWidth >= moverBreakpoint) {
				$moverTarget.appendChild($this);
			}

			window.addEventListener('resize', function() {
				windowWidth = document.documentElement.clientWidth;

				if (windowWidth >= moverBreakpoint) {
					if ($this.parentNode !== $moverTarget) {
						$moverTarget.appendChild($this);
					}
				} else {
					if ($this.parentNode !== $moverSource) {
						$moverSource.parentNode.insertBefore($this, $moverSource.nextSibling);
					}
				}
			});
		}

		$movers.forEach(mover => moverStart(mover));
	}();

	// form file function
	/* EXAMPLE
		<div class="form-file js-form-file">
			<label class="label">File</label>
			<div class="input">
				<input type="file" id="checkout-attachment" class="form-file-input" name="checkout-attachment" data-multiple-placeholder="{count} files selected" multiple>
				<label for="checkout-attachment" class="form-file-label"><span class="button">Browse files</span> <span class="placeholder">No file selected&hellip;</span></label>
				<a href="#" class="form-file-remove" title="Remove attachment">&times;</a>
			</div>
		</div>
	*/
	const formFileFunction = function() {
		const $formFile = document.querySelectorAll('.js-form-file');

		$formFile.forEach(element => {
			const $input = element.querySelector('.form-file-input'),
				$label = element.querySelector('.form-file-label'),
				$remove = element.querySelector('.form-file-remove'),
				labelDefault = $label.innerHTML;

			function addFile($this, event) {
				let $files = $this.files,
					fileName = '',
					fileSize = 0;

				for (let file of $files) {
					fileSize += file.size;
				}
				fileSize = Math.round(fileSize/1024/1024 * 100) / 100;

				if ($this.files && $this.files.length > 1) {
					fileName = `${($this.getAttribute('data-multiple-placeholder') || '').replace('{count}', $this.files.length)} (${fileSize}MB)`;
				} else if (event.target.value) {
					fileName = `${event.target.value.split('\\').pop()} (${fileSize}MB)`;
				}

				if (fileName) {
					const $labelCaption = $label.querySelector('.placeholder');
					$labelCaption.innerHTML = fileName;
					$label.classList.add('has-placeholder');
				} else {
					removeFile(event);
				}
			}

			function removeFile(event) {
				$input.value = '';
				$label.innerHTML = labelDefault;
				$label.classList.remove('has-placeholder');
				event.preventDefault();
			}

			$input.addEventListener('change', function(event) {
				addFile(this, event);
			});

			if ($remove) {
				$remove.addEventListener('click', function(event) {
					removeFile(event);
				});
			}

		});
	}();

	// Tommy 14.08.18 Fix Slip Js
	function setupSlip(list) {
		if(list) {
			list.addEventListener('slip:beforereorder', function(e){
				if (e.target.classList.contains('slip-no-reorder')) {
					e.preventDefault();
				}
			}, false);
			list.addEventListener('slip:beforeswipe', function(e){
				if (e.target.nodeName == 'INPUT' || e.target.classList.contains('slip-no-swipe')) {
					e.preventDefault();
				}
			}, false);
			list.addEventListener('slip:beforewait', function(e){
				if (e.target.classList.contains('repeater-sort')) e.preventDefault();
			}, false);
			list.addEventListener('slip:afterswipe', function(e){
				e.target.parentNode.appendChild(e.target);
			}, false);
			list.addEventListener('slip:reorder', function(e){
				e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
				return false;
			}, false);

			return new Slip(list);
		}
	}
	// End Tommy 14.08.18

	setupSlip(document.getElementById('slip-repeaters'));

	// Tommy 26.11.18
	$.fn.shuffle = function() {
 
		var allElems = this.get(),
				getRandom = function(max) {
						return Math.floor(Math.random() * max);
				},
				shuffled = $.map(allElems, function(){
						var random = getRandom(allElems.length),
								randEl = $(allElems[random]).clone(true)[0];
						allElems.splice(random, 1);
						return randEl;
			 });

		this.each(function(i){
				$(this).replaceWith($(shuffled[i]));
		});

		console.log(shuffled);
		
		return $(shuffled);

	};
	// End Tommy 26.11.18

})();
