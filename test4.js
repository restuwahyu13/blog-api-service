/**
 * Direction:
 * Find missing number from the list
 *
 * Expected Result:
 * 8
 */
const numbers = [9, 6, 4, 2, 3, 5, 7, 0, 1]

function result(numbers) {
	// Your Code Here
	let int = 0
	for (let i = 0; i <= numbers.length; i++) {
		if (numbers.includes(i) !== true) {
			int = i
			break
		}
	}
	return int
}

console.log(result(numbers))
