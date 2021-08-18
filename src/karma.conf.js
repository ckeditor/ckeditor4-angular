// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

let options = process.env.KARMA_OPTIONS;
options = options ? JSON.parse( options ) : {};

// Following environment variables must be set if BrowserStack is used.
// Omit them if locally installed browsers are used.
const {
	// Set via CLI
	BROWSER_STACK_USERNAME,
	BROWSER_STACK_ACCESS_KEY,
	BUILD_SLUG,

	// Set by scripts/angular-tester.js
	REQUESTED_ANGULAR_VERSION,
} = process.env;

module.exports = function ( config ) {
	const LOG_INFO = config.LOG_INFO;

	// Browsers are controlled via CLI, e.g.:
	//
	// `npm test -- --browsers Firefox`
	//
	// Defaults to locally installed Chrome.
	const browsers = config.browsers.length === 0 ? [ 'Chrome' ] : config.browsers;

	config.set({
		basePath: '',

		frameworks: [ 'jasmine', '@angular-devkit/build-angular' ],

		plugins: getPlugins(),

		client: {
			// leave Jasmine Spec Runner output visible in browser
			clearContext: false,
			captureConsole: false,
			jasmine: {
				random: false,
			},
		},

		reporters: [ 'spec' ],

		port: 9876,

		colors: true,

		logLevel: LOG_INFO,

		browsers,

		// Makes sure to disable watch mode for BrowserStack.
		singleRun: shouldEnableBrowserStack() ? true : !options.watch,

		specReporter: {
			suppressPassed: true,
			suppressErrorSummary: true,
			maxLogLines: 8,
		},

		...( options.url && { files: [ options.url ] } ),

		// Makes sure that BrowserStack tests end properly.
		browserDisconnectTimeout: 3 * 60 * 1000,
		browserDisconnectTolerance: 1,
		browserNoActivityTimeout: 3 * 60 * 1000,

		// Configures BrowserStack browsers.
		customLaunchers: {
			BrowserStack_Edge: {
				base: 'BrowserStack',
				os: 'Windows',
				os_version: '10',
				browser: 'edge',
			},
			BrowserStack_IE11: {
				base: 'BrowserStack',
				os: 'Windows',
				os_version: '10',
				browser: 'ie',
				browser_version: '11.0',
			},
			BrowserStack_Safari: {
				base: 'BrowserStack',
				os: 'OS X',
				os_version: 'Big Sur',
				browser: 'safari',
			},
		},

		// Configures BrowserStack options.
		browserStack: {

			// Secret values that can be found on BS dashboard.
			username: BROWSER_STACK_USERNAME,
			accessKey: BROWSER_STACK_ACCESS_KEY,

			// Name that will be displayed for a group of tests.
			// This value should be unique, especially for CI tests. Commit SHA or timestamp should be used.
			build: BUILD_SLUG || 'ckeditor4-angular local',

			// Name that will be displayed for a given test suite.
			// It should uniquely identify a test suite.
			name: `${ browsers[ 0 ] } - Angular ${ REQUESTED_ANGULAR_VERSION }`,

			// Bounds tests to a given project on BS.
			project: 'ckeditor4',

			// Disablees video recording.
			video: false,
		},
	});
};

function getPlugins() {
	const plugins = [
		require( 'karma-jasmine' ),
		require( 'karma-chrome-launcher' ),
		require( 'karma-firefox-launcher' ),
		require( 'karma-jasmine-html-reporter' ),
		require( '@angular-devkit/build-angular/plugins/karma' ),
		require( 'karma-spec-reporter' ),
	];

	if ( shouldEnableBrowserStack() ) {
		plugins.push(require('karma-browserstack-launcher'));
	}

	return plugins;
}

function shouldEnableBrowserStack() {
	return (
		process.env.BROWSER_STACK_ACCESS_KEY &&
		process.env.BROWSER_STACK_USERNAME
	);
}
