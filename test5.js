/**
 * Direction:
 * Find prefix of the word from array of string
 *
 * Expected Result:
 * fl
 */
const words = ['flower', 'flow', 'flight'];

function result(words) {
   return words.join('').replace(/[^fl]/gi, '').substr(0, 2)
}

console.log(result(words));
