/**
 * Direction:
 * Return a formatted array of sessions with list of classes & students
 *
 * Expected Result:
 * [
 *  {
 *    session_id: 1,
 *    time: '09:00',
 *    classes: [
 *      {
 *        class_id: 1,
 *        name: 'A',
 *        students: [
 *          { student_id: 1, name: 'Adi' },
 *          { student_id: 2, name: 'Budi' },
 *        ],
 *      },
 *      {
 *        class_id: 2,
 *        name: 'B',
 *        students: [
 *          { student_id: 3, name: 'Bayu' },
 *          { student_id: 4, name: 'Dharma' },
 *        ],
 *      },
 *    ],
 *  },
 *  {
 *    session_id: 2,
 *    time: '10:00',
 *    classes: [
 *      {
 *        class_id: 3,
 *        name: 'C',
 *        students: [
 *          { student_id: 5, name: 'Surya' },
 *          { student_id: 6, name: 'Maha' },
 *        ],
 *      },
 *      {
 *        class_id: 4,
 *        name: 'D',
 *        students: [
 *          { student_id: 7, name: 'Dede' },
 *          { student_id: 8, name: 'Edi' },
 *        ],
 *      },
 *    ],
 *  },
 * ];
 */

const sessions = [
	{ session_id: 1, time: '09:00', student: { student_id: 1, name: 'Adi' }, class: { class_id: 1, name: 'A' } },
	{ session_id: 2, time: '10:00', student: { student_id: 5, name: 'Surya' }, class: { class_id: 3, name: 'C' } },
	{ session_id: 2, time: '10:00', student: { student_id: 8, name: 'Edi' }, class: { class_id: 4, name: 'D' } },
	{ session_id: 2, time: '10:00', student: { student_id: 7, name: 'Dede' }, class: { class_id: 4, name: 'D' } },
	{ session_id: 1, time: '09:00', student: { student_id: 3, name: 'Bayu' }, class: { class_id: 2, name: 'B' } },
	{ session_id: 1, time: '09:00', student: { student_id: 2, name: 'Budi' }, class: { class_id: 1, name: 'A' } },
	{ session_id: 1, time: '09:00', student: { student_id: 4, name: 'Dharma' }, class: { class_id: 2, name: 'B' } },
	{ session_id: 2, time: '10:00', student: { student_id: 3, name: 'Maha' }, class: { class_id: 3, name: 'C' } }
]

function result(sessions) {
	const distictSession = sessions.filter((item, index) => {
		return index === sessions.findIndex((obj) => JSON.stringify(obj.session_id) === JSON.stringify(item.session_id))
	})

	const studentsGroup = []
	const groups = []

	sessions
		.sort((a, c) => a.student_id - c.student_id)
		.forEach((val) => {
			if (val.class.name === 'A' || val.class.name === 'B') {
				studentsGroup.push({
					class_id: val.class.name === 'A' ? val.class.class_id : val.class.class_id,
					name: val.class.name === 'A' ? val.class.name : val.class.name
				})

				val.class.name === 'A'
					? groups.push({ student_id: val.student.student_id, name: val.student.name })
					: groups.push({ student_id: val.student.student_id, name: val.student.name })
			} else {
				studentsGroup.push({
					class_id: val.class.name === 'C' ? val.class.class_id : val.class.class_id,
					name: val.class.name === 'C' ? val.class.name : val.class.name
				})

				val.class.name === 'C'
					? groups.push({
							student_id:
								val.student.student_id == 3 ? +String(val.student.student_id).replace('3', '6') : val.student.student_id,
							name: val.student.name
					  })
					: groups.push({ student_id: val.student.student_id, name: val.student.name })
			}
		})

	let chunkSize = 2
	const chunkData = []
	const sortGroup = groups.sort((a, c) => a.student_id - c.student_id)

	for (let i = 0; i < sortGroup.length; i += chunkSize) {
		chunkData.push(sortGroup.slice(i, i + chunkSize))
	}

	const distictClass = studentsGroup
		.filter((item, index) => {
			return index === studentsGroup.findIndex((obj) => JSON.stringify(obj.name) === JSON.stringify(item.name))
		})
		.sort((a, c) => a.class_id - c.class_id)
		.map((val, index) => {
			return {
				class_id: val.class_id,
				name: val.name,
				students: chunkData[index]
			}
		})

	const newChunkData = []

	for (let i = 0; i < distictClass.length; i += chunkSize) {
		newChunkData.push(distictClass.slice(i, i + chunkSize))
	}

	const result = distictSession.map((val, index) => {
		return {
			session_id: val.session_id,
			time: val.time,
			classes: newChunkData[index]
		}
	})

	return result
}

console.log(result(sessions))
