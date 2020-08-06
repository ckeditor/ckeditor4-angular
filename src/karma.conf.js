// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

let options = process.env.KARMA_OPTIONS;
options = options ? JSON.parse( options ) : {};

module.exports = function ( config ) {
	config.set( {
		basePath: '',
		frameworks: [ 'jasmine', '@angular-devkit/build-angular' ],
		plugins: getPlugins(),
		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
			captureConsole: false,
			jasmine: {
				random: false
			}
		},
		coverageIstanbulReporter: {
			dir: require( 'path' ).join( __dirname, '../coverage' ),
			reports: [ 'html', 'lcovonly' ],
			fixWebpackSourcePaths: true
		},
		reporters: [ 'spec', 'kjhtml' ],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: getBrowsers(),
		singleRun: !options.watch,

		concurrency: 2,
		captureTimeout: 60000,
		browserDisconnectTimeout: 60000,
		browserDisconnectTolerance: 3,
		browserNoActivityTimeout: 60000,

		specReporter: {
			suppressPassed: shouldEnableBrowserStack()
		},

		...( options.url && { files: [ options.url ] } ),

		customLaunchers: {
			BrowserStack_Edge: {
				base: 'BrowserStack',
				os: 'Windows',
				os_version: '10',
				browser: 'edge'
			},
			BrowserStack_IE11: {
				base: 'BrowserStack',
				os: 'Windows',
				os_version: '10',
				browser: 'ie',
				browser_version: '11.0'
			},
			BrowserStack_Safari: {
				base: 'BrowserStack',
				os: 'OS X',
				os_version: 'High Sierra',
				browser: 'safari'
			}
		},

		browserStack: {
			username: process.env.BROWSER_STACK_USERNAME,
			accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
			build: getBuildName(),
			project: 'ckeditor4'
		},
	} );
};

// Formats name of the build for BrowserStack. It merges a repository name and current timestamp.
// If env variable `TRAVIS_REPO_SLUG` is not available, the function returns `undefined`.
//
// @returns {String|undefined}
function getBuildName() {
	const repoSlug = process.env.TRAVIS_REPO_SLUG;

	if ( !repoSlug ) {
		return;
	}

	const repositoryName = repoSlug.split( '/' )[ 1 ].replace( /-/g, '_' );
	const date = new Date().getTime();

	return `${ repositoryName } ${ date }`;
}

function getPlugins() {
	const plugins = [
		require( 'karma-jasmine' ),
		require( 'karma-chrome-launcher' ),
		require( 'karma-firefox-launcher' ),
		require( 'karma-jasmine-html-reporter' ),
		require( 'karma-coverage-istanbul-reporter' ),
		require( '@angular-devkit/build-angular/plugins/karma' ),
		require( 'karma-spec-reporter' )
	];

	if ( shouldEnableBrowserStack() ) {
		plugins.push(
			require( 'karma-browserstack-launcher' )
		);
	}

	return plugins;
}

function getBrowsers() {
	if ( shouldEnableBrowserStack() ) {
		return [
			'Chrome',
			'BrowserStack_Safari',
			'Firefox',
			'BrowserStack_Edge',
			'BrowserStack_IE11'
		];
	}

	return [
		'Chrome',
		'Firefox'
	];
}

function shouldEnableBrowserStack() {
	if ( !process.env.BROWSER_STACK_USERNAME ) {
		return false;
	}

	if ( !process.env.BROWSER_STACK_ACCESS_KEY ) {
		return false;
	}

	// If the repository slugs are different, the pull request comes from the community (forked repository).
	// For such builds, BrowserStack will be disabled. Read more: https://github.com/ckeditor/ckeditor5-dev/issues/358.
	return ( process.env.TRAVIS_EVENT_TYPE !== 'pull_request' || process.env.TRAVIS_PULL_REQUEST_SLUG === process.env.TRAVIS_REPO_SLUG );
}
