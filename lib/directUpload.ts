// Browser → Cloudinary upload for the admin page. The server only signs the request
// (/api/upload/sign); the bytes go straight to Cloudinary, with a progress callback.

export type DirectUploadResult = { url: string; publicId: string; width: number; height: number; resourceType: string; bytes: number };

export async function uploadDirect(
  file: Blob,
  opts: { adminKey: string; folder: string; publicId?: string; fileName?: string; onProgress?: (percent: number) => void },
): Promise<DirectUploadResult> {
  const signRes = await fetch("/api/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-secret": opts.adminKey },
    body: JSON.stringify({ folder: opts.folder, publicId: opts.publicId }),
  });
  const sign = await signRes.json().catch(() => ({}));
  if (!signRes.ok) throw new Error(sign.error || `Could not prepare the upload (server replied ${signRes.status})`);

  const fd = new FormData();
  fd.append("file", file, opts.fileName || (file as File).name || "upload");
  fd.append("api_key", sign.apiKey);
  fd.append("timestamp", String(sign.timestamp));
  fd.append("signature", sign.signature);
  fd.append("folder", sign.folder);
  if (sign.publicId) fd.append("public_id", sign.publicId);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && opts.onProgress) opts.onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new Error("Network error during the upload. Check your connection and try again."));
    xhr.onload = () => {
      let json: any = {};
      try {
        json = JSON.parse(xhr.responseText);
      } catch {
        /* not JSON */
      }
      if (xhr.status >= 200 && xhr.status < 300 && json.secure_url) {
        resolve({
          url: json.secure_url,
          publicId: json.public_id,
          width: json.width ?? 0,
          height: json.height ?? 0,
          resourceType: json.resource_type ?? "",
          bytes: json.bytes ?? 0,
        });
      } else {
        reject(new Error(json?.error?.message || `Cloudinary replied ${xhr.status}`));
      }
    };
    xhr.send(fd);
  });
}
