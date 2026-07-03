# 📚 API Documentation - Facility Maintenance Reporting System

## Base URL
```
http://localhost:8000/api
```

## Authentication
Semua endpoint (kecuali login) memerlukan header:
```
Authorization: Bearer {token}
```

Token diperoleh dari endpoint login dan berlaku unlimited.

---

## ✅ Response Format

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation description",
  "data": {...}
}
```

### Error Response (4xx/5xx)
```json
{
  "success": false,
  "message": "Error description",
  "errors": {...}
}
```

---

## 📋 TABLE OF CONTENTS
1. [Authentication Endpoints](#1-authentication-endpoints)
2. [Report Management](#2-report-management)
3. [Report Votes](#3-report-votes)
4. [Report Comments](#4-report-comments)

---

## 1. Authentication Endpoints

### 1.1 Register
**Endpoint:** `POST /auth/register`

**Description:** Register/aktivasi user menggunakan email campus yang sudah terdaftar sebelumnya di database. Password akan disimpan sebagai plain text.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "nim": "2024001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "1|abc123def456xyz789..."
  }
}
```

**Response (422) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

**Response (422) - Email Not Found or Already Registered:**
```json
{
  "success": false,
  "message": "Email campus tidak terdaftar di sistem."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 1.2 Login
**Endpoint:** `POST /auth/login`

**Description:** Login dengan email campus dan password untuk mendapatkan access token.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "nim": "2024001",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "1|abc123def456xyz789..."
  }
}
```

**Response (422) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

**Response (422) - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The provided credentials are incorrect."]
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 1.3 Get Profile
**Endpoint:** `GET /auth/profile`

**Description:** Mendapatkan data profil user yang sedang login.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": 1,
    "nim": "2024001",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response (401) - Unauthenticated:**
```json
{
  "success": false,
  "message": "Unauthenticated",
  "data": []
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json"
```

---

### 1.4 Logout
**Endpoint:** `POST /auth/logout`

**Description:** Logout dan revoke access token.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "data": []
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json"
```

---

## 2. Report Management

### 2.1 Create Report
**Endpoint:** `POST /reports`

**Description:** Membuat laporan kerusakan fasilitas baru dengan status awal "pending".

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "judul_laporan": "Pintu Laboratorium Rusak",
  "lokasi_fasilitas": "Gedung Teknik Lantai 2",
  "deskripsi_kerusakan": "Pintu lab sulit dibuka, engsel patah",
  "foto_bukti": null
}
```

**Request Body dengan File (multipart/form-data):**
```
POST /reports
Authorization: Bearer {token}
Content-Type: multipart/form-data

Fields:
- judul_laporan: "Pintu Laboratorium Rusak"
- lokasi_fasilitas: "Gedung Teknik Lantai 2"
- deskripsi_kerusakan: "Pintu lab sulit dibuka, engsel patah"
- foto_bukti: [binary file, max 2MB, format: jpeg/png/jpg/gif]
```

**Response (201) - Created:**
```json
{
  "success": true,
  "message": "Report created successfully",
  "data": {
    "id": 5,
    "judul_laporan": "Pintu Laboratorium Rusak",
    "lokasi_fasilitas": "Gedung Teknik Lantai 2",
    "deskripsi_kerusakan": "Pintu lab sulit dibuka, engsel patah",
    "foto_bukti": "http://localhost:8000/storage/reports/abc123.jpg",
    "status": "pending",
    "user": {
      "id": 1,
      "nim": "2024001",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "votes_count": 0,
    "user_vote": false,
    "comments_count": 0,
    "created_at": "2026-06-02T10:30:00Z",
    "updated_at": "2026-06-02T10:30:00Z"
  }
}
```

**Response (422) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "judul_laporan": ["The judul_laporan field is required."],
    "lokasi_fasilitas": ["The lokasi_fasilitas field is required."],
    "deskripsi_kerusakan": ["The deskripsi_kerusakan field is required."],
    "foto_bukti": ["The foto_bukti must be an image."]
  }
}
```

**cURL Example (JSON):**
```bash
curl -X POST http://localhost:8000/api/reports \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json" \
  -d '{
    "judul_laporan": "Pintu Laboratorium Rusak",
    "lokasi_fasilitas": "Gedung Teknik Lantai 2",
    "deskripsi_kerusakan": "Pintu lab sulit dibuka, engsel patah"
  }'
