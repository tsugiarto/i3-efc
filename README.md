# Gulper: Gulpy Website Generator

**Gulper is Gulp-based static webpage generator.** It includes HTML boilerplate, not-so-minimal CSS, and some JS scripts for kickstarting web projects. It also includes _Documentation_ template.

Gulper does:
+ Live reloading browser
+ Compile kit (http://incident57.com/codekit/help.html#kit) to HTML
+ Compile SCSS to CSS
+ Autoprefix CSS to support last 2 versions
+ Lint, babelify, concatenate and uglify JavaScript
+ Optimize SVG files with SVGO
+ Combine SVG files in assets/images/symbols/ to SVG Symbol (https://github.com/Hiswe/gulp-svg-symbols)

Gulper doesn't:
+ optimize images, use **imageoptim** or **jpegmini**
+ generate favicons, use http://realfavicongenerator.net/

Have fun! :)

## USAGE

+ open terminal
+ run `npm install`
+ run `gulp` to start development mode
+ run `gulp build` for production-ready website

## KNOWN ISSUES

+ svg source without <xml> will fail silently, close and re-run `gulp` if this happens
+ always use useref for script, un-useref-ed script will not included in _dist/_
+ to review _doc/_, run `gulp build` since _doc/_ needs bundle.js

## CHANGELOG
1.3 (Jan 8, 2018)
+ remove GSAP independency
+ changes on file structure

1.2 (Jan 7, 2018)
+ too many changes o.0

1.1.4 (Feb 13, 2017)
+ footer.kit: divide library.js and bundle.js because of babel
+ helper.js: *NEW*
+ gulpfile.js & package.json: add babel for bundle.js

1.1.3 (Jan 18, 2017)
+ style.js: add script for get mouse position

1.1.2 (Jan 12, 2017)
+ fastclick.js: removed (no longer required)
+ gulpfile.js: updated
+ magnific-popup.js: updated
+ magnific-popup.scss: updated
+ Various changes on scss

1.1.1 (Jan 6, 2017)
+ HAPPY NEW YEAR! Change name from Haunter to Gulper
+ header.kit: update jquery src from CDN with fallback
+ mixins.scss: add font-fluid mixin

1.1.0 (Dec 20, 2016)
+ .htaccess: updated based on HTML5 Boilerplate
+ index.kit: add guide to write HTML markup
+ Various changes on scss

1.0.9 (Nov 25, 2016)
+ /root: Update favicon
+ footer.kit: remove instantClick.js
+ mixins.scss: change creeper breakpoint 480px to 414px
+ Various small fix

1.0.8 (Oct 26, 2016)
+ Add symbols folder inside assets/images to hold SVG symbols
+ Update gulpfile.js to reflect above change

1.0.7 (Oct 25, 2016)
+ Move jquery to header
+ Update flickity.js to 2.0.5
+ style.css: update class naming
+ style.js: rewrite switchFunction & toggleFunction
+ gulpfile.js & package.json: updated

1.0.6 (Aug 31, 2016)
+ Rewrite Documentation
+ Rename entry.scss to wordpress.scss
+ variables.scss: remove opacity, tint, and shade variables (rather than using fixed variable, try to adjust opacity visually)
+ mixins.scss: add box-shadow mixins
+ table.scss: *NEW*
+ wrapper.scss: *REMOVED*
+ style.js: add GSAP to js-toggle-hover

1.0.5 (Aug 27, 2016)
+ Add ScrollMagic.min.js and its plugins
+ Remove Font Awesome
+ Fix Documentation

1.0.4 (Aug 26, 2016)
+ Add Greensock TweenMax, remove VelocityJS
+ Remove jquery.walker-tabs.js
+ style.js: convert VelocityJS-dependant script to TweenMax, rewrite switch and toggle scripts

1.0.3 (Aug 10, 2016)
+ /scss/plugins: *NEW*
+ js.scss: *NEW*
+ script.js & style.js: add `js-` prefix to js selector
+ Various small fix

1.0.2 (Aug 9, 2016)
+ Update readme.md
+ Various small fix

1.0.1 (Aug 6, 2016)
+ /scss: rearranged
+ style.js: remove unnecessary scripts
+ gulpfile.js: fix bugs

1.0.0 (Jul 14, 2016)
+ Fresh start!
+ Inspired from Walker 2.50
