
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const DASHBOARD_HTML = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#17191e">
<title>Liam's Lab | File Manager</title>
<style>
:root {
    color-scheme: dark;
    --bg: #17191e;
    --panel: #20232a;
    --panel-hover: #282c34;
    --orange: #ff8a32;
    --text: #f2f2f5;
    --muted: #a2a6b1;
    --border: #353943;
    --green: #75d6a0;
    --red: #ff9388;
}
* { box-sizing: border-box; }
body {
    margin: 0;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font: 15px/1.6 "Segoe UI", Arial, sans-serif;
}
button, input { font: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; }
button:disabled { opacity: .55; cursor: wait; }
.container { width: min(1000px, calc(100% - 32px)); margin: auto; }
header {
    border-bottom: 1px solid var(--border);
    background: #17191ef5;
}
nav {
    min-height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}
.logo { font-size: 19px; font-weight: 850; letter-spacing: -.6px; }
.logo span { color: var(--orange); }
.nav-label { color: var(--muted); font-size: 13px; }
main { padding: 55px 0 75px; }
.eyebrow {
    color: var(--orange);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 11px;
    font-weight: 800;
}
h1 { font-size: clamp(32px, 5vw, 46px); line-height: 1.15; letter-spacing: -1.5px; margin: 10px 0; }
h1 span { color: var(--orange); }
.subtitle { color: var(--muted); margin: 0; }
.panel {
    margin-top: 30px;
    padding: 24px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 16px;
}
.panel-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 18px;
}
h2 { font-size: 19px; margin: 0; letter-spacing: -.3px; }
.small { color: var(--muted); font-size: 12px; margin: 4px 0 0; }
.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 15px;
    border: 1px solid var(--border);
    border-radius: 9px;
    color: var(--text);
    background: #292d36;
    font-weight: 650;
    font-size: 13px;
    transition: .18s ease;
}
.button:hover { border-color: var(--orange); transform: translateY(-1px); }
.button.primary { background: var(--orange); border-color: var(--orange); color: #191919; }
.button.primary:hover { background: #ff9a4d; }
.dropzone {
    display: grid;
    place-items: center;
    min-height: 205px;
    padding: 25px;
    text-align: center;
    border: 2px dashed #48414a;
    border-radius: 13px;
    background: #1a1c22;
    transition: .18s ease;
}
.dropzone.dragging {
    border-color: var(--orange);
    background: #33271f;
    transform: scale(1.005);
}
.upload-symbol {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    margin: 0 auto 10px;
    border-radius: 13px;
    background: #38291f;
    color: var(--orange);
    font-size: 25px;
}
.dropzone strong { display: block; font-size: 15px; }
.dropzone p { color: var(--muted); font-size: 13px; margin: 5px 0 15px; }
.upload-options {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    margin-top: 18px;
}
.field { min-width: 0; }
label { display: block; color: var(--muted); font-size: 12px; margin-bottom: 6px; }
input[type="password"], input[type="text"] {
    width: 100%;
    min-width: 0;
    padding: 11px 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    outline: none;
    background: #17191e;
    color: var(--text);
}
input:focus { border-color: var(--orange); }
input[type="file"] { display: none; }
.status {
    margin-top: 14px;
    padding: 11px 13px;
    border-radius: 9px;
    background: #292d36;
    color: var(--muted);
    font-size: 13px;
    overflow-wrap: anywhere;
}
.status:empty { display: none; }
.status.success { color: var(--green); }
.status.error { color: var(--red); }
.file-list { display: grid; gap: 10px; }
.file-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 13px;
    border: 1px solid var(--border);
    border-radius: 11px;
    background: #1b1e24;
}
.file-details { display: flex; align-items: center; gap: 12px; min-width: 0; }
.file-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 43px;
    height: 43px;
    border-radius: 10px;
    background: #38291f;
    color: var(--orange);
    font-size: 10px;
    font-weight: 850;
    font-family: Consolas, monospace;
    overflow: hidden;
}
.file-name { font-weight: 650; overflow-wrap: anywhere; font-size: 14px; }
.file-meta { color: var(--muted); font-size: 12px; }
.file-actions { flex-shrink: 0; }
.empty {
    padding: 30px 12px;
    border: 1px dashed var(--border);
    border-radius: 11px;
    text-align: center;
    color: var(--muted);
    font-size: 13px;
}
footer {
    border-top: 1px solid var(--border);
    padding: 22px 0;
    color: var(--muted);
    font-size: 12px;
}
footer .container { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
@media (max-width: 600px) {
    main { padding-top: 35px; }
    .panel { padding: 16px; }
    .upload-options { grid-template-columns: 1fr; }
    .upload-options .button { width: 100%; }
    .file-row { align-items: flex-start; flex-wrap: wrap; }
    .file-actions { margin-left: 55px; }
    nav { min-height: 62px; }
    .nav-label { font-size: 11px; }
}
</style>
</head>
<body>
<header>
    <nav class="container">
        <a class="logo" href="/">LIAM'S <span>LAB.</span></a>
        <span class="nav-label">R2 FILE MANAGER</span>
    </nav>
</header>

<main class="container">
    <div class="eyebrow">Cloud storage</div>
    <h1>Your files.<br><span>Your space.</span></h1>
    <p class="subtitle">Upload, organize and download files from your Liam's Lab storage.</p>

    <section class="panel">
        <div class="panel-heading">
            <div>
                <h2>Upload files</h2>
                <p class="small">Drag files into the box or choose them from your device.</p>
            </div>
        </div>

        <div class="dropzone" id="dropzone" role="button" tabindex="0"
             aria-label="Choose files or drop files here">
            <div>
                <div class="upload-symbol">↑</div>
                <strong>Drag and drop files here</strong>
                <p>Or select files from your computer. Maximum 25 MB per file.</p>
                <button class="button" type="button" id="choose-button">Choose files</button>
            </div>
        </div>

        <input type="file" id="file-input" multiple>

        <div class="upload-options">
            <div class="field">
                <label for="admin-password">Upload password</label>
                <input type="password" id="admin-password"
                       placeholder="Enter your upload password"
                       autocomplete="current-password">
            </div>
            <button class="button primary" id="upload-button" type="button">
                ↑ Upload selected
            </button>
        </div>
        <div class="status" id="upload-status" role="status" aria-live="polite"></div>
    </section>

    <section class="panel">
        <div class="panel-heading">
            <div>
                <h2>Stored files</h2>
                <p class="small" id="file-count">Loading files...</p>
            </div>
            <button class="button" id="refresh-button" type="button">↻ Refresh</button>
        </div>
        <div class="file-list" id="file-list" aria-live="polite">
            <div class="empty">Connecting to storage...</div>
        </div>
    </section>
</main>

<footer>
    <div class="container">
        <span>© <span id="year"></span> Liam's Lab</span>
        <span>Powered by Cloudflare Workers and R2</span>
    </div>
</footer>

<script>
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const fileInput = document.getElementById("file-input");
const dropzone = document.getElementById("dropzone");
const uploadButton = document.getElementById("upload-button");
const chooseButton = document.getElementById("choose-button");
const refreshButton = document.getElementById("refresh-button");
const passwordInput = document.getElementById("admin-password");
const uploadStatus = document.getElementById("upload-status");
const fileList = document.getElementById("file-list");
const fileCount = document.getElementById("file-count");

let selectedFiles = [];

document.getElementById("year").textContent = new Date().getFullYear();

function formatSize(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) return "Unknown size";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " MB";
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
}

