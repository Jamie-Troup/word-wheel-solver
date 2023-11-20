alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

let word_lists = {}

for (let i = 3; i < 10; i++) {
    const key = 'wl_' + i.toString()
    word_lists[key] = {}
    for (let j = 0; j < 26; j++) {
        const letter = alphabet[j]
        word_lists[key][letter] = []
    }
}

const xhttp = new XMLHttpRequest()

xhttp.onload = function() {
    text_response = this.responseText
    text_array = text_response.split('\n')
    text_array.forEach(word => {
        if (word) {
            if (!(word[0] === word[0].toUpperCase())) {
                const len = (word.length).toString()
                const start_letter = word[0]
                const key = 'wl_' + (word.length).toString()
                word_lists[key][start_letter].push(word.toLowerCase())
            }
        }
    })
}

xhttp.open('GET', 'processed_word_list.txt', false)
xhttp.send()

used_letters = []
middle_letter = null

async function solve() {
    loading(true)
    await delay(1)
    
    used_letters = get_used_letters()
    middle_letter = document.getElementById("mid_lett").value
    
    if (check_inputs()) {
        for (let i = 3; i < 10; i++) {
            const words = get_words(i)
            const output = document.getElementById("output_" + i.toString())
            output.innerText = words.join(", ")
        }
    }
    
    loading(false)
}

function loading(is_loading) {
    if (is_loading) {
        document.getElementById("solve_btn").disabled = true
        document.getElementById("wave_load").classList.remove("hide")
        document.getElementById("solve_btn").style.display = 'none' 
    } else {
        document.getElementById("solve_btn").disabled = false
        document.getElementById("wave_load").classList.add("hide")
        document.getElementById("solve_btn").style.display = 'block'
    }
}

function get_used_letters() {
    const input = document.getElementById("other_letts")
    const input_str = (input.value).replace(/\s/g, "")
    
    return input_str.split(",")
}

function check_inputs() {
    let err = false
    for (let i = 0; i < used_letters.length; i++) {
        let letter = used_letters[i]
        letter = letter.trim()
        if (letter.length > 1) {
            err = true
            break
        } else {
            if (!(typeof(letter) === 'string')) {
                err = true
                break
            }
        }
    }
    
    if (!(typeof(middle_letter) === 'string') || middle_letter.length > 1) {
        err = true
    }
    
    if (err === true) {
        return false
    } else {
        return true
    }
}

function get_words(letter_num) {
    const zero_strings = get_zero_strings(letter_num)
    let words = []
    
    for (let i = 0; i < zero_strings.length; i++) {
        make_words(zero_strings[i], words, used_letters)
    }
    
    return words
}

function get_zero_strings(letter_num) {
    let zero_strings = []
    const zero_string = '0'.repeat(letter_num)
    
    for (let i = 0; i < letter_num; i++) {
        let new_zero_string = zero_string
        new_zero_string = new_zero_string.substring(0, i) + middle_letter + new_zero_string.substring(i+1)
        zero_strings.push(new_zero_string)
    }
    
    return zero_strings
}

function make_words(zero_string, words, used_letters_temp) {
    if ((zero_string.split('0').length - 1) === 0) {
        if (!words.includes(zero_string)) {
            const start_letter = zero_string[0]
            const word_len = 'wl_' + (zero_string.length).toString()
            const word_list = word_lists[word_len][start_letter]

            if (binary_search(zero_string, word_list)) {
                words.push(zero_string)
                return
            } 
        }
    } else {
        const index = zero_string.indexOf('0')
        let new_zero_string = zero_string
        let new_used_letters = used_letters_temp.slice()
        
        for (let i = 0; i < used_letters_temp.length; i++) {
            new_zero_string = new_zero_string.substring(0, index) + used_letters_temp[i] + new_zero_string.substring(index + 1)
            
            if ((zero_string.split('0').length - 1) > 0) {
                new_used_letters.splice(i, 1)
            }
            
            make_words(new_zero_string, words, new_used_letters)
            new_used_letters = used_letters_temp.slice()
        }
    }
    
    return words
}

function binary_search(val, array) {
    if (array.length) {
        const middle_ind = Math.floor(array.length / 2)
        const middle_elem = array[middle_ind]
        if (val === middle_elem) {
            return true
        } else {
            if (array.length === 1) {
                return false
            } else {
                if (val > middle_elem) {
                    if ((middle_ind + 1) < array.length) {
                        return binary_search(val, array.slice(middle_ind+1, array.length))
                    } else {
                        return false
                    }
                } else {
                    return binary_search(val, array.slice(0, middle_ind))
                }
            }
        }
    } else {
        return false
    }
}

function delay(time) {
    return new Promise(res => setTimeout(res, time))
}
