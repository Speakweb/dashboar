// I wrote this but never tested it, I should at some point
export const consumePaginated = async <T>({
										fetchFunction,
										interval
}: {fetchFunction: (n: number) => Promise<T[]>, interval: number}): Promise<T[]> => {
	let n = 0;
	const allResults = [];
	let fetchedResults: T[] | undefined;
	while(fetchedResults = await fetchFunction(n)) {
		if (!fetchedResults?.length) {
			break;
		}
		allResults.push(...fetchedResults)
		n += interval;
	}
	return fetchedResults;
}
