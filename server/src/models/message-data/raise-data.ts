export interface RaiseData {
	amount: number
}

export function parseRaiseData(object: any): RaiseData {
	if (
		typeof object.amount === 'number'
	)
		return object as RaiseData;
	else
		return null;
}
