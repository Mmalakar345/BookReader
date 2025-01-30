// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookName = urlParams.get('book');
    
    if (bookName) {
        loadPDF(bookName);
    }

    document.getElementById('prevPage').addEventListener('click', onPrevPage);
    document.getElementById('nextPage').addEventListener('click', onNextPage);
    document.getElementById('submitComment').addEventListener('click', addComment);
    document.getElementById('zoomIn').addEventListener('click', onZoomIn);
    document.getElementById('zoomOut').addEventListener('click', onZoomOut);
});

async function loadPDF(pdfName) {
    try {
        const loadingTask = pdfjsLib.getDocument(pdfName);
        pdfDoc = await loadingTask.promise;
        renderPage(pageNum);
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({scale: scale});
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const pdfContainer = document.getElementById('pdfContainer');
        pdfContainer.innerHTML = '';
        pdfContainer.appendChild(canvas);

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderContext).promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });

        document.getElementById('currentPage').textContent = `Page: ${num}`;
        updateZoomLevel(); // Update zoom level display
    });
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

function updateZoomLevel() {
    document.getElementById('zoomLevel').textContent = `Zoom: ${Math.round(scale * 100)}%`;
}

function onZoomIn() {
    if (scale >= 3.0) return; // Maximum zoom level
    scale += 0.25;
    updateZoomLevel();
    queueRenderPage(pageNum);
}

function onZoomOut() {
    if (scale <= 0.5) return; // Minimum zoom level
    scale -= 0.25;
    updateZoomLevel();
    queueRenderPage(pageNum);
}

// Comments functionality
function addComment() {
    const commentText = document.getElementById('commentText').value;
    if (!commentText.trim()) return;

    const commentsList = document.getElementById('commentsList');
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    
    const date = new Date().toLocaleDateString();
    commentDiv.innerHTML = `
        <p>${commentText}</p>
        <small>Posted on ${date}</small>
    `;
    
    commentsList.appendChild(commentDiv);
    document.getElementById('commentText').value = '';

    // In a real application, you would save this to a database
}
