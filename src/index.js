const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
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
        name !== "..";
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

        if (url.pathname === "/api/health" && request.method === "GET") {
            return json({ status: "ok", service: "Liam's Lab Files" });
        }

        if (url.pathname === "/api/files" && request.method === "GET") {
            const listed = await env.FILES_BUCKET.list({
                limit: 1000
            });

            return json({
                files: listed.objects.map(object => ({
                    name: object.key,
                    size: object.size,
                    uploaded: object.uploaded
                }))
            });
        }

        if (url.pathname.startsWith("/api/download/") &&
            request.method === "GET") {
            const name = decodeURIComponent(
                url.pathname.slice("/api/download/".length)
            );

            if (!safeName(name)) {
                return json({ error: "Invalid filename" }, 400);
            }

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
                    "X-Content-Type-Options": "nosniff"
                }
            });
        }

        if (url.pathname === "/api/upload" && request.method === "POST") {
            const authorization = request.headers.get("Authorization");
            const expected = `Bearer ${env.ADMIN_PASSWORD}`;

            if (!env.ADMIN_PASSWORD ||
                authorization !== expected) {
                return json({ error: "Unauthorized" }, 401);
            }

            const name = url.searchParams.get("name");

            if (!safeName(name)) {
                return json({ error: "Invalid filename" }, 400);
            }

            const file = await request.arrayBuffer();

            if (file.byteLength === 0) {
                return json({ error: "Empty files are not allowed" }, 400);
            }

            await env.FILES_BUCKET.put(name, file);

            return json({
                success: true,
                name,
                size: file.byteLength
            }, 201);
        }

        return json({ error: "Not found" }, 404);
    }
};
