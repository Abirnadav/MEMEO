'use strict'

// Render Filtered on Gallery
function renderFiltered(text) {
    var imgsShown = gImgs.filter(img => {
        var keywords = img.keywords
        var isInclude = keywords.find(keyword => keyword.startsWith(text.toLowerCase()))
        if (isInclude) return img
    })
    var strImg = ''
    imgsShown.map(function(img) {
        strImg += `<img onclick="onImgClicked(this) " class="galleryImg" id="${img.id}" src="${img.url}" alt="">`
    })
    var strHtmls = `<div class="img-container">` + strImg + `</div>`
    document.querySelector('.gallery-images').innerHTML = strHtmls
}
// Render My Memes
function renderMemes() {
    var imgs = gSavedMemes
    var strImg = ''
    imgs.map(function(img) {
        strImg += `<img onclick="onImgClicked(this) " class="galleryImg" id="4" src="${img.url}" alt="">`
    })
    var strHtmls = `<div class="img-container">` + strImg + `</div>`
    document.querySelector('.meme-images').innerHTML = strHtmls

}

// adds an Image to the dom
function renderImage(url) {
    var elContainer = document.querySelector('.img-container')
    elContainer.innerHTML += `<img onclick="onImgClicked(this) " class="galleryImg" src="${url}" alt="">`
}
// Handle data and call renderImage 
function addImagesFromServer(data) {
    console.log('OK i got your memes now ill render one sec..')
    for (var i = 0; i < data.files.length; i++)
        renderImage(data.files[i].url)
}
// Get Image From Server! waiting few seconds so let page load to evade Slow loading issues
setTimeout(getImagesFromServer, 4000)

// Fetch from my server
function getImagesFromServer() {
    fetch('http://77.125.57.19:4700/')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            addImagesFromServer(data)
            console.log(data)
        });
}