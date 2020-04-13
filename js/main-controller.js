'use strict'

var gIsGrabbed = false;
var aboutAudio = new Audio('sounds/about.mp3')
var gIsMobile = false;
var gCurrStickerEl
window.onload = (event) => {
    console.log('windows', window.innerWidth)
    if (window.innerWidth < 550) {
        gFont = 35
        gCanvas.width = '300'
        gCanvas.height = '300'
        gIsMobile = true;
        gY = 100
        gX = 150
    }
    onInit()
};

function renderTextBox(box) {
    var eventType = 'onmouseenter'
    if (gIsMobile) {
        eventType = 'ontouchmove'
    }
    var strHtmls = `
    <input ${eventType}="dragBox(event,this.id)" ontouchend="handleMobileClick()"
     class="text editor-input input-box focus-box" id="${box.id}" 
     type="text" placeholder="" oninput="setText(this.value)" value="">
`
    document.querySelector('.focus-box-container').innerHTML += strHtmls;
    var elBox = document.getElementById(`${box.id}`)
    elBox.style.top = box.y
    elBox.style.left = box.x
}

function getFocusBox(id) {
    for (var i = 0; i < gTextBoxs.length; i++) {
        var box = gTextBoxs[i]
        box.isFocus = false;
        if (box.id === id) {
            gCurrTextBox = gTextBoxs[i]
            gCurrTextBox.isFocus = true;

        }
    }
}
var touched = 0

function handleMobileClick() {
    if (touched > 0) {
        document.getElementById(`${gCurrTextBox.id}`).click()

    }
    touched++
    setTimeout(touchCountZero, 500)
}

function touchCountZero() {
    touched = 0
}

function dragBox(e, id) {
    if (gIsGrabbed) return
    e.stopPropagation()
    e.preventDefault()
    var idNum = +id
    getFocusBox(idNum)

    if (gIsMobile) {
        var input = document.getElementById(`${gCurrTextBox.id}`)


        input.addEventListener('touchmove', function(e) {

            gCurrTextBox.isFocus = true;

            var touchLocation = e.targetTouches[0];


            if ((touchLocation.pageX - 170) < -50 || (touchLocation.pageX - 170) > 95) {
                var outOfCanvasX = true;
            }
            if ((touchLocation.pageY + 10) < 170 || (touchLocation.pageY + 10) > 440) {
                var outOfCanvasY = true
            }
            if (!outOfCanvasX) {
                input.style.left = touchLocation.pageX - 90 + 'px';
                var inputPos = getPositionXY(input)
                gCurrTextBox.x = inputPos[0] + 40
            }
            if (!outOfCanvasY) {
                input.style.top = touchLocation.pageY - 40 + 'px';
                var inputPos = getPositionXY(input)
                gCurrTextBox.y = inputPos[1] - 90
            }
            setText(gCurrTextBox.text)
            if (gNumOfStickers > 0) onDrawSticker();
        })
        return;
    }
    var mousePosition;
    var offset = [-100, 0];
    var isDown = false;
    var input = document.getElementById(`${gCurrTextBox.id}`)

    input.addEventListener('mousedown', function(e) {
        gIsGrabbed = true;
        gCurrTextBox.isFocus = true;
        isDown = true;
        offset = [
            input.offsetLeft - e.clientX,
            input.offsetTop - e.clientY
        ];
    }, true);
    document.addEventListener('mouseup', function() {
        isDown = false;
        gIsGrabbed = false;
    }, true);
    document.addEventListener('mousemove', function(event) {
        gCurrTextBox.isFocus = true;
        if (isDown) {
            mousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            if (mousePosition.x + offset[0] < 10 || mousePosition.x + offset[0] > 440) {
                var outOfCanvasX = true;
            }

            if (mousePosition.y + offset[1] < 150 || mousePosition.y + offset[1] > 630) {
                var outOfCanvasY = true
            }
            if (!outOfCanvasX) {

                input.style.left = (mousePosition.x + offset[0]) + 'px';
                var inputPos = getPositionXY(input)

                gCurrTextBox.x = (inputPos[0] + 50)
            }
            if (!outOfCanvasY) {
                input.style.top = (mousePosition.y + offset[1]) + 'px';
                var inputPos = getPositionXY(input)
                gCurrTextBox.y = (inputPos[1] - 120)
            }
            setText(gCurrTextBox.text)
            onDrawSticker()
        }
    }, true);

}

