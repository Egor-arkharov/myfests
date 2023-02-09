export const AMOUNT_HEADLINERS = 3;
export const AMOUNT_BANDS = 12;
export const AMOUNT_BANDS_MAX = 20;

const getRandomInt = (max) => Math.floor(Math.random() * max);

export function getMixedBands(genres, bands, amount) {
	let mixedBands = [];
	const genresWithoutMix = genres.filter((el) => el !== "Mix");

	while (mixedBands.length !== amount) {
		let randomGenre = genresWithoutMix[getRandomInt(genresWithoutMix.length)];

		let bandsFromRandomGenre = bands[randomGenre];

		let randomBand =
			bandsFromRandomGenre[getRandomInt(bandsFromRandomGenre.length)];

		mixedBands.push(randomBand);

		mixedBands = mixedBands.filter((el, i, arr) => arr.indexOf(el) === i);
	}

	return mixedBands;
}

export function getLineup(bands, headliners) {
	const subBands = bands.filter((el) => !headliners.includes(el));

	return {
		day1: {
			headliner: headliners[0],
			subBands: subBands.slice(0, 3),
		},
		day2: {
			headliner: headliners[1],
			subBands: subBands.slice(3, 6),
		},
		day3: {
			headliner: headliners[2],
			subBands: subBands.slice(6, 9),
		},
	};
}
