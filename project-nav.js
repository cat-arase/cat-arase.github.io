document.addEventListener("DOMContentLoaded", async () => {
    const nav = document.getElementById("project-nav");
    if (!nav) return;

    // Find the site root so this works on GitHub Pages or a custom domain
    const pathname = window.location.pathname;
    const projectsIndex = pathname.indexOf("/projects/");
    const siteRoot = projectsIndex >= 0 ? pathname.slice(0, projectsIndex + 1) : "/";

    // Current project slug from <body data-project="egg-gripper">
    const currentProject =
        document.body.dataset.project ||
        pathname.split("/").filter(Boolean).pop().replace(/\.html$/, "");

    try {
        const response = await fetch(`${siteRoot}projects-data.json`);
        if (!response.ok) {
            throw new Error(`Could not load projects-data.json (${response.status})`);
        }

        const data = await response.json();
        const projects = Array.isArray(data) ? data : data.projects;

        const currentIndex = projects.findIndex(p => p.id === currentProject);
        if (currentIndex === -1) {
            console.warn(`Project "${currentProject}" not found in projects-data.json`);
            return;
        }

        const prev = projects[currentIndex - 1];
        const next = projects[currentIndex + 1];

        nav.className = "project-nav";
       nav.innerHTML = `
    <a class="back-link project-nav-button" href="${prev ? `${siteRoot}projects/${prev.id}/${prev.id}.html` : '#'}"
       style="${prev ? '' : 'visibility:hidden; pointer-events:none;'}">
        ← ${prev ? prev.title : 'Previous Project'}
    </a>

    <a class="back-link project-nav-button" href="${next ? `${siteRoot}projects/${next.id}/${next.id}.html` : '#'}"
       style="${next ? '' : 'visibility:hidden; pointer-events:none;'}">
        ${next ? next.title : 'Next Project'} →
    </a>
`;
    } catch (err) {
        console.error("Project nav failed to load:", err);
    }
});
