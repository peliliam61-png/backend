```javascript
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
};

const DASHBOARD_HTML = String.raw`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#17191e">
    <title>File Storage | Liam's Lab</title>
    <style>
        :root {
            color-scheme: dark;
            --bg: #111318;
            --panel: #1a1d24;
            --panel2: #222630;
            --border: #343946;
            --text: #f2f3f5;
            --muted: #a0a6b5;
            --orange: #ff914d;
            --orange2: #ff7139;
            --green: #75d49b;
            --red: #ff7777;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            min-height: 100vh;
            background: var(--bg);
            color: var(--text);
            font-family: "Segoe UI", system-ui, sans-serif;
        }

        header {
            border-bottom: 1px solid var(--border);
            background: #17191e;
            padding: 22px;
        }

        .header-inner, main {
            width: min(900px, calc(100% - 32px));
            margin: auto;
        }

        .brand {
            font-size: 23px;
            font-weight: 750;
            letter-spacing: -.7px;
        }

        .brand span { color: var(--orange); }

        .subtitle {
            margin-top: 5px;
            color: var(--muted);
            font-size: 13px;
        }

        main { padding: 28px 0 50px; }

        .panel {
            padding: 22px;
            margin-bottom: 20px;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 16px;
        }

        h2 {
            margin: 0 0 7px;
            font-size: 18px;
        }

        .description {
            margin: 0 0 19px;
            color: var(--muted);
            font-size: 13px;
            line-height: 1.6;
        }

        input, button {
            font: inherit;
        }

        input[type="password"] {
            display: block;
            width: 100%;
            padding: 12px 14px;
            color: var(--text);
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 10px;
            outline: none;
        }

        input:focus {
            border-color: var(--orange);
        }

        .dropzone {
            display: flex;
            min-height: 180px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 9px;
            padding: 25px;
            text-align: center;
            background: #171a21;
            border: 2px dashed #454b5a;
            border-radius: 14px;
            cursor: pointer;
            transition: border-color .15s, background .15s;
        }

        .dropzone:hover, .dropzone.dragover {
            border-color: var(--orange);
            background: #27211f;
        }

        .upload-icon {
            color: var(--orange);
            font-size: 34px;
        }

        .dropzone strong { font-size: 15px; }

        .dropzone small {
            color: var(--muted);
            font-size: 12px;
        }

        #file-input { display: none; }

        .selected-files {
            margin-top: 12px;
            color: var(--muted);
            font-size: 13px;
            overflow-wrap: anywhere;
        }

        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 16px;
        }

        button, .download {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            min-height: 40px;
            padding: 10px 15px;
            color: var(--text);
            background: var(--panel2);
            border: 1px solid var(--border);
            border-radius: 10px;
            cursor: pointer;
            text-decoration: none;
            font-size: 13px;
            font-weight: 650;
            transition: background .15s, border-color .15s;
        }

        button:hover, .download:hover {
            border-color: var(--orange);
        }

        button.primary {
            color: #21150f;
            background: var(--orange);
            border-color: var(--orange);
        }

        button.primary:hover {
            background: var(--orange2);
        }

        button:disabled {
            opacity: .5;
            cursor: not-allowed;
        }

        .section-heading {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 16px;
        }

        .section-heading h2 { margin: 0; }

        .file-count {
            padding: 5px 9px;
            color: var(--orange);
            background: #33251f;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
        }

        .file-list {
            display: flex;
            flex-direction: column;
            gap: 9px;
        }

        .file-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 13px;
            background: var(--panel2);
            border: 1px solid var(--border);
            border-radius: 11px;
        }

        .file-info {
            min-width: 0;
            overflow-wrap: anywhere;
        }

        .file-name {
            font-size: 13px;
            font-weight: 650;
        }

        .file-meta {
            margin-top: 5px;
            color: var(--muted);
            font-size: 11px;
        }

        .empty {
            padding: 25px 10px;
            color: var(--muted);
            text-align: center;
            font-size: 13px;
        }

        #status {
            display: none;
            margin-top: 15px;
            padding: 12px 14px;
            border-radius: 10px;
            overflow-wrap: anywhere;
            font-size: 13px;
        }

        #status.show { display: block; }
        #status.success { color: var(--green); background: #1c3028; }
        #status.error { color: var(--red); background: #351f23; }
        #status.info { color: var(--orange); background: #33251f; }

        footer {
            padding: 0 16px 25px;
            color: var(--muted);
            text-align: center;
            font-size: 11px;
        }

        @media (max-width: 520px) {
            .panel { padding: 16px; }
            .file-row { align-items: flex-start; }
            .download { flex-shrink: 0; }
            .actions button { flex: 1; }
        }
    </style>