```

**cURL Example (dengan file):**
```bash
curl -X POST http://localhost:8000/api/reports \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -F "judul_laporan=Pintu Laboratorium Rusak" \
  -F "lokasi_fasilitas=Gedung Teknik Lantai 2" \
  -F "deskripsi_kerusakan=Pintu lab sulit dibuka, engsel patah" \
  -F "foto_bukti=@/path/to/image.jpg"
```

---

### 2.2 Get All Reports (List)
**Endpoint:** `GET /reports`

**Description:** Mendapatkan daftar semua laporan dengan pagination, search, dan filter status.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Nomor halaman untuk pagination |
| per_page | integer | 15 | Jumlah data per halaman |
| q | string | - | Search keyword (mencari di judul_laporan & lokasi_fasilitas) |
| status | string | - | Filter by status (pending/diproses/selesai) |

**Response (200):**
```json
{
  "success": true,
  "message": "Reports retrieved",
  "data": [
    {
      "id": 5,
      "judul_laporan": "Pintu Laboratorium Rusak",
      "lokasi_fasilitas": "Gedung Teknik Lantai 2",
      "deskripsi_kerusakan": "Pintu lab sulit dibuka, engsel patah",
      "foto_bukti": "http://localhost:8000/storage/reports/abc123.jpg",
      "status": "pending",
      "user": {
        "id": 1,
        "nim": "2024001",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "votes_count": 3,
      "user_vote": true,
      "comments_count": 2,
      "created_at": "2026-06-02T10:30:00Z",
      "updated_at": "2026-06-02T10:30:00Z"
    },
    {
      "id": 4,
      "judul_laporan": "Lampu Rusak di Koridor",
      "lokasi_fasilitas": "Gedung Administrasi Lantai 1",
      "deskripsi_kerusakan": "Lampu di koridor utama tidak menyala",
      "foto_bukti": null,
      "status": "diproses",
      "user": {
        "id": 2,
        "nim": "2024002",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "votes_count": 5,
      "user_vote": false,
      "comments_count": 1,
      "created_at": "2026-06-01T15:20:00Z",
      "updated_at": "2026-06-02T08:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "per_page": 15,
    "current_page": 1,
    "last_page": 2,
    "from": 1,
    "to": 15
  }
}
```

**Response (401) - Unauthenticated:**
```json
{
  "success": false,
  "message": "Unauthenticated",
  "data": []
}
```

**cURL Examples:**

Semua reports, page 1:
```bash
curl -X GET "http://localhost:8000/api/reports" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json"
```

Search dengan keyword:
```bash
curl -X GET "http://localhost:8000/api/reports?q=pintu" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json"
```

Filter by status:
```bash
curl -X GET "http://localhost:8000/api/reports?status=pending" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json"
```

Search + Filter + Pagination:
```bash
curl -X GET "http://localhost:8000/api/reports?q=gedung&status=diproses&page=2&per_page=10" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json"
```

---

### 2.3 Update Report Status (Admin Only)
**Endpoint:** `PUT /reports/{id}/status`

**Description:** Mengubah status laporan (hanya untuk admin). Status dapat diubah dari pending → diproses → selesai.

**Headers:**
```
Authorization: Bearer {token} (must be admin)
Content-Type: application/json
```

**Path Parameter:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Report ID |

**Request Body:**
```json
{
  "status": "diproses"
}
```

**Valid Status Values:**
- `pending` - Laporan baru, belum diproses
- `diproses` - Sedang dikerjakan
- `selesai` - Selesai diperbaiki

**Response (200):**
```json
{
  "success": true,
  "message": "Report status updated",
  "data": {
    "id": 5,
    "judul_laporan": "Pintu Laboratorium Rusak",
    "lokasi_fasilitas": "Gedung Teknik Lantai 2",
    "deskripsi_kerusakan": "Pintu lab sulit dibuka, engsel patah",
    "foto_bukti": "http://localhost:8000/storage/reports/abc123.jpg",
    "status": "diproses",
    "user": {
      "id": 1,
      "nim": "2024001",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "votes_count": 3,
    "user_vote": true,
    "comments_count": 2,
    "created_at": "2026-06-02T10:30:00Z",
    "updated_at": "2026-06-02T11:00:00Z"
  }
}
```

**Response (403) - Not Admin:**
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": []
}
```

**Response (404) - Report Not Found:**
```json
{
  "success": false,
  "message": "Not found",
  "data": []
}
```

**Response (422) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "status": ["The status field is required.", "The selected status is invalid."]
  }
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:8000/api/reports/5/status" \
  -H "Authorization: Bearer 1|admin_token_123..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "diproses"
  }'
```

---

## 3. Report Votes

### 3.1 Toggle Vote (Upvote/Unlike)
**Endpoint:** `POST /reports/{reportId}/votes`

**Description:** Like/upvote atau unlike laporan. Jika user sudah upvote, maka vote akan dihapus (unlike). Jika belum upvote, maka vote akan dibuat.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameter:**
| Parameter | Type | Description |
|-----------|------|-------------|
| reportId | integer | Report ID |

**Request Body:** (kosong)
```json
{}
```

**Response (200) - Vote Added:**
```json
{
  "success": true,
  "message": "Vote toggled successfully",
  "data": {
    "voted": true,
    "votes_count": 4
  }
}
```

**Response (200) - Vote Removed (Unlike):**
```json
{
  "success": true,
  "message": "Vote toggled successfully",
  "data": {
    "voted": false,
    "votes_count": 3
  }
}
```

**Response (404) - Report Not Found:**
```json
{
  "success": false,
  "message": "Not found",
  "data": []
}
```

**cURL Example (Toggle vote):**
```bash
curl -X POST "http://localhost:8000/api/reports/5/votes" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 4. Report Comments

### 4.1 Get Comments (Nested)
**Endpoint:** `GET /reports/{reportId}/comments`

**Description:** Mendapatkan daftar semua komentar untuk laporan tertentu dengan dukungan nested replies. Hanya menampilkan top-level comments, tapi setiap comment dapat memiliki nested_comments.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameter:**
| Parameter | Type | Description |
|-----------|------|-------------|
| reportId | integer | Report ID |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Nomor halaman untuk pagination |
| per_page | integer | 15 | Jumlah top-level comments per halaman |

**Response (200):**
```json
{
  "success": true,
  "message": "Comments retrieved",
  "data": [
    {
      "id": 1,
      "komentar": "Ini seharusnya diperbaiki lebih cepat karena sangat menghambat aktivitas lab",
      "user": {
        "id": 2,
        "nim": "2024002",
        "name": "Jane Smith"
      },
      "nested_comments": [
        {
          "id": 2,
          "komentar": "Setuju, saya juga kesulitan melakukan praktik lab",
          "user": {
            "id": 3,
            "nim": "2024003",
            "name": "Mike Johnson"
          },
          "nested_comments": [
            {
              "id": 3,
              "komentar": "Sudah dilaporkan ke maintenance team",
              "user": {
                "id": 1,
                "nim": "2024001",
                "name": "John Doe"
              },
              "nested_comments": [],
              "created_at": "2026-06-02T12:00:00Z",
              "updated_at": "2026-06-02T12:00:00Z"
            }
          ],
          "created_at": "2026-06-02T11:30:00Z",
          "updated_at": "2026-06-02T11:30:00Z"
        }
      ],
      "created_at": "2026-06-02T11:00:00Z",
      "updated_at": "2026-06-02T11:00:00Z"
    },
    {
      "id": 4,
      "komentar": "Ada informasi berapa lama untuk perbaikan?",
      "user": {
        "id": 4,
        "nim": "2024004",
        "name": "Sarah Lee"
      },
      "nested_comments": [],
      "created_at": "2026-06-02T10:45:00Z",
      "updated_at": "2026-06-02T10:45:00Z"
    }
  ],
  "pagination": {
    "total": 10,
    "per_page": 15,
    "current_page": 1,
    "last_page": 1,
    "from": 1,
    "to": 2
  }
}
```

**Response (404) - Report Not Found:**
```json
{
  "success": false,
  "message": "Not found",
  "data": []
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/reports/5/comments?page=1&per_page=10" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json"
```

---

### 4.2 Create Comment (Top-level)
**Endpoint:** `POST /reports/{reportId}/comments`

**Description:** Membuat komentar baru untuk laporan. Dapat juga membuat reply dengan mengirim parent_comment_id.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameter:**
| Parameter | Type | Description |
|-----------|------|-------------|
| reportId | integer | Report ID |

**Request Body (Top-level comment):**
```json
{
  "komentar": "Ini seharusnya diperbaiki lebih cepat karena sangat menghambat aktivitas lab",
  "parent_comment_id": null
}
```

**Request Body (Reply to comment):**
```json
{
  "komentar": "Setuju dengan pendapatmu, saya juga mengalami hal sama",
  "parent_comment_id": 1
}
```

**Response (201) - Created:**
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 5,
    "komentar": "Ini seharusnya diperbaiki lebih cepat karena sangat menghambat aktivitas lab",
    "user": {
      "id": 1,
      "nim": "2024001",
      "name": "John Doe"
    },
    "nested_comments": [],
    "created_at": "2026-06-02T13:00:00Z",
    "updated_at": "2026-06-02T13:00:00Z"
  }
}
```

**Response (404) - Report Not Found:**
```json
{
  "success": false,
  "message": "Not found",
  "data": []
}
```

**Response (422) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "komentar": ["The komentar field is required.", "The komentar must be at least 5 characters."],
    "parent_comment_id": ["The selected parent_comment_id is invalid."]
  }
}
```

