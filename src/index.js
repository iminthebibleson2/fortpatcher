let releases = [];
let currentPage = 1;
const releasesPerPage = 6;

async function fetchReleases() {
    const response = await fetch("https://api.github.com/repos/YoshiCrystal9/FortPatcher-NX/releases");
    const data = await response.json();

    // Filter only releases that contain "all_patches.zip"
    releases = data.filter(release =>
        release.assets.some(asset => asset.name === "all_patches.zip")
    );

    displayPage(currentPage);
}

function displayPage(page) {
    const releaseTable = document.getElementById("release-table");
    releaseTable.innerHTML = ""; // Clear previous entries

    const start = (page - 1) * releasesPerPage;
    const end = start + releasesPerPage;
    const paginatedReleases = releases.slice(start, end);

    // Get the most recent release (first one in the full list)
    const latestRelease = releases[0];

    paginatedReleases.forEach(release => {
        const allPatches = release.assets.find(asset => asset.name === "all_patches.zip");

        const row = document.createElement("tr");
        row.classList.add("hover:bg-base-100");

        // Check if this is the most recent release
        const isCurrent = release.id === latestRelease.id ? `<div class="badge badge-primary">Current</div>` : "";

        row.innerHTML = `
            <td class="border border-primary px-4 py-2">
                <a href="${release.html_url}" target="_blank" class="text-blue-500 hover:underline font-medium">${release.name || release.tag_name}</a> ${isCurrent}
            </td>
            <td class="border border-primary px-4 py-2">
                <a href="${allPatches.browser_download_url}" target="_blank" class="text-indigo-600 hover:underline font-medium">
                    all_patches.zip
                </a>
            </td>
            <td class="border border-primary px-4 py-2">
                ${timeAgo(release.published_at)}
            </td>
        `;

        releaseTable.appendChild(row);
    });

    // Update pagination controls
    document.getElementById("pageNumber").innerText = `Page ${page}`;
    document.getElementById("prevPage").disabled = page === 1;
    document.getElementById("nextPage").disabled = end >= releases.length;
}

// Pagination Buttons
document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage * releasesPerPage < releases.length) {
        currentPage++;
        displayPage(currentPage);
    }
});

fetchReleases();

function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - new Date(date)) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const [unit, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count >= 1) {
            return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
        }
    }
    return "just now";
}

async function fetchFortniteVersion() {
    try {
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/version'));
        const data = await response.json();
        const fortniteData = JSON.parse(data.contents);
        const version = fortniteData.version;
        const buildDate = fortniteData.buildDate;
        const formattedDate = new Date(buildDate).toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        document.getElementById("version").innerText = `Version: ${version}`;
        document.getElementById("builtdate").innerText = `Build Date: ${formattedDate}`;

    } catch (error) {
        console.error("Error fetching Fortnite version:", error);
    }
}

fetchFortniteVersion();

