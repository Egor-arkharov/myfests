export const AMOUNT_HEADLINERS = 3;
export const AMOUNT_BANDS = 12;
export const AMOUNT_SUB_BANDS = AMOUNT_BANDS - AMOUNT_HEADLINERS;
export const AMOUNT_BANDS_MAX = 20;
export const AMOUNT_FONTS = 6;

export const getRandomInt = (max) => Math.floor(Math.random() * max);

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

export const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
};

export function getLineup(bands, headliners, allBands) {
	const subBands = bands.filter((el) => !headliners.includes(el));

	let helpNums = [];

	for (let i = 0; i < AMOUNT_FONTS; i++) {
		helpNums.push(i);
	}

	helpNums = shuffle(helpNums);
	helpNums = helpNums.concat(helpNums);

	const getHeadlinerFont = (arr, index) => {
		let headlinerObj = {};

		for (let value of Object.keys(allBands)) {
			if (allBands[value].includes(arr[index])) {
				headlinerObj["name"] = arr[index];
				headlinerObj["font"] = `font-${value.toLowerCase()}-${helpNums[0]}`;
				headlinerObj["decor"] = `decor-${helpNums[0]}`;

				helpNums.splice(0, 1);
			}
		}

		return headlinerObj;
	};

	const getSubBandFont = (arr) => {
		let newArr = [];

		arr.forEach((el, i) => {
			for (let value of Object.keys(allBands)) {
				if (allBands[value].includes(el)) {
					newArr.push({
						name: arr[i],
						font: `font-${value.toLowerCase()}-${helpNums[0]}`,
					});

					helpNums.splice(0, 1);
				}
			}
		});

		return newArr;
	};

	const lineup = {
		day1: {
			headliner: getHeadlinerFont(headliners, 0),
			subBands: getSubBandFont(subBands.slice(0, 3)),
		},
		day2: {
			headliner: getHeadlinerFont(headliners, 1),
			subBands: getSubBandFont(subBands.slice(3, 6)),
		},
		day3: {
			headliner: getHeadlinerFont(headliners, 2),
			subBands: getSubBandFont(subBands.slice(6, 9)),
		},
	};

	return lineup;
}
