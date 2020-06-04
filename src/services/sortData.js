const swap=(items, leftIndex, rightIndex)=>{
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}
const partition=(items, left, right, val)=>{

    let obj = { ...items[right] }
    let pivot = obj[val]
    let i = left - 1; 
    for (let j = left; j < right; j++) {
        obj = { ...items[j] }
        if (obj[val] < pivot) {
            i += 1
            swap(items, i, j)
        }

    }
    swap(items, i + 1, right)
    return i + 1
}


const quickSort=(items, left, right, val)=>{
    return new Promise((resolve) => {
        let p;
        if (left < right) {
            p = partition(items, left, right, val); //index returned from partition
            quickSort(items, left, p - 1, val);
            quickSort(items, p + 1, right, val);

        }
        resolve(items)
    })
}
export default quickSort;