**cURL Example (Top-level comment):**
```bash
curl -X POST "http://localhost:8000/api/reports/5/comments" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json" \
  -d '{
    "komentar": "Ini seharusnya diperbaiki lebih cepat karena sangat menghambat aktivitas lab",
    "parent_comment_id": null
  }'
```

**cURL Example (Reply to comment):**
```bash
curl -X POST "http://localhost:8000/api/reports/5/comments" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json" \
  -d '{
    "komentar": "Setuju dengan pendapatmu, saya juga mengalami hal sama",
    "parent_comment_id": 1
  }'
```

---

### 4.3 Update Comment
**Endpoint:** `PUT /comments/{commentId}`

**Description:** Mengubah isi komentar. Hanya pembuat komentar atau admin yang dapat mengubah.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameter:**
| Parameter | Type | Description |
|-----------|------|-------------|
| commentId | integer | Comment ID |

**Request Body:**
```json
{
  "komentar": "Ini seharusnya diperbaiki lebih cepat karena sangat menghambat aktivitas lab [diperbarui]"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "id": 5,
    "komentar": "Ini seharusnya diperbaiki lebih cepat karena sangat menghambat aktivitas lab [diperbarui]",
    "user": {
      "id": 1,
      "nim": "2024001",
      "name": "John Doe"
    },
    "nested_comments": [],
    "created_at": "2026-06-02T13:00:00Z",
    "updated_at": "2026-06-02T13:05:00Z"
  }
}
```