</head>
<body>
    <header>
        <div class="header-inner">
            <div class="brand">Liam's <span>Lab</span></div>
            <div class="subtitle">Cloud file storage</div>
        </div>
    </header>

    <main>
        <section class="panel">
            <h2>Upload files</h2>
            <p class="description">
                Drop files below or choose them from your device.
                Maximum file size: 25 MB per file.
            </p>

            <input id="admin-password" type="password"
                placeholder="Upload password" autocomplete="current-password">

            <div style="height: 14px"></div>

            <div class="dropzone" id="dropzone" role="button" tabindex="0">
                <div class="upload-icon">↑</div>
                <strong>Drag and drop files here</strong>
                <small>or click to browse your files</small>
            </div>

            <input id="file-input" type="file" multiple>

            <div class="selected-files" id="selected-files">
                No files selected
            </div>

            <div class="actions">
                <button class="primary" id="upload-button">Upload files</button>
                <button id="clear-button">Clear selection</button>
            </div>

            <div id="status" role="status" aria-live="polite"></div>
        </section>

        <section class="panel">
            <div class="section-heading">
                <h2>Stored files</h2>
                <span class="file-count" id="file-count">Loading...</span>
            </div>

            <p class="description">Files currently stored in your cloud bucket.</p>

            <div class="file-list" id="file-list">
                <div class="empty">Loading files...</div>
            </div>

            <div class="actions">
                <button id="refresh-button">Refresh files</button>
            </div>
        </section>
    </main>

    <footer>Liam's Lab · Cloud file storage</footer>

    <script>
        const fileInput = document.getElementById("file-input");
        const dropzone = document.getElementById("dropzone");
        const selectedFiles = document.getElementById("selected-files");
        const passwordInput = document.getElementById("admin-password");
        const uploadButton = document.getElementById("upload-button");
        const clearButton = document.getElementById("clear-button");
        const refreshButton = document.getElementById("refresh-button");
        const fileList = document.getElementById("file-list");
        const fileCount = document.getElementById("file-count");
        const statusBox = document.getElementById("status");

        let selected = [];

        function showStatus(message, type = "info") {
            statusBox.textContent = message;
            statusBox.className = "show " + type;
        }

        function hideStatus() {
            statusBox.className = "";
            statusBox.textContent = "";
        }

        function formatSize(bytes) {
            if (bytes < 1024) return bytes + " B";
            if (bytes < 1024 * 1024) {
                return (bytes / 1024).toFixed(1) + " KB";
            }
            return (bytes / (1024 * 1024)).toFixed(2) + " MB";
        }

        function setFiles(files) {
            const incoming = Array.from(files);
            const seen = new Set(selected.map(file =>
                file.name + ":" + file.size + ":" + file.lastModified
            ));

            for (const file of incoming) {
                const key = file.name + ":" + file.size + ":" + file.lastModified;
                if (!seen.has(key)) {
                    selected.push(file);
                    seen.add(key);
                }
            }

            updateSelection();
        }

        function updateSelection() {
            if (!selected.length) {
                selectedFiles.textContent = "No files selected";
                return;
            }

            const total = selected.reduce((sum, file) => sum + file.size, 0);
            selectedFiles.textContent =
                selected.length + " file(s) selected · " + formatSize(total) +
                " · " + selected.map(file => file.name).join(", ");
        }

        dropzone.addEventListener("click", () => fileInput.click());

        dropzone.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInput.click();
            }
        });

        fileInput.addEventListener("change", () => {
            setFiles(fileInput.files);
            fileInput.value = "";
        });

        for (const eventName of ["dragenter", "dragover"]) {
            dropzone.addEventListener(eventName, event => {
                event.preventDefault();
                dropzone.classList.add("dragover");
            });
        }

        for (const eventName of ["dragleave", "drop"]) {
            dropzone.addEventListener(eventName, event => {
                event.preventDefault();
                dropzone.classList.remove("dragover");
            });
        }

        dropzone.addEventListener("drop", event => {
            setFiles(event.dataTransfer.files);
        });

        clearButton.addEventListener("click", () => {
            selected = [];
            updateSelection();
            hideStatus();
        });

        uploadButton.addEventListener("click", async () => {
            if (!selected.length) {
                showStatus("Choose at least one file first.", "error");
                return;
            }

            const password = passwordInput.value;
            if (!password) {
                showStatus("Enter your upload password first.", "error");
                passwordInput.focus();
                return;
            }

            const oversized = selected.filter(file => file.size > 25 * 1024 * 1024);
            if (oversized.length) {
                showStatus(
                    "These files exceed the 25 MB limit: " +
                    oversized.map(file => file.name).join(", "),
                    "error"
                );
                return;
            }

            uploadButton.disabled = true;
            clearButton.disabled = true;
            let succeeded = 0;
            const failed = [];

            try {
                for (const file of selected) {
                    showStatus(
                        "Uploading " + (succeeded + failed.length + 1) +
                        " of " + selected.length + ": " + file.name,
                        "info"
                    );

                    try {
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
                            throw new Error(result.error || "HTTP " + response.status);
                        }

                        succeeded++;
                    } catch (error) {
                        failed.push(file.name + ": " + error.message);
                    }
                }

                if (failed.length) {
                    showStatus(
                        succeeded + " uploaded. " + failed.length +
                        " failed: " + failed.join(" | "),
                        succeeded ? "info" : "error"
                    );
                } else {
                    showStatus(succeeded + " file(s) uploaded successfully.", "success");
                    selected = [];
                    updateSelection();
                }

                await loadFiles();
            } finally {
                uploadButton.disabled = false;
                clearButton.disabled = false;
            }
        });

        function addText(parent, tag, className, value) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            element.textContent = value;
            parent.appendChild(element);
            return element;
        }

        async function loadFiles() {
            refreshButton.disabled = true;
            fileList.replaceChildren();
            addText(fileList, "div", "empty", "Loading files...");

            try {
                const response = await fetch("/api/files", { cache: "no-store" });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "HTTP " + response.status);
                }

                const files = Array.isArray(result.files) ? result.files : [];
                fileList.replaceChildren();
                fileCount.textContent = files.length + " file(s)";

                if (!files.length) {
                    addText(fileList, "div", "empty", "No files have been uploaded yet.");
                    return;
                }

                for (const file of files) {
                    const row = document.createElement("div");
                    row.className = "file-row";

                    const info = document.createElement("div");
                    info.className = "file-info";

                    addText(info, "div", "file-name", file.name);
                    addText(
                        info,
                        "div",
                        "file-meta",
                        formatSize(file.size || 0) +
                        (file.uploaded ? " · " + new Date(file.uploaded).toLocaleString() : "")
                    );

                    const download = document.createElement("a");
                    download.className = "download";
                    download.textContent = "Download";
                    download.href = "/api/download/" +
                        encodeURIComponent(file.name);
                    download.setAttribute("download", file.name);

                    row.append(info, download);
                    fileList.appendChild(row);
                }
            } catch (error) {
                fileList.replaceChildren();
                addText(fileList, "div", "empty", "Could not load files: " + error.message);
                fileCount.textContent = "Unavailable";
            } finally {
                refreshButton.disabled = false;
            }
        }

        refreshButton.addEventListener("click", loadFiles);
        loadFiles();
    </script>
