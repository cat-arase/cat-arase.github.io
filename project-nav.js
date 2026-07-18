// Read selected category from URL
const params = new URLSearchParams(window.location.search);
let selectedCategory = params.get("category") || "all";

// Filter projects
let navProjects = projects;

if (selectedCategory !== "all") {
    navProjects = projects.filter(p => {
        const categories = Array.isArray(p.category) ? p.category : [p.category];
        return categories.includes(selectedCategory);
    });
}

// Find current project in filtered list
let currentIndex = navProjects.findIndex(p => p.id === currentId);

// If current project not in filtered list, fall back to all projects
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
    
    categorySlot.innerHTML = `
        <a class="project-category-pill" href="${link}">
            ${displayName}
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
