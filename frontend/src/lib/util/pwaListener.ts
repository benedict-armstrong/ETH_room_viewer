const fireTracking = (label) => {
	//Fire tracking here
	console.log(label);
};

export const pwaTrackingListeners = (): void => {
	const fireAddToHomeScreenImpression = (event) => {
		fireTracking('Add to home screen shown');
		//will not work for chrome, until fixed
		event.userChoice.then((choiceResult) => {
			fireTracking(`User clicked ${choiceResult}`);
		});
		//This is to prevent `beforeinstallprompt` event that triggers again on `Add` or `Cancel` click
		window.removeEventListener('beforeinstallprompt', fireAddToHomeScreenImpression);
	};
	window.addEventListener('beforeinstallprompt', fireAddToHomeScreenImpression);

	//Track web app install by user
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	window.addEventListener('appinstalled', (_e) => {
		fireTracking('PWA app installed by user!!! Hurray');
	});

	//Track from where your web app has been opened/browsed
	window.addEventListener('load', () => {
		let trackText;
		if (matchMedia('(display-mode: standalone)').matches) {
			trackText = 'Launched: Installed';
		} else {
			trackText = 'Launched: Browser Tab';
		}
		fireTracking(trackText);
	});
};