**Response (403) - Unauthorized (bukan pembuat atau admin):**
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": []
}
```

**Response (404) - Comment Not Found:**
```json
{
  "success": false,
  "message": "Not found",
  "data": []
}
```

**Response (422) - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "komentar": ["The komentar field is required.", "The komentar must be at least 5 characters."]
  }
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:8000/api/comments/5" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json" \
  -d '{
    "komentar": "Ini seharusnya diperbaiki lebih cepat karena sangat menghambat aktivitas lab [diperbarui]"
  }'
```

---

### 4.4 Delete Comment
**Endpoint:** `DELETE /comments/{commentId}`

**Description:** Menghapus komentar (soft delete). Hanya pembuat komentar atau admin yang dapat menghapus.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameter:**
| Parameter | Type | Description |
|-----------|------|-------------|
| commentId | integer | Comment ID |

**Request Body:** (kosong)
```json
{}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "data": []
}
```

**Response (403) - Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": []
}
```

**Response (404) - Comment Not Found:**
```json
{
  "success": false,
  "message": "Not found",
  "data": []
}
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:8000/api/comments/5" \
  -H "Authorization: Bearer 1|abc123def456xyz789..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 📊 Complete API Summary Table

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/auth/register` | Register | ❌ | - |
| POST | `/auth/login` | Login | ❌ | - |
| GET | `/auth/profile` | Get profile | ✅ | Any |
| POST | `/auth/logout` | Logout | ✅ | Any |
| POST | `/reports` | Create report | ✅ | Any |
| GET | `/reports` | List reports | ✅ | Any |
| PUT | `/reports/{id}/status` | Update status | ✅ | Admin |
| POST | `/reports/{reportId}/votes` | Toggle vote | ✅ | Any |
| GET | `/reports/{reportId}/comments` | Get comments | ✅ | Any |
| POST | `/reports/{reportId}/comments` | Create comment | ✅ | Any |
| PUT | `/comments/{commentId}` | Update comment | ✅ | Creator/Admin |
| DELETE | `/comments/{commentId}` | Delete comment | ✅ | Creator/Admin |

---

## 🔍 Query String Examples

### Pagination
```
GET /reports?page=2&per_page=10
```

### Search & Filter
```
GET /reports?q=pintu&status=pending
```

### Combined
```
GET /reports?q=gedung&status=diproses&page=1&per_page=5
```

### Comments with Pagination
```
GET /reports/5/comments?page=1&per_page=20
```

---

## 🛠️ Error Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request format |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

---

## 💡 Tips & Tricks

### 1. **Testing dengan cURL atau Postman**
Simpan token dari login response dan gunakan untuk request berikutnya.

### 2. **Nested Comments Strategy**
- Get comments pertama kali untuk melihat struktur
- Reply dengan mengirim parent_comment_id
- Reply bisa unlimited depth

### 3. **Pagination Best Practice**
Selalu include `page` dan `per_page` untuk pagination yang konsisten.

### 4. **Authorization Check**
Pastikan token valid sebelum melakukan operasi protected. Token akan expired jika logout.

### 5. **File Upload untuk Foto Bukti**
- Gunakan `multipart/form-data` bukan JSON
- File max 2MB
- Supported: jpeg, png, jpg, gif

---

## 📦 Complete Request/Response Flow Example

### Scenario: User membuat laporan dan memberikan komentar

**1. Login**
```bash
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "1|abc123xyz..."
}
```

**2. Create Report**
```bash
POST /reports
Authorization: Bearer 1|abc123xyz...
{
  "judul_laporan": "Pintu Rusak",
  "lokasi_fasilitas": "Gedung Teknik Lt 2",
  "deskripsi_kerusakan": "Engsel patah"
}

Response:
{
  "data": {
    "id": 5,
    "status": "pending",
    ...
  }
}
```

**3. Upvote Report**
```bash
POST /reports/5/votes
Authorization: Bearer 1|abc123xyz...

Response:
{
  "data": {
    "voted": true,
    "votes_count": 1
  }
}
```

**4. Create Comment**
```bash
POST /reports/5/comments
Authorization: Bearer 1|abc123xyz...
{
  "komentar": "Ini harus diperbaiki",
  "parent_comment_id": null
}

Response:
{
  "data": {
    "id": 1,
    "komentar": "Ini harus diperbaiki"
  }
}
```

**5. Reply to Comment**
```bash
POST /reports/5/comments
Authorization: Bearer 1|abc123xyz...
{
  "komentar": "Setuju dengan kamu",
  "parent_comment_id": 1
}

Response:
{
  "data": {
    "id": 2,
    "komentar": "Setuju dengan kamu"
  }
}
```

---

**Backend siap untuk React frontend Anda!** 🚀
