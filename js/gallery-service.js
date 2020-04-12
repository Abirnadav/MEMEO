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