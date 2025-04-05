// Event Delegation for Image Modals
document.addEventListener('click', function(event) {
    if (event.target.matches('.work-sample-item button')) {
        const button = event.target;
        const containerId = button.dataset.target;
        const container = document.getElementById(containerId);

        if (!container) return;

        container.classList.toggle('expanded');

        if (container.classList.contains('expanded')) {
            const closeButton = document.createElement('button');
            closeButton.classList.add('close-button');
            closeButton.textContent = 'X';
            closeButton.setAttribute('aria-label', 'Close Image');
            closeButton.addEventListener('click', (closeEvent) => {
                closeEvent.stopPropagation();
                container.classList.remove('expanded');
                closeButton.remove();
                document.body.style.pointerEvents = '';
            });
            container.appendChild(closeButton);
            document.body.style.pointerEvents = 'none';
            container.style.pointerEvents = 'auto';
        } else {
            const closeButton = container.querySelector('.close-button');
            if (closeButton) closeButton.remove();
            document.body.style.pointerEvents = '';
        }
    }
});

// Modal Background Click to Close
document.getElementById('pdfModal').addEventListener('click', function(event) {
    if (event.target === this) closeModal();
});

// Progress Bar
function updateProgressBar() {
    const scrollPosition = window.scrollY || window.pageYOffset;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollPosition / totalHeight) * 100;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateProgressBar);
window.addEventListener('load', updateProgressBar);
window.addEventListener('resize', updateProgressBar);

// Section Visibility
const sections = document.querySelectorAll('.content-section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// PDF Modal Functions
function openModal(pdfPath) {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfIframe');

    console.log('Opening PDF:', pdfPath);
    iframe.src = `${pdfPath}#toolbar=0&navpanes=0`;
    modal.style.display = 'block';

    iframe.onload = function() {
        console.log('PDF iframe loaded successfully');
        try {
            const contentHeight = iframe.contentWindow.document.body.scrollHeight;
            console.log('PDF content height:', contentHeight);
            if (contentHeight && contentHeight > 0) {
                // Cap the height at 90vh to avoid overflowing the modal
                const maxHeight = window.innerHeight * 0.9;
                iframe.style.height = `${Math.min(contentHeight, maxHeight)}px`;
                console.log('Set iframe height to:', iframe.style.height);
            } else {
                console.log('Invalid height detected, using fallback');
                iframe.style.height = '80vh';
            }
        } catch (e) {
            console.error('Height adjustment failed:', e.message);
            iframe.style.height = '80vh';
        }
    };

    // Initial height in case onload doesn't fire immediately
    iframe.style.height = '80vh';
}

function closeModal() {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfIframe');
    modal.style.display = 'none';
    iframe.src = '';
    iframe.style.height = '';
}