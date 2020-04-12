'use strict'
var gStickerId = 1000
var gId = 100
var gY = 150
var gX = 250
var gNumOfBoxs = 0
var gNumOfStickers = 0
var gCurrImage = 'images/blank.jpg'
var gCanvas = document.querySelector('#canvas')
var gCtx = gCanvas.getContext('2d')
var gTextBoxs = []
var gCurrTextBox
var keyMemes = 'Memes'
var gSavedMemes
var gFont = 50
var gIsSave = false;
var gStickers = []
var gKeywords = {
    'cat': 2,
    'celebrity': 7,
    'politic': 2,
    'movie': 4,
    'animal': 1,
    'baby': 1,
    'happy': 12,
    'tv': 7,
    'books': 0,
    'sport': 2,
    'comics': 6,
    'funny': 1,
    'cute': 12,
    'love': 7,
    'kid': 12,
    'dog': 2,
    'nevo': 1,
}

var gImgs = [{
    id: 1,
    url: 'meme-imgs/1.jpg',
    keywords: ['politic', 'tramp', 'funny']
}, {
    id: 2,
    url: 'meme-imgs/2.jpg',
    keywords: ['happy', 'cute', 'love', 'dog', 'animal']
}, {
    id: 3,
    url: 'meme-imgs/3.jpg',
    keywords: ['happy', 'cute', 'love', 'dog', 'baby', 'animal', 'kid']
}, {
    id: 4,
    url: 'meme-imgs/4.jpg',
    keywords: ['happy', 'cute', 'cat', 'baby', 'animal', 'kid']
}, {
    id: 5,
    url: 'meme-imgs/5.jpg',
    keywords: ['happy', 'baby', 'funny', 'kid']
}, {
    id: 6,
    url: 'meme-imgs/6.jpg',
    keywords: ['movie', 'tv', 'celebrity']
}, {
    id: 7,
    url: 'meme-imgs/7.jpg',
    keywords: ['happy', 'baby', 'funny', 'kid']
}, {
    id: 8,
    url: 'meme-imgs/8.jpg',
    keywords: ['movie', 'celebrity']
}, {
    id: 9,
    url: 'meme-imgs/9.jpg',
    keywords: ['happy', 'baby', 'funny', 'evil', 'kid']
}, {
    id: 10,
    url: 'meme-imgs/10.jpg',
    keywords: ['politic', 'obama', 'funny']
}, {
    id: 11,
    url: 'meme-imgs/11.jpg',
    keywords: ['sport']
}, {
    id: 12,
    url: 'meme-imgs/12.jpg',
    keywords: ['honesty', 'justice']
}, {
    id: 13,
    url: 'meme-imgs/13.jpg',
    keywords: ['movie', 'celebrity']
}, {
    id: 14,
    url: 'meme-imgs/14.jpg',
    keywords: ['movie', 'celebrity']
}, {
    id: 15,
    url: 'meme-imgs/15.jpg',
    keywords: ['movie', 'celebrity']
}, {
    id: 16,
    url: 'meme-imgs/16.jpg',
    keywords: ['movie', 'celebrity']
}, {
    id: 17,
    url: 'meme-imgs/17.jpg',
    keywords: ['politic', 'putin', 'funny']
}, {
    id: 18,
    url: 'meme-imgs/18.jpg',
    keywords: ['movie', 'cartoon']
}, {
    id: 19,
    url: 'meme-imgs/19.png',
    keywords: ['nevo', 'funny']
}]



function createTextObj() {

    var textObject = {
        id: ++gId,
        num: gNumOfBoxs++,
        text: 'Your Text!',
        fontSize: gFont,
        textColor: '#f5f6fa',
        fillColor: 'black',
        color: '#00a8ff',
        isFocus: true,
        x: gX,
        y: gY,
        userFont: false,
        isShown: true,
    }
    gId += 1
    gTextBoxs.push(textObject)

    gCurrTextBox = gTextBoxs[textObject.num]
    gY + 50

    renderTextBox(gCurrTextBox)
    getFocusBox(textObject.id)
    onDrawText()
}

function getImages() {
    return gImgs
}

