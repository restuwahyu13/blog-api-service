/**
 * Direction:
 * Remove key that have null or undefined value
 *
 * Expected Result:
 * [
 *   { session_name: 'first test', classes: [{ students: [{ student_name: 'budi' }] }] },
 *   { classes: [{ class_name: 'second class', students: [{ student_name: 'adi' }] }] },
 * ]
 */
const data = [
	{ session_name: 'first test', classes: [{ class_name: undefined, students: [{ student_name: 'budi' }] }] },
	{ session_name: null, classes: [{ class_name: 'second class', students: [{ student_name: 'adi' }] }] }
]

function result(data) {
	const newData = []

	data.forEach((val) => {
		if (val.session_name !== null) {
			const session = {
				session_name: val.session_name,
				classes: val.classes.map((val) => {
					return { students: val.students }
				})
			}
			newData.push(session)
		} else {
			const classes = { classes: val.classes }
			newData.push(classes)
		}
	})
	return newData
}

console.log(result(data))
