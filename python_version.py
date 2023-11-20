import random
import re
import math
import os
import time
        
def get_words(letter_num):
    zero_strings = get_zero_strings(letter_num)
    words = []
    
    for x in zero_strings:
        make_words(x, words, used_letters)

    return words
        
def get_zero_strings(letter_num):
    zero_strings = []
    zero_string = '0' * letter_num
    
    for x in range(0, letter_num):
        new_zero_string = zero_string
        new_zero_string = list(new_zero_string)
        new_zero_string[x] = middle_letter
        new_zero_string = ''.join(new_zero_string)
        zero_strings.append(new_zero_string)
    
    return zero_strings

def make_words(zero_string, word_store, temp_used_letters):
    if (zero_string.count('0') == 0):
        if (zero_string not in word_store):
            start_letter = zero_string[0]
            word_list = word_lists['wl_'+str(len(zero_string))][start_letter]
            if (binary_search(zero_string, word_list)):
                word_store.append(zero_string)
                return
    else:
        index = zero_string.find('0')
        new_zero_string = zero_string
        new_used_letters = []
        new_used_letters.extend(temp_used_letters)
        
        for x in range (0, len(temp_used_letters)):
            new_zero_string = list(new_zero_string)
            new_zero_string[index] = temp_used_letters[x]
            
            if (new_zero_string.count('0') > 0):
                new_used_letters.pop(x)
                
            new_zero_string = ''.join(new_zero_string)
            
            make_words(new_zero_string, word_store, new_used_letters)
            
            new_used_letters = []
            new_used_letters.extend(temp_used_letters)
         
    return word_store
    
def binary_search(val, array):
    if (len(array)):
        middle_ind = math.floor(len(array) / 2)
        middle_elem = array[middle_ind]
        
        if (val == middle_elem):
            return True
        else:
            if (len(array) == 1):
                return False
            else: 
                if ((val > middle_elem)):
                    if ((middle_ind + 1) < len(array)):
                        return binary_search(val, array[middle_ind+1:])
                    else:
                        return False
                else:
                    return binary_search(val, array[0:middle_ind])
    else:
        return False
    
alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

word_lists = {}
for i in range(3, 10):
    word_lists['wl_'+str(i)] = {}
    for j in range(0, 26):
        word_lists['wl_'+str(i)][alphabet[j]] = []
    
word_list_filepath = '/usr/share/dict/american-english'
our_word_list_fp = 'processed_word_list.txt'

if (os.path.isfile(our_word_list_fp)):
    with open(our_word_list_fp, 'r', encoding='utf-8') as f:
        lines = f.read().splitlines()
        for line in lines:
            word_len = str(len(line))
            start_letter = line[0].lower()
            word_lists['wl_'+word_len][start_letter].append(line)
else:
    with open(word_list_filepath, 'r', encoding='utf-8') as f:
        with open('processed_word_list.txt', 'w') as output:
            lines = f.read().splitlines()
            for line in lines:
                if ('\'' not in line):
                    if ((len(line) > 2) and (len(line) < 10)):
                        line = line.rstrip()
                        if (bool(re.search('^[a-zA-Z]+$', line))):
                            output.write(line + '\n')
    print('word list made, rerun programme')
    quit()

used_letters = ['m', 'm', 'a', 'i', 'e', 'f', 'a', 'r']
middle_letter = 'n'

print('\nMiddle letter: %s Other Letters: %s'%(middle_letter, ' '.join(used_letters)))

for x in range(3, 10):
    start_time = time.perf_counter()
    words = get_words(x)
    end_time = time.perf_counter()
    print('\nNumber of %d letter words: %d'%(x, len(words)))
    for x in words:
        print(x)
    print('Calculated in %f seconds'%(end_time - start_time))
print()
