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
