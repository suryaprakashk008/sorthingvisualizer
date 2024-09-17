const canvas = document.getElementById('sortCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let arr = [];
let barWidth = width / 100;  
let delay = 30;  
let isSorting = false; 


const WHITE = 'white';
const RED = 'red';
const LIGHT_GREEN = 'lightgreen';


function initArray(size) {
    arr = Array.from({ length: size }, () => Math.floor(Math.random() * height));
    barWidth = width / size;
    drawArray(arr, WHITE);
}


function drawArray(array, color) {
    ctx.clearRect(0, 0, width, height);  
    array.forEach((value, index) => {
        ctx.fillStyle = color;
        ctx.fillRect(index * barWidth, height - value, barWidth, value);
    });
}


function drawArrayWithColors(array, colors) {
    ctx.clearRect(0, 0, width, height);
    array.forEach((value, index) => {
        ctx.fillStyle = colors[index];
        ctx.fillRect(index * barWidth, height - value, barWidth, value);
    });
}


function startSorting(algorithm) {
    if (isSorting) return;  
    isSorting = true;

    switch (algorithm) {
        case 'bubble':
            bubbleSort(arr);
            break;
        case 'selection':
            selectionSort(arr);
            break;
        case 'insertion':
            insertionSort(arr);
            break;
        case 'quick':
            quickSort(arr, 0, arr.length - 1);
            break;
        case 'merge':
            mergeSort(arr, 0, arr.length - 1);
            break;
        case 'radix':
            radixSort(arr);
            break;
    }
}

async function bubbleSort(array) {
    let colors = new Array(array.length).fill(WHITE);
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            colors[j] = RED;
            colors[j + 1] = RED;
            drawArrayWithColors(array, colors);
            await sleep(delay);
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
            colors[j] = WHITE;
            colors[j + 1] = WHITE;
        }
        colors[array.length - i - 1] = LIGHT_GREEN;
        drawArrayWithColors(array, colors);
    }
    colors[0] = LIGHT_GREEN;
    drawArrayWithColors(array, colors);
    isSorting = false;  
}


async function selectionSort(array) {
    let colors = new Array(array.length).fill(WHITE);
    for (let i = 0; i < array.length - 1; i++) {
        let minIdx = i;
        colors[i] = RED;
        drawArrayWithColors(array, colors);
        await sleep(delay);
        for (let j = i + 1; j < array.length; j++) {
            colors[j] = RED;
            drawArrayWithColors(array, colors);
            await sleep(delay);
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
            colors[j] = WHITE;
        }
        [array[i], array[minIdx]] = [array[minIdx], array[i]];
        colors[i] = LIGHT_GREEN;
        drawArrayWithColors(array, colors);
    }
    colors[array.length - 1] = LIGHT_GREEN;
    drawArrayWithColors(array, colors);
    isSorting = false;  
}


async function insertionSort(array) {
    let colors = new Array(array.length).fill(WHITE);
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        colors[i] = RED;
        drawArrayWithColors(array, colors);
        await sleep(delay);
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            colors[j] = RED;
            drawArrayWithColors(array, colors);
            await sleep(delay);
            colors[j] = WHITE;
            j--;
        }
        array[j + 1] = key;
        colors[i] = LIGHT_GREEN;
        drawArrayWithColors(array, colors);
    }
    colors[0] = LIGHT_GREEN;
    drawArrayWithColors(array, colors);
    isSorting = false;  
}


async function quickSort(array, low, high) {
    if (low < high) {
        let pivot = await partition(array, low, high);
        await quickSort(array, low, pivot - 1);
        await quickSort(array, pivot + 1, high);
    } else if (low === high) {
        
        let colors = new Array(array.length).fill(WHITE);
        colors[low] = LIGHT_GREEN;
        drawArrayWithColors(array, colors);
    }
    if (low >= high) {
        isSorting = false;  
    }
}

async function partition(array, low, high) {
    let pivot = array[high];
    let i = low - 1;
    let colors = new Array(array.length).fill(WHITE);
    colors[high] = RED;
    for (let j = low; j < high; j++) {
        colors[j] = RED;
        drawArrayWithColors(array, colors);
        await sleep(delay);
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            colors[i] = RED;
            drawArrayWithColors(array, colors);
            await sleep(delay);
        }
        colors[j] = WHITE;
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    colors[high] = LIGHT_GREEN;
    colors[i + 1] = LIGHT_GREEN;
    drawArrayWithColors(array, colors);
    return i + 1;
}


async function mergeSort(array, left, right) {
    if (left >= right) return;
    let mid = Math.floor((left + right) / 2);
    await mergeSort(array, left, mid);
    await mergeSort(array, mid + 1, right);
    await merge(array, left, mid, right);
}

async function merge(array, left, mid, right) {
    let n1 = mid - left + 1;
    let n2 = right - mid;
    let leftArr = array.slice(left, mid + 1);
    let rightArr = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    let colors = new Array(array.length).fill(WHITE);
    while (i < n1 && j < n2) {
        colors[k] = RED;
        drawArrayWithColors(array, colors);
        await sleep(delay);
        if (leftArr[i] <= rightArr[j]) {
            array[k] = leftArr[i];
            i++;
        } else {
            array[k] = rightArr[j];
            j++;
        }
        colors[k] = LIGHT_GREEN;
        drawArrayWithColors(array, colors);
        k++;
    }
    while (i < n1) {
        array[k] = leftArr[i];
        colors[k] = LIGHT_GREEN;
        drawArrayWithColors(array, colors);
        await sleep(delay);
        i++;
        k++;
    }
    while (j < n2) {
        array[k] = rightArr[j];
        colors[k] = LIGHT_GREEN;
        drawArrayWithColors(array, colors);
        await sleep(delay);
        j++;
        k++;
    }
}


async function radixSort(array) {
    let max = Math.max(...array);
    let exp = 1;
    let colors = new Array(array.length).fill(WHITE);
    while (Math.floor(max / exp) > 0) {
        await countingSort(array, exp, colors);
        exp *= 10;
    }
    
    colors.fill(LIGHT_GREEN);
    drawArrayWithColors(array, colors);
}

async function countingSort(array, exp, colors) {
    let output = new Array(array.length).fill(0);
    let count = new Array(10).fill(0);
    for (let i = 0; i < array.length; i++) {
        let index = Math.floor(array[i] / exp) % 10;
        count[index]++;
    }
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    for (let i = array.length - 1; i >= 0; i--) {
        let index = Math.floor(array[i] / exp) % 10;
        output[count[index] - 1] = array[i];
        count[index]--;
    }
    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        colors[i] = RED;
        drawArrayWithColors(array, colors);
        await sleep(delay);
        colors[i] = LIGHT_GREEN;
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function resizeArray(size) {
    initArray(size);
}


function adjustSpeed(newSpeed) {
    delay = newSpeed;
}


window.onload = () => {
    initArray(100);  
};