</body>
</html>`;

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store"
        }
    });
}

function safeName(name) {
    if (
        typeof name !== "string" ||
        name.length === 0 ||
        name.length > 200 ||
        name === "." ||
        name === ".." ||
        /[/\\]/.test(name) ||
        /[\x00-\x1f\x7f]/.test(name)
    ) {
        return null;
    }

    return name;
}

function isAuthorized(request, env) {
    const authorization = request.headers.get("Authorization");

    return Boolean(
        env.UPLOAD_PASSWORD &&
        authorization === `Bearer ${env.UPLOAD_PASSWORD}`
    );
}

function getDownloadName(name) {
    const fallback = name.replace(/[^a-zA-Z0-9._ -]/g, "_");

    return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const pathname = url.pathname;
        const method = request.method.toUpperCase();

        if (method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: CORS_HEADERS
            });
        }

        if (method === "GET" && (pathname === "/" || pathname === "/index.html")) {
            return new Response(DASHBOARD_HTML, {
                headers: {
                    ...CORS_HEADERS,
                    "Content-Type": "text/html; charset=utf-8",
                    "Cache-Control": "no-store",
                    "Content-Security-Policy":
                        "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'"
                }
            });
        }

        if (method === "GET" && pathname === "/api/health") {
            return json({
                status: "ok",
                storageConfigured: Boolean(env.FILES_BUCKET),
                passwordConfigured: Boolean(env.UPLOAD_PASSWORD)
            });
        }

        if (method === "GET" && pathname === "/api/files") {
            if (!env.FILES_BUCKET) {
                return json({ error: "R2 bucket binding FILES_BUCKET is not configured." }, 500);
            }

            try {
                const result = await env.FILES_BUCKET.list({ limit: 1000 });

                const files = result.objects.map(object => ({
                    name: object.key,
                    size: object.size,
                    uploaded: object.uploaded ? object.uploaded.toISOString() : null
                }));

                return json({
                    files,
                    truncated: result.truncated
                });
            } catch {
                return json({ error: "Could not list stored files." }, 500);
            }
        }

        if (method === "GET" && pathname.startsWith("/api/download/")) {
            if (!env.FILES_BUCKET) {
                return json({ error: "R2 bucket binding FILES_BUCKET is not configured." }, 500);
            }

            let name;

            try {
                name = decodeURIComponent(pathname.slice("/api/download/".length));
            } catch {
                return json({ error: "Invalid filename." }, 400);
            }

            name = safeName(name);

            if (!name) {
                return json({ error: "Invalid filename." }, 400);
            }

            try {
                const object = await env.FILES_BUCKET.get(name);

                if (!object) {
                    return json({ error: "File not found." }, 404);
                }

                const headers = new Headers(CORS_HEADERS);
                object.writeHttpMetadata(headers);
                headers.set("Content-Type", object.httpMetadata?.contentType || "application/octet-stream");
                headers.set("Content-Disposition", getDownloadName(name));
                headers.set("Cache-Control", "no-store");
                headers.set("ETag", object.httpEtag);

                return new Response(object.body, { headers });
            } catch {
                return json({ error: "Could not download file." }, 500);
            }
        }

        if (method === "POST" && pathname === "/api/upload") {
            if (!env.UPLOAD_PASSWORD) {
                return json({ error: "Upload password secret UPLOAD_PASSWORD is not configured." }, 500);
            }

            if (!isAuthorized(request, env)) {
                return json({ error: "Invalid or missing upload password." }, 401);
            }

            if (!env.FILES_BUCKET) {
                return json({ error: "R2 bucket binding FILES_BUCKET is not configured." }, 500);
            }

            const name = safeName(url.searchParams.get("name"));

            if (!name) {
                return json({ error: "A valid filename is required in the name query parameter." }, 400);
            }

            const contentLength = request.headers.get("Content-Length");

            if (contentLength && Number(contentLength) > MAX_UPLOAD_BYTES) {
                return json({ error: "File exceeds the 25 MB upload limit." }, 413);
            }

            let file;

            try {
                file = await request.arrayBuffer();
            } catch {
                return json({ error: "Could not read uploaded file." }, 400);
            }

            if (file.byteLength > MAX_UPLOAD_BYTES) {
                return json({ error: "File exceeds the 25 MB upload limit." }, 413);
            }

            try {
                await env.FILES_BUCKET.put(name, file, {
                    httpMetadata: {
                        contentType: request.headers.get("Content-Type") || "application/octet-stream"
                    }
                });

                return json({
                    success: true,
                    name,
                    size: file.byteLength
                });
            } catch {
                return json({ error: "Could not save file to R2." }, 500);
            }
        }

        return json({ error: "Not found." }, 404);
    }
};
```
