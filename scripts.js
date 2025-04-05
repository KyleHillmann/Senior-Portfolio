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
async function openModal(pdfPath) {  // Ensure async is here
    const modal = document.getElementById('pdfModal');
    const canvas = document.getElementById('pdfCanvas');
    const context = canvas.getContext('2d');

    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    console.log('Opening PDF:', pdfPath);
    modal.style.display = 'block';

    try {
        // Load the PDF
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;
        console.log('PDF loaded successfully, pages:', pdf.numPages);

        // Calculate total height and width based on page dimensions
        let totalHeight = 0;
        let maxWidth = 0; // New variable for maximum width
        const scale = 4.0; // Increased scale for better quality

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            totalHeight += viewport.height;
            maxWidth = Math.max(maxWidth, viewport.width); // Update maxWidth
        }
        console.log('Total PDF height:', totalHeight);
        console.log('Maximum PDF width:', maxWidth); // Log the maximum width

        // Set canvas dimensions
        canvas.width = maxWidth; // Set width to maximum width
        canvas.height = totalHeight;
        canvas.style.width = '100%'; // Responsive width
        canvas.style.height = `${totalHeight}px`;

        // Cap the modal height
        const maxHeight = window.innerHeight * 0.9;
        if (totalHeight > maxHeight) {
            canvas.style.height = `${maxHeight}px`;
            modal.style.overflowY = 'auto';
        }

        // Render all pages
        let currentHeight = 0;
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            await page.render(renderContext).promise;
            currentHeight += viewport.height;
            context.translate(0, viewport.height); // Move to next page position
        }
        console.log('Rendered PDF with height:', totalHeight);
    } catch (e) {
        console.error('PDF loading/rendering failed:', e.message);
        canvas.height = 600; // Fallback height
        canvas.style.height = '80vh';
        context.fillText('Error loading PDF', 10, 50);
    }
}

function closeModal() {
    const modal = document.getElementById('pdfModal');
    const canvas = document.getElementById('pdfCanvas');
    modal.style.display = 'none';
    if (canvas) {
        canvas.width = 0; // Clear canvas
        canvas.height = 0;
        canvas.style.height = '';
        canvas.style.width = '';
    }
}