function setStatus(message, type = "") {
    uploadStatus.textContent = message;
    uploadStatus.className = "status" + (type ? " " + type : "");
}

function updateSelectedFiles(files) {
    selectedFiles = Array.from(files || []);
    if (selectedFiles.length) {
        const total = selectedFiles.reduce((sum, file) => sum + file.size, 0);
        setStatus(
            selectedFiles.length + " file(s) selected · " + formatSize(total),
            ""
        );
    } else {
        setStatus("");
    }
}

chooseButton.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("click", event => {
    if (event.target.closest("button")) return;
    fileInput.click();
});
dropzone.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
    }
});
fileInput.addEventListener("change", () => updateSelectedFiles(fileInput.files));

for (const eventName of ["dragenter", "dragover"]) {
    dropzone.addEventListener(eventName, event => {
        event.preventDefault();
        dropzone.classList.add("dragging");
    });
}
for (const eventName of ["dragleave", "drop"]) {
    dropzone.addEventListener(eventName, event => {
        event.preventDefault();
        dropzone.classList.remove("dragging");
    });
}
dropzone.addEventListener("drop", event => {
    updateSelectedFiles(event.dataTransfer.files);
});

function createFileRow(file) {
    const row = document.createElement("div");
    row.className = "file-row";

    const details = document.createElement("div");
    details.className = "file-details";

    const icon = document.createElement("div");
    icon.className = "file-icon";
    const extension = file.name.includes(".")
        ? file.name.split(".").pop().toUpperCase()
        : "FILE";
    icon.textContent = extension.length > 5 ? "FILE" : extension;

    const info = document.createElement("div");
    const name = document.createElement("div");
    name.className = "file-name";
    name.textContent = file.name;

    const meta = document.createElement("div");
    meta.className = "file-meta";
    meta.textContent = formatSize(file.size);

    if (file.uploaded) {
        const date = new Date(file.uploaded);
        if (!Number.isNaN(date.getTime())) {
            meta.textContent += " · " + date.toLocaleDateString();
        }
    }

    info.append(name, meta);
    details.append(icon, info);

    const actions = document.createElement("div");
    actions.className = "file-actions";

    const download = document.createElement("a");
    download.className = "button primary";
    download.textContent = "↓ Download";
    download.href = "/api/download/" + encodeURIComponent(file.name);
    download.setAttribute("download", file.name);

    actions.append(download);
    row.append(details, actions);
    return row;
}

