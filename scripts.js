// --- Event Delegation for Image Modals ---
document.addEventListener('click', function (event) {
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
            if (closeButton) {
                closeButton.remove();
            }
            document.body.style.pointerEvents = '';
        }
    }
});

// --- Modal Background Click to Close ---
document.getElementById('pdfModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModal();
    }
});

// --- Progress Bar ---
function updateProgressBar() {
    const scrollPosition = window.scrollY || window.pageYOffset;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollPosition / totalHeight) * 100;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

window.addEventListener('scroll', updateProgressBar);
window.addEventListener('load', updateProgressBar);
window.addEventListener('resize', updateProgressBar);

// --- Section Visibility on Scroll (Intersection Observer) ---
const sections = document.querySelectorAll('.content-section');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

sections.forEach(section => {
    observer.observe(section);
});

// Function to open the modal and set the iframe source
function openModal(pdfPath) {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdfIframe');

    if (modal && iframe) {
        // Append parameters to hide toolbar and navigation panes
        const cleanPath = `${pdfPath}#toolbar=0&navpanes=0`;
        iframe.src = cleanPath; // Set the source of the iframe
        modal.style.display = 'block'; // Show the modal

        // Optional: Adjust height dynamically based on content
        iframe.onload = function() {
            try {
                // This will only work if the PDF is from the same origin
                const pdfHeight = iframe.contentWindow.document.body.scrollHeight;
                iframe.style.height = pdfHeight + 'px';
            } catch (e) {
                console.log('Height adjustment not possible due to cross-origin restrictions');
                // Fallback height
                iframe.style.height = '800px'; // Set a reasonable fallback height
            }
        };
    } else {
        console.error("Modal or iframe not found");
    }
}

// Function to close the modal
function closeModal() {
    document.getElementById('pdfModal').style.display = 'none';
    document.getElementById('pdfIframe').src = ''; // Clear the iframe source
}
