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
            console.warn(`Project "${currentId}" not found`);
            return;
        }

        const params = new URLSearchParams(window.location.search);
        let selectedCategory = params.get("category") || "all";

        let navProjects = projects;

        if (selectedCategory !== "all") {
            navProjects = projects.filter(p => {
                const categories = Array.isArray(p.category) ? p.category : [p.category];
                return categories.includes(selectedCategory);
            });
        }

        let currentIndex = navProjects.findIndex(p => p.id === currentId);

        if (currentIndex === -1) {
            navProjects = projects;
            currentIndex = navProjects.findIndex(p => p.id === currentId);
            selectedCategory = "all";
        }

        const prev = currentIndex > 0 ? navProjects[currentIndex - 1] : null;
        const next = currentIndex >= 0 && currentIndex < navProjects.length - 1
            ? navProjects[currentIndex + 1]
            : null;

        const categoryQuery = selectedCategory === "all" 
            ? "" 
            : `?category=${encodeURIComponent(selectedCategory)}`;

        if (categorySlot) {
            let displayName = selectedCategory === "all" 
                ? "All Projects" 
                : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
            
            const link = selectedCategory === "all" 
                ? "/projects.html" 
                : `/projects.html?category=${encodeURIComponent(selectedCategory)}`;
            
            categorySlot.innerHTML = `<a class="project-category-pill" href="${link}">${displayName}</a>`;
        }

        if (prevSlot) {
            prevSlot.innerHTML = prev
                ? `<a class="project-nav-link" href="/projects/${prev.id}/${prev.id}.html${categoryQuery}">← Previous Project</a>`
                : "";
        }

        if (nextSlot) {
            nextSlot.innerHTML = next
                ? `<a class="project-nav-link" href="/projects/${next.id}/${next.id}.html${categoryQuery}">Next Project →</a>`
                : "";
        }
    } catch (err) {
        console.error("Project nav failed:", err);
    }
});
