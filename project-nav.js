document.addEventListener("DOMContentLoaded", async () => {
    const currentId = document.body.dataset.project;
    if (!currentId) return;

    const prevSlot = document.getElementById("project-prev");
    const nextSlot = document.getElementById("project-next");
    const categorySlot = document.getElementById("project-category");

    try {
        const response = await fetch("/projects-data.json");
        if (!response.ok) {
            throw new Error(`Could not load projects-data.json (${response.status})`);
        }

        const data = await response.json();
        const projects = Array.isArray(data) ? data : data.projects;

        const currentProject = projects.find(p => p.id === currentId);
        if (!currentProject) {
            console.warn(`Project "${currentId}" not found in projects-data.json`);
            return;
        }

        // Read selected category from URL if present
        const params = new URLSearchParams(window.location.search);
        const selectedCategory = params.get("category") || currentProject.category;

        // Keep navigation within the selected category
        let navProjects = projects.filter(p => p.category === selectedCategory);

        // If current project isn't in that category list, fall back to its own category
        let currentIndex = navProjects.findIndex(p => p.id === currentId);
        if (currentIndex === -1) {
            navProjects = projects.filter(p => p.category === currentProject.category);
            currentIndex = navProjects.findIndex(p => p.id === currentId);
        }

        const prev = currentIndex > 0 ? navProjects[currentIndex - 1] : null;
        const next = currentIndex >= 0 && currentIndex < navProjects.length - 1
            ? navProjects[currentIndex + 1]
            : null;

        const categoryQuery = `?category=${encodeURIComponent(selectedCategory)}`;

        if (categorySlot) {
            categorySlot.innerHTML = `
                <a class="project-category-pill" href="/projects.html${categoryQuery}">
                    ${selectedCategory}
                </a>
            `;
        }

        if (prevSlot) {
            prevSlot.innerHTML = prev
                ? `<a class="project-nav-link project-prev" href="/projects/${prev.id}/${prev.id}.html${categoryQuery}">← Previous Project</a>`
                : "";
        }

        if (nextSlot) {
            nextSlot.innerHTML = next
                ? `<a class="project-nav-link project-next" href="/projects/${next.id}/${next.id}.html${categoryQuery}">Next Project →</a>`
                : "";
        }
    } catch (err) {
        console.error("Project nav failed:", err);
    }
});