async function loadFiles() {
    refreshButton.disabled = true;
    refreshButton.textContent = "Loading...";
    fileCount.textContent = "Connecting to storage...";
    fileList.replaceChildren();

    try {
        const response = await fetch("/api/files", { cache: "no-store" });
        if (!response.ok) throw new Error("Server returned HTTP " + response.status);

        const data = await response.json();
        if (!Array.isArray(data.files)) throw new Error("Invalid file list response");

        const files = data.files
            .filter(file =>
                file &&
                typeof file.name === "string" &&
                file.name.length > 0 &&
                !file.name.includes("/") &&
                !file.name.includes("\\")
            )
            .sort((a, b) => a.name.localeCompare(b.name));

        fileCount.textContent = files.length +
            (files.length === 1 ? " file stored" : " files stored");

        if (!files.length) {
            const empty = document.createElement("div");
            empty.className = "empty";
            empty.textContent = "No files yet. Upload your first file above.";
            fileList.append(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        for (const file of files) fragment.append(createFileRow(file));
        fileList.append(fragment);
    } catch (error) {
        console.error(error);
        fileCount.textContent = "Could not load files";
        const empty = document.createElement("div");
        empty.className = "empty";
        empty.textContent = "Couldn't connect to storage. Try refreshing.";
        fileList.append(empty);
    } finally {
        refreshButton.disabled = false;
        refreshButton.textContent = "↻ Refresh";
    }
}

async function uploadFiles() {
    const password = passwordInput.value;
    if (!password) {
        setStatus("Enter your upload password first.", "error");
        passwordInput.focus();
        return;
    }

    if (!selectedFiles.length) {
        setStatus("Choose or drop at least one file first.", "error");
        return;
    }

    const invalid = selectedFiles.find(file =>
        file.size === 0 ||
        file.size > MAX_FILE_SIZE ||
        !file.name ||
        file.name.includes("/") ||
        file.name.includes("\\") ||
        file.name === "." ||
        file.name === ".."
    );

    if (invalid) {
        setStatus(
            invalid.name + " is empty, has an invalid filename, or exceeds 25 MB.",
            "error"
        );
        return;
    }

    uploadButton.disabled = true;
    chooseButton.disabled = true;
    let completed = 0;

    try {
        for (const file of selectedFiles) {
            setStatus(
                "Uploading " + file.name + " (" +
                (completed + 1) + " of " + selectedFiles.length + ")..."
            );

            const response = await fetch(
                "/api/upload?name=" + encodeURIComponent(file.name),
                {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + password,
                        "Content-Type": "application/octet-stream"
                    },
                    body: file
                }
            );

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || "Upload failed with HTTP " + response.status);
            }

            completed++;
        }

        setStatus("Successfully uploaded " + completed + " file(s).", "success");
        selectedFiles = [];
        fileInput.value = "";
        await loadFiles();
    } catch (error) {
        setStatus(error.message || "Upload failed.", "error");
    } finally {
        uploadButton.disabled = false;
        chooseButton.disabled = false;
    }
}

