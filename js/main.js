document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('searchBox');
    const searchBtn = document.getElementById('searchBtn');
    const cancelSearchBtn = document.getElementById('cancelSearchBtn');
    const bookCards = document.querySelectorAll('.book-card');

    function performSearch() {
        const searchTerm = searchBox.value.toLowerCase().trim();
        let hasResults = false;

        bookCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const author = card.querySelector('.author').textContent.toLowerCase();
            
            if (searchTerm === '' || title.includes(searchTerm) || author.includes(searchTerm)) {
                card.classList.remove('hidden');
                hasResults = true;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/hide cancel button based on search term
        if (searchTerm !== '') {
            cancelSearchBtn.classList.remove('hidden');
        } else {
            cancelSearchBtn.classList.add('hidden');
        }

        // Add animation to visible cards
        const visibleCards = document.querySelectorAll('.book-card:not(.hidden)');
        visibleCards.forEach((card, index) => {
            card.style.animation = `fadeIn 0.3s ease forwards ${index * 0.1}s`;
        });
    }

    function clearSearch() {
        searchBox.value = '';
        cancelSearchBtn.classList.add('hidden');
        bookCards.forEach(card => {
            card.classList.remove('hidden');
            card.style.animation = 'fadeIn 0.3s ease forwards';
        });
        searchBox.focus();
    }

    // Event listeners
    searchBtn.addEventListener('click', performSearch);
    cancelSearchBtn.addEventListener('click', clearSearch);
    
    // Perform search on enter key
    searchBox.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
        // Show/hide cancel button based on input
        if (this.value.trim() !== '') {
            cancelSearchBtn.classList.remove('hidden');
        } else {
            cancelSearchBtn.classList.add('hidden');
        }
    });
});

function openBook(pdfName) {
    window.location.href = `reader.html?book=${pdfName}`;
}
