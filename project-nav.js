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

        // Read selected category from URL
        const params = new URLSearchParams(window.location.search);
        let selectedCategory = params.get("category");

        // If no category in URL, use the first category from the project
        if (!selectedCategory) {
            selectedCategory = Array.isArray(currentProject.category)
                ? currentProject.category[0]
                : currentProject.category;
        }

        // Filter projects: keep only those that have the selected category
        let navProjects = projects.filter(p => {
            const categories = Array.isArray(p.category) ? p.category : [p.category];
            return categories.includes(selectedCategory);
        });

        // Find current project in filtered list
        let currentIndex = navProjects.findIndex(p => p.id === currentId);

        // If current project not in filtered list, fall back to its first category
        if (currentIndex === -1) {
            const fallbackCategory = Array.isArray(currentProject.category)
                ? currentProject.category[0]
                : currentProject.category;

            navProjects = projects.filter(p => {
                const categories = Array.isArray(p.category) ? p.category : [p.category];
                return categories.includes(fallbackCategory);
            });
            currentIndex = navProjects.findIndex(p => p.id === currentId);
            selectedCategory = fallbackCategory;
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
