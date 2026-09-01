const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://cloud-storage-backend-six.vercel.app";

/* =========================================================
   TOKEN
========================================================= */

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

/* =========================================================
   COMMON REQUEST
========================================================= */

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  // Do not manually set Content-Type for FormData.
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data;
}

/* =========================================================
   AUTH
========================================================= */

export async function login(email, password) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (data.token) {
    setToken(data.token);
  }

  return data;
}

// Compatibility name used by Login.jsx
export const loginUser = login;


export async function register(
  name,
  email,
  password
) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

// Compatibility name used by Signup.jsx
export const registerUser = register;


export async function logout() {
  try {
    await request("/api/auth/logout", {
      method: "POST",
    });
  } finally {
    clearToken();
  }
}


export async function getCurrentUser() {
  return request("/api/auth/me");
}

export async function getUserByEmail(email) {
  const params = new URLSearchParams({
    email: email.trim(),
  });

  return request(
    `/api/auth/by-email?${params.toString()}`
  );
}

/* =========================================================
   FOLDERS
========================================================= */

export async function getFolders(parentId = null) {
  const query = parentId
    ? `?parentId=${encodeURIComponent(parentId)}`
    : "";

  return request(`/api/folders${query}`);
}


export async function getFolder(folderId) {
  const [foldersResponse, filesResponse] =
    await Promise.all([
      getFolders(folderId),
      getFiles(folderId),
    ]);

  return {
    folder: {
      id: folderId,
    },

    children: {
      folders:
        foldersResponse?.folders || [],

      files:
        filesResponse?.files || [],
    },
  };
}


export async function createFolder(
  name,
  parentId = null
) {
  return request("/api/folders", {
    method: "POST",
    body: JSON.stringify({
      name,
      parentId,
    }),
  });
}


export async function renameFolder(
  folderId,
  name
) {
  return request(
    `/api/folders/${encodeURIComponent(folderId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        name,
      }),
    }
  );
}


export async function deleteFolder(folderId) {
  return request(
    `/api/folders/${encodeURIComponent(folderId)}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   FILE LISTING
========================================================= */

export async function getFiles(folderId = null) {
  const query = folderId
    ? `?folderId=${encodeURIComponent(folderId)}`
    : "";

  return request(`/api/files${query}`);
}



/* =========================================================
   ROOT CONTENTS
========================================================= */

export async function getRootContents() {
  const [
    foldersResponse,
    filesResponse,
  ] = await Promise.all([
    getFolders(null),
    getFiles(null),
  ]);

  return {
    folder: null,

    children: {
      folders:
        foldersResponse?.folders || [],

      files:
        filesResponse?.files || [],
    },

    path: [],
  };
}

/* =========================================================
   FILES
========================================================= */

export async function uploadFile(
  file,
  folderId = null
) {
  const formData = new FormData();

  formData.append("file", file);

  if (folderId) {
    formData.append(
      "folderId",
      folderId
    );
  }

  return request("/api/files/upload", {
    method: "POST",
    body: formData,
  });
}


export async function getFile(fileId) {
  return request(
    `/api/files/${encodeURIComponent(fileId)}`
  );
}


export async function renameFile(
  fileId,
  name
) {
  return request(
    `/api/files/${encodeURIComponent(fileId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        name,
      }),
    }
  );
}


export async function moveFile(
  fileId,
  folderId
) {
  return request(
    `/api/files/${encodeURIComponent(fileId)}/move`,
    {
      method: "PATCH",
      body: JSON.stringify({
        folderId,
      }),
    }
  );
}


export async function deleteFile(fileId) {
  return request(
    `/api/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================================================
   SEARCH
========================================================= */

export async function searchFiles(
  query,
  {
    page = 1,
    limit = 10,
    type = "all",
    sort = "date",
    order = "desc",
  } = {}
) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
    type,
    sort,
    order,
  });

  return request(
    `/api/search?${params.toString()}`
  );
}

/* =========================================================
   SHARING
========================================================= */

export async function shareResource(
  resourceType,
  resourceId,
  granteeUserId,
  role
) {
  return request("/api/shares", {
    method: "POST",
    body: JSON.stringify({
      resourceType,
      resourceId,
      granteeUserId,
      role,
    }),
  });
}

export async function getSharedFiles() {
  return request("/api/shares");
}

/* =========================================================
   USER SEARCH
========================================================= */

export async function findUserByEmail(email) {
  const params = new URLSearchParams({
    email: email.trim(),
  });

  return request(
    `/api/auth/by-email?${params.toString()}`
  );
}


/* =========================================================
   RECEIVED SHARES
========================================================= */

export async function getSharedWithMe() {
  return request("/api/shares/received");
}


/* =========================================================
   PUBLIC LINKS
========================================================= */

export async function createPublicLink(
  resourceType,
  resourceId
) {
  return request("/api/shares/link", {
    method: "POST",
    body: JSON.stringify({
      resourceType,
      resourceId,
    }),
  });
}

export async function getPublicLinks(
  resourceType,
  resourceId
) {
  return request(
    `/api/shares/link/${resourceType}/${resourceId}`
  );
}

export async function deletePublicLink(linkId) {
  return request(`/api/shares/link/${linkId}`, {
    method: "DELETE",
  });
}

export async function getResourceShares(
  resourceType,
  resourceId
) {
  return request(
    `/api/shares/${resourceType}/${resourceId}`
  );
}

export async function updateShare(
  shareId,
  role
) {
  return request(`/api/shares/${shareId}`, {
    method: "PUT",
    body: JSON.stringify({
      role,
    }),
  });
}


export async function deleteShare(shareId) {
  return request(`/api/shares/${shareId}`, {
    method: "DELETE",
  });
}

/* =========================================================
   PUBLIC LINK VIEWER (no auth — anyone with the link)
========================================================= */

export async function getPublicLinkInfo(token) {
  return request(`/api/public/${token}`);
}

export async function verifyPublicLinkPassword(token, password) {
  return request(`/api/public/${token}/verify`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}