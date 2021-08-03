
// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

let options = process.env.KARMA_OPTIONS;
options = options ? JSON.parse(options) : {};

const {
	// Set via CLI
	BROWSER_STACK_USERNAME,
	BROWSER_STACK_ACCESS_KEY,
	BUILD_SLUG,
	// Set by angular-tester script
	REQUESTED_ANGULAR_VERSION
} = process.env;

module.exports = function ( config ) {
	const LOG_INFO = config.LOG_INFO;
	const browsers = config.browsers.length === 0 ? [ 'Chrome' ] : config.browsers;

	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: getPlugins(),
		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
			captureConsole: false,
			jasmine: {
				random: false,
			},
		},
		reporters: [ 'spec' ],
		port: 9876,
		colors: true,
		logLevel: LOG_INFO,
		autoWatch: true,
		browsers,
		singleRun: !options.watch,

		concurrency: 2,
		captureTimeout: 60000,
		browserDisconnectTimeout: 60000,
		browserDisconnectTolerance: 3,
		browserNoActivityTimeout: 60000,

		specReporter: {
			suppressPassed: true,
			suppressErrorSummary: true,
			maxLogLines: 8,
		},

		...(options.url && { files: [options.url] }),

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

		browserStack: {
			username: BROWSER_STACK_USERNAME,
			accessKey: BROWSER_STACK_ACCESS_KEY,
			build: BUILD_SLUG || 'ckeditor4-angular local',
			name: `${ browsers[ 0 ]} - Angular ${ REQUESTED_ANGULAR_VERSION }`,
			project: 'ckeditor4',
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
		require( 'karma-spec-reporter' )
	];

	if ( shouldEnableBrowserStack() ) {
		plugins.push(
			require( 'karma-browserstack-launcher' )
		);
	}

	return plugins;
}

function shouldEnableBrowserStack() {
	return (
		process.env.BROWSER_STACK_ACCESS_KEY &&
		process.env.BROWSER_STACK_ACCESS_KEY
	);
}