function getPositionXY(element) {
    var rect = element.getBoundingClientRect();
    var xy = [rect.x, rect.y]
    return xy
}
// Init!
function onInit() {
    onGalleryInit()
    onLoadFromStorage()
    renderMemes()
    loadAndDrawImage('images/blank.jpg');
}
// On Gallery init
function onGalleryInit() {
    renderGallery()
}

// Render Gallery images!
function renderGallery() {
    var imgs = getImages()
    var strImg = ''
    imgs.map(function(img) {
        strImg += `<img onclick="onImgClicked(this) " class="galleryImg" id="${img.id}" src="${img.url}" alt="">`
    })
    var strHtmls = `<div class="img-container">` + strImg + `</div>`
    document.querySelector('.gallery-images').innerHTML = strHtmls
}
// On image clicked Go to Editor and Show image on canvas
function onImgClicked(img) {

    gCurrImage = img
    drawImg(img)
    if (gNumOfBoxs > 0) onDrawText()
    if (gNumOfStickers > 0) onDrawSticker()
    var create = document.querySelector('.create')
    openPage('create', create, '#7f8fa6')
}

// Load an image from a url and Draw!
function loadAndDrawImage(url) {
    var image = new Image();
    image.onload = function() {
        drawImg(image)
    }
    image.src = url;
    gCurrImage = image
}

// Opens File chooser
function onUpload(event) {
    var fileChooser = document.getElementById('fileChooser');
    var img = fileChooser.files[0]
    var imageURL = window.URL.createObjectURL(img);
    loadAndDrawImage(imageURL)
}

// Opens a targeted modal
function onToggleModal(modalName) {
    toggleModal(modalName)
}

function toggleModal(modalName) {
    var elModal = document.querySelector('.' + modalName)
    var elModalContainer = document.querySelector('#' + modalName)
    elModalContainer.classList.toggle('hide')
    elModal.classList.toggle('modal')
}

function onAbout() {
    aboutAudio.play()
}

function onLeaveAbout() {
    aboutAudio.pause()
}

// Text Functions
function onDeleteSticker() {
    var currIdx = 0
    gStickers.forEach(sticker => {
        if (gCurrSticker.id === sticker.id) {
            currIdx++
            sticker.isShown = false;
            var input = document.getElementById(`${gCurrSticker.id}`)
            input.remove();
            gCurrSticker = gStickers[currIdx - 1]
            clearCanvas()
            onDrawText()
            onDrawSticker()
        }
    })
}

function onDelete() {
    if (gNumOfBoxs === 0) return
    var currIdx = 0
    gTextBoxs.forEach(box => {
        if (gCurrTextBox.id === box.id) {
            currIdx++
            gCurrTextBox.isShown = false;
            gCurrTextBox.isFocus = false;
            gNumOfBoxs--
            var input = document.getElementById(`${gCurrTextBox.id}`)
            input.remove();
            clearCanvas()
            onDrawText()
        }
    })
    gCurrTextBox = gTextBoxs[currIdx - 1]
    gCurrTextBox.isFocus = true;
    clearCanvas()
    onDrawText()
}

function onChangeStickerSize(x, y) {

    gCurrSticker.zoomX += x
    gCurrSticker.zoomY += y
    gCurrStickerEl.style.height = `${gCurrSticker.zoomY  + 100}px`
    gCurrStickerEl.style.width = `${gCurrSticker.zoomX + 100}px`

    clearCanvas()
    drawImg(gCurrImage)
    onDrawSticker()

}
// Navbar 

function openPage(pageName, el, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    el.style.backgroundColor = color;
}
document.getElementById("defaultOpen").click();

// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`)
        onToggleModal('modal-share')
    }
    doUploadImg(elForm, onSuccess);
}

