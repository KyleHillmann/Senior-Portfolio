// Event Delegation for Image Modals (unchanged)
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

// Progress Bar (unchanged)
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

// Section Visibility (unchanged)
const sections = document.querySelectorAll('.content-section');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// PDF Container Functions
async function openPDFContainer(pdfPath) {
    let pdfContainer = document.getElementById('pdfContainer');
    
    if (pdfContainer && pdfContainer.style.display === 'block') {
        return; // Exit if already open
    }

    if (!pdfContainer) {
        pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdfContainer';
        document.body.appendChild(pdfContainer);
    } else {
        pdfContainer.innerHTML = '';
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'pdfCanvas';
    pdfContainer.appendChild(canvas);
    const context = canvas.getContext('2d');

    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'X';
    closeButton.setAttribute('aria-label', 'Close PDF');
    closeButton.addEventListener('click', closePDFContainer);
    pdfContainer.appendChild(closeButton);

    pdfContainer.style.display = 'block';

    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;

        let totalHeight = 0;
        let maxWidth = 0;
        const scale = 1.5; // Reduced scale for better readability

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale });
            totalHeight += viewport.height;
            maxWidth = Math.max(maxWidth, viewport.width);
        }

        // Set canvas dimensions to accommodate all pages
        canvas.width = maxWidth;
        canvas.height = totalHeight;

        // Style the container with a fixed height and scrolling
        pdfContainer.style.position = 'fixed'; // Changed to fixed for better positioning
        pdfContainer.style.zIndex = '1000';
        pdfContainer.style.left = '50%';
        pdfContainer.style.top = '50px';
        pdfContainer.style.transform = 'translateX(-50%)';
        pdfContainer.style.background = '#fff';
        pdfContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        pdfContainer.style.padding = '20px';
        pdfContainer.style.maxHeight = '80vh'; // Limit height to 80% of viewport
        pdfContainer.style.overflowY = 'auto'; // Enable vertical scrolling
        pdfContainer.style.width = '90vw'; // Set a reasonable width
        pdfContainer.style.maxWidth = '1000px'; // Maximum width

        // Canvas styles
        canvas.style.width = '100%'; // Full width of container
        canvas.style.height = 'auto'; // Height adjusts to content

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
            context.translate(0, viewport.height);
        }
    } catch (e) {
        console.error('PDF loading/rendering failed:', e.message);
        canvas.height = 600;
        context.fillText('Error loading PDF', 10, 50);
    }
}

function closePDFContainer() {
    const pdfContainer = document.getElementById('pdfContainer');
    if (pdfContainer) {
        pdfContainer.style.display = 'none';
        pdfContainer.innerHTML = '';
    }
}
