import random
import time

list_to_sort = list(range(50000))
random.Random().shuffle(list_to_sort)

def quicksort(messy_list):
    if (len(messy_list) < 2):
        return messy_list
    
    mess = messy_list[:]
    index = len(mess)/2
    pivot = mess[index]
    del mess[index]
    pre_pivot = []
    post_pivot = []
    
    for i, element in enumerate(mess):
        if element < pivot:
            pre_pivot.append(element)
        else:
            post_pivot.append(element)
    return quicksort(pre_pivot) + [pivot] + quicksort(post_pivot)

def mergesort(messy_list):
    if (len(messy_list) < 2):
        return messy_list
    
    mess = messy_list[:]
    messyleft = mergesort(mess[:len(mess)/2])
    messyright = mergesort(mess[len(mess)/2:])
    
    i = 0
    j = 0
    merged_list = []
    while i < len(messyleft) and j < len(messyright):
        if messyleft[i] < messyright[j]:
            merged_list.append(messyleft[i])
            i += 1
        else:
            merged_list.append(messyright[j])
            j += 1
    merged_list += messyleft[i:]
    merged_list += messyright[j:]
    return merged_list

def timedsort(function, argument):
    t0 = time.clock()
    function(argument)
    t1 = time.clock()
    print("{0} Took {1:.4f} seconds.".format(function, t1-t0))

timedsort(mergesort, list_to_sort)
timedsort(quicksort, list_to_sort)