function shareWhatsApp(elForm, ev) {
    ev.preventDefault()

    function onSuccess(uploadedImgUrl) {
        document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");
        window.location = 'whatsapp://send?text=' + encodeURIComponent(uploadedImgUrl);
        onToggleModal('modal-share')
    }
    doUploadImg(elForm, onSuccess)
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(function(res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function(err) {
            console.error(err)
        })
}

function toggleSaveModal() {
    var elSavedModal = document.querySelector('.save-modal')
    elSavedModal.classList.toggle('hide')
}

function toggleSignModal() {
    var elSavedModal = document.querySelector('.sign-up-modal')
    elSavedModal.classList.toggle('hide')
}

function onSignup() {
    toggleSignModal()

}

function onSaveImg() {
    gIsSave = true;
    toggleSaveModal()
    saveImg()
    renderMemes()
    drawImg(gCurrImage)
    onDrawText()
    onDrawSticker()
    gIsSave = false;
}

// storage 
function onSaveToStorage() {
    var data = gCanvas.toDataURL()
    saveImg(data)
}

function onLoadFromStorage() {
    gSavedMemes = loadFromStorage(keyMemes)
    if (!gSavedMemes) {
        gSavedMemes = [{
            id: 17,
            url: 'meme-imgs/17.jpg',
            keywords: ['politic', 'putin', 'funny']
        }, {
            id: 19,
            url: 'meme-imgs/19.png',
            keywords: ['nevo']
        }]
    }
}

function onAddTextBox() {
    clearCanvas()
    createTextObj()
    if (gNumOfStickers > 0) onDrawSticker();
    onDrawText()
    onDrawSticker()
}

function dragSticker(e, id) {
    if (gIsGrabbed) return
    e.stopPropagation()
    e.preventDefault()
    getStickerId(id)
    setCurrStickerEl()
    if (gIsMobile) {
        gCurrStickerEl.addEventListener('touchmove', function(e) {
            gCurrSticker.isFocus = true;
            var touchLocation = e.targetTouches[0];
            if ((touchLocation.pageX - 170) < -50 || (touchLocation.pageX - 170) > 95) {
                var outOfCanvasX = true;
            }
            if ((touchLocation.pageY + 10) < 170 || (touchLocation.pageY + 10) > 440) {
                var outOfCanvasY = true
            }
            if (!outOfCanvasX) {
                gCurrStickerEl.style.left = touchLocation.pageX - 90 + 'px';
                var gCurrStickerElPos = getPositionXY(gCurrStickerEl)
                gCurrSticker.x = gCurrStickerElPos[0] - 30
            }
            if (!outOfCanvasY) {
                gCurrStickerEl.style.top = touchLocation.pageY - 40 + 'px';
                var gCurrStickerElPos = getPositionXY(gCurrStickerEl)
                gCurrSticker.y = gCurrStickerElPos[1] - 90
            }
            clearCanvas()
            drawImg(gCurrImage)
            if (gNumOfBoxs > 0) setText(gCurrTextBox.text);
            onDrawSticker()
        })
        return;
    }
    var mousePosition;
    var offset = [-100, 0];
    var isDown = false;
    gCurrStickerEl.addEventListener('mousedown', function(e) {
        gIsGrabbed = true;
        gCurrSticker.isFocus = true;
        isDown = true;
        offset = [
            gCurrStickerEl.offsetLeft - e.clientX,
            gCurrStickerEl.offsetTop - e.clientY
        ];
    }, true);
    document.addEventListener('mouseup', function() {
        isDown = false;
        gIsGrabbed = false;
    }, true);
    document.addEventListener('mousemove', function(event) {
        console.log(' event', event)
        gCurrSticker.isFocus = true;
        if (isDown) {
            mousePosition = {
                x: event.clientX,
                y: event.clientY
            };
            if (mousePosition.x + offset[0] < 10 || mousePosition.x + offset[0] > 440) {
                var outOfCanvasX = true;
            }
            if (mousePosition.y + offset[1] < 150 || mousePosition.y + offset[1] > 630) {
                var outOfCanvasY = true
            }
            if (!outOfCanvasX) {
                gCurrStickerEl.style.left = (mousePosition.x + offset[0] - gCurrSticker.zoomX) + 'px';
                var gCurrStickerElPos = getPositionXY(gCurrStickerEl)
                gCurrSticker.x = (gCurrStickerElPos[0] - 80)
            }
            if (!outOfCanvasY) {
                gCurrStickerEl.style.top = (mousePosition.y + offset[1]) + 'px';
                var gCurrStickerElPos = getPositionXY(gCurrStickerEl)
                gCurrSticker.y = (gCurrStickerElPos[1] - 185)
            }
            clearCanvas()
            drawImg(gCurrImage)
            if (gNumOfBoxs > 0) setText(gCurrTextBox.text);
            onDrawSticker()
            console.log('gere', gCurrSticker)
        }
    }, true);
}

function onShare() {
    onToggleModal('modal-share')
}

function setCurrStickerEl() {
    gCurrStickerEl = document.getElementById(`${gCurrSticker.id}`)
}

var gCarouselLocation = 0
    // Still not working !
function onMoveCarousel(num) {
    var stickerAnim = document.querySelector('.stickers-container')
    stickerAnim.style.transform = `translateX(${gCarouselLocation += num});`;
}