// Font Text Functions!
function setText(text) {
    var input = document.getElementById(`${gCurrTextBox.id}`)
    input.style.width = ((input.value.length + 1) * gCurrTextBox.fontSize) + 'px'
    input.style.fontSize = gCurrTextBox.fontSize + 'px'
    gCurrTextBox.text = text
    onDrawText()
    if (gNumOfStickers > 0) onDrawSticker();
}

function setTextColor(color) {
    gCurrTextBox.textColor = color
    setText(gCurrTextBox.text)
}

function setFillColor(color) {
    gCurrTextBox.fillColor = color
}

function setFontSize(num) {
    gCurrTextBox.userFont = true;
    if (gCurrTextBox.fontSize === 76 || gCurrTextBox.fontSize === 22) {
        onDrawText()
        return;
    }
    gCurrTextBox.fontSize += num;
    onDrawText()
}

function onDrawText() {
    clearCanvas()
    drawImg(gCurrImage)
    gTextBoxs.forEach(box => {
        if (box.isShown) {
            drawText(box.text, box.x, box.y, box)
        }
    })
}

function drawRect(text, x, y) {
    var textWidth = gCtx.measureText(text);
    textWidth.width;
    gCtx.beginPath();
    gCtx.rect(x - textWidth.width / 1.5, y - gCurrTextBox.fontSize - 20, textWidth.width + 100, 100);
    gCtx.stroke();
}

function drawText(text, x, y, box) {
    if (box.isFocus && box.isShown && !gIsSave) {
        drawRect(text, x, y)
    }

    gCtx.font = `${gCurrTextBox.fontSize}px verdana`;
    gCtx.shadowColor = gCurrTextBox.textColor;
    gCtx.shadowBlur = 7;
    gCtx.lineWidth = 1;
    gCtx.shadowBlur = 0;
    gCtx.fillStyle = gCurrTextBox.textColor;
    gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

// canvas Functions
function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}
var gCurrSticker
    // CLEAR CANVAS
function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}
// Stickers
function createStickerObj(url) {
    console.log('createSticker url', url)
    var image = loadSticker(url)
    var stickerObject = {
        id: gStickerId++,
        num: gNumOfStickers++,
        isShown: true,
        x: 100,
        y: 100,
        url: url,
        image: image,
    }
    gStickers.push(stickerObject)
    gCurrSticker = gStickers[stickerObject.num]
    renderSticker()
    onDrawSticker()

}

function getStickerId(id) {
    gStickers.forEach(sticker => {
        if (sticker.id === +id) {
            gCurrSticker = sticker
        }
    })
}

function onAddSticker(img) {
    console.log('immm here img ', img)
    createStickerObj(img)
}

function onDrawSticker() {
    gStickers.forEach(sticker => {

        if (sticker.isShown) {
            drawSticker(sticker.image, sticker.x, sticker.y)
        }


    })
}

function loadSticker(img) {
    var image = new Image();
    image.src = img;
    image.onload = function() {
        getStickerId(gCurrSticker.id)
        console.log('Loaded', image)
    }
    return image
}

function renderSticker() {
    var eventType = 'onmouseenter'
    if (gIsMobile) {
        eventType = 'ontouchmove'
    }
    var strHtmls = `
    <input ${eventType}="dragSticker(event,this.id)"
     id="${gCurrSticker.id}" class="sticker-box" type="image" src="${gCurrSticker.url}" draggable="false" />
`
    document.querySelector('.focus-box-container').innerHTML += strHtmls;

}


function drawSticker(sticker, x, y) {

    gCtx.drawImage(sticker, x, y, sticker.width, sticker.height)

}

// Draw image on canvas 
function drawImg(img) {
    if (gIsMobile) {
        var offSet = [img.height * 3.35, img.width * 3.35]
    } else {
        var offSet = [img.height * 2.8, img.width * 2.8]
    }
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}

function onDownloadCanvas() {
    const data = gCanvas.toDataURL()
    var elLink = document.querySelector('#btn-download')
    elLink.href = data
    elLink.download = 'Img'
}
//Storage
function saveImg() {
    setTimeout(toggleSaveModal, 2000)
    var canvas = document.getElementById('canvas');
    var imageData = canvas.toDataURL();
    var image = {
        id: 1,
        url: imageData,
        keywords: ['politic', 'tramp', 'funny']
    };
    console.log('image', image)
    gSavedMemes.unshift(image)
    saveToStorage(keyMemes, gSavedMemes)
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}