uploadButton.addEventListener("click", uploadFiles);
refreshButton.addEventListener("click", loadFiles);
loadFiles();
</script>
</body>
</html>`;

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff"
        }
    });
}

function safeName(name) {
    return typeof name === "string" &&
        name.length > 0 &&
        name.length <= 200 &&
        !name.includes("/") &&
        !name.includes("\\") &&
        name !== "." &&
        name !== ".." &&
        !/[\u0000-\u001F\u007F]/.test(name);
}

function isAuthorized(request, env) {
    const authorization = request.headers.get("Authorization");
    return Boolean(
        env.ADMIN_PASSWORD &&
        authorization === `Bearer ${env.ADMIN_PASSWORD}`
    );
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders
            });
        }

        if (request.method === "GET" &&
            (url.pathname === "/" || url.pathname === "/index.html")) {
            return new Response(DASHBOARD_HTML, {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                    "Cache-Control": "no-store",
                    "X-Content-Type-Options": "nosniff",
                    "Referrer-Policy": "no-referrer",
                    "Content-Security-Policy":
                        "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
                }
            });
        }

        if (url.pathname === "/api/health" && request.method === "GET") {
            return json({ status: "ok", service: "Liam's Lab Files" });
        }

        if (url.pathname === "/api/files" && request.method === "GET") {
            try {
                const listed = await env.FILES_BUCKET.list({ limit: 1000 });

                return json({
                    files: listed.objects
                        .filter(object => safeName(object.key))
                        .map(object => ({
                            name: object.key,
                            size: object.size,
                            uploaded: object.uploaded
                        }))
                });
            } catch (error) {
                return json({ error: "Could not list files" }, 500);
            }
        }

        if (url.pathname.startsWith("/api/download/") &&
            request.method === "GET") {
            let name;

            try {
                name = decodeURIComponent(
                    url.pathname.slice("/api/download/".length)
                );
            } catch {
                return json({ error: "Invalid filename encoding" }, 400);
            }

            if (!safeName(name)) {
                return json({ error: "Invalid filename" }, 400);
            }

            try {
                const object = await env.FILES_BUCKET.get(name);

                if (!object) {
                    return json({ error: "File not found" }, 404);
                }

                return new Response(object.body, {
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/octet-stream",
                        "Content-Disposition":
                            `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
                        "Content-Length": String(object.size),
                        "X-Content-Type-Options": "nosniff",
                        "Cache-Control": "no-store"
                    }
                });
            } catch (error) {
                return json({ error: "Could not download file" }, 500);
            }
        }

        if (url.pathname === "/api/upload" && request.method === "POST") {
            if (!isAuthorized(request, env)) {
                return json({ error: "Unauthorized" }, 401);
            }

            const name = url.searchParams.get("name");

            if (!safeName(name)) {
                return json({ error: "Invalid filename" }, 400);
            }

            const contentLength = Number(request.headers.get("Content-Length"));

            if (Number.isFinite(contentLength) &&
                contentLength > MAX_UPLOAD_BYTES) {
                return json({ error: "Maximum upload size is 25 MB per file" }, 413);
            }

            if (!request.body) {
                return json({ error: "No file data received" }, 400);
            }

            try {
                const file = await request.arrayBuffer();

                if (file.byteLength === 0) {
                    return json({ error: "Empty files are not allowed" }, 400);
                }

                if (file.byteLength > MAX_UPLOAD_BYTES) {
                    return json({ error: "Maximum upload size is 25 MB per file" }, 413);
                }

                await env.FILES_BUCKET.put(name, file);

                return json({
                    success: true,
                    name,
                    size: file.byteLength
                }, 201);
            } catch (error) {
                return json({ error: "Upload failed" }, 500);
            }
        }

        return json({ error: "Not found" }, 404);
    }
};
