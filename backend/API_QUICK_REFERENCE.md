# 🚀 API Quick Reference

## Authentication
```
POST   /auth/register           # Register (Email + Password)
POST   /auth/login              # Login (Email + Password)
GET    /auth/profile            # Get Current User
POST   /auth/logout             # Logout
```

---

## Reports
```
POST   /reports                 # Create Report
GET    /reports                 # List Reports (with search, filter, pagination)
PUT    /reports/{id}/status     # Update Status (Admin Only)
```

### Query Parameters untuk GET /reports
```
?page=1&per_page=15            # Pagination
?q=pintu                        # Search by judul_laporan or lokasi_fasilitas
?status=pending                 # Filter: pending/diproses/selesai
?q=pintu&status=pending&page=1  # Combined
```

---

## Votes
```
POST   /reports/{reportId}/votes    # Toggle Vote (Like/Unlike)
```

**Response:**
```json
{
  "voted": true,
  "votes_count": 5
}
```

---

## Comments
```
GET    /reports/{reportId}/comments          # Get Comments (Nested)
POST   /reports/{reportId}/comments          # Create Comment/Reply
PUT    /comments/{commentId}                 # Update Comment
DELETE /comments/{commentId}                 # Delete Comment
```

### Query Parameters untuk GET Comments
```
?page=1&per_page=15            # Pagination
```

### Request untuk Create/Reply
```json
{
  "komentar": "Your comment here",
  "parent_comment_id": null     # null for top-level, or ID for reply
}
```

---

## Headers
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Exception: File upload gunakan multipart/form-data**

---

## Common Response Format

### Success
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

### Error
```json
{
  "success": false,
  "message": "...",
  "errors": {...}
}
```

---

## Status Codes
- **200** OK
- **201** Created
- **400** Bad Request
- **401** Unauthorized
- **403** Forbidden
- **404** Not Found
- **422** Validation Error
- **500** Server Error

---

## Report Status Flow
```
pending → diproses → selesai
```
(Only admin can change status)

---

## User Roles
- **user** - Mahasiswa (Create report, create comments, upvote)
- **admin** - Admin (All user permissions + change report status + delete comments)

---

## File Upload for Report
```
Method: POST /reports
Content-Type: multipart/form-data

Fields:
- judul_laporan (string, required)
- lokasi_fasilitas (string, required)
- deskripsi_kerusakan (string, required)
- foto_bukti (file, optional, max 2MB, jpeg/png/jpg/gif)
```

---

## Examples

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### 2. Get Reports with Search
```bash
curl -X GET "http://localhost:8000/api/reports?q=pintu&status=pending" \
  -H "Authorization: Bearer {token}"
```

### 3. Create Report
```bash
curl -X POST http://localhost:8000/api/reports \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "judul_laporan": "Pintu Rusak",
    "lokasi_fasilitas": "Gedung Teknik",
    "deskripsi_kerusakan": "Engsel patah"
  }'
```

### 4. Upvote Report
```bash
curl -X POST http://localhost:8000/api/reports/5/votes \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 5. Get Comments
```bash
curl -X GET "http://localhost:8000/api/reports/5/comments?page=1" \
  -H "Authorization: Bearer {token}"
```

### 6. Create Comment
```bash
curl -X POST http://localhost:8000/api/reports/5/comments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "komentar": "Ini perlu diperbaiki",
    "parent_comment_id": null
  }'
```

### 7. Reply to Comment
```bash
curl -X POST http://localhost:8000/api/reports/5/comments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "komentar": "Setuju dengan kamu",
    "parent_comment_id": 1
  }'
```

### 8. Update Comment
```bash
curl -X PUT http://localhost:8000/api/comments/5 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "komentar": "Updated comment"
  }'
```

### 9. Delete Comment
```bash
curl -X DELETE http://localhost:8000/api/comments/5 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 10. Update Report Status (Admin)
```bash
curl -X PUT http://localhost:8000/api/reports/5/status \
  -H "Authorization: Bearer {admin_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "diproses"
  }'
```

---

## Validation Rules

### Create Report
- `judul_laporan`: required, string, max 255
- `lokasi_fasilitas`: required, string, max 255
- `deskripsi_kerusakan`: required, string
- `foto_bukti`: optional, image, max 2MB

### Create/Update Comment
- `komentar`: required, string, min 5 characters
- `parent_comment_id`: optional, must exist in report_comments

### Update Report Status
- `status`: required, must be one of: pending, diproses, selesai

### Register
- `email`: required, string, email
- `password`: required, string, min 6 characters

### Login
- `email`: required, string, email
- `password`: required, string

---

## Access Control Matrix

| Action | User | Admin |
|--------|------|-------|
| Register | ✅ | ✅ |
| Login | ✅ | ✅ |
| View Reports | ✅ | ✅ |
| Create Report | ✅ | ✅ |
| Change Report Status | ❌ | ✅ |
| Upvote Report | ✅ | ✅ |
| Create Comment | ✅ | ✅ |
| Edit Own Comment | ✅ | ✅ |
| Delete Own Comment | ✅ | ✅ |
| Delete Others' Comment | ❌ | ✅ |

---

**More details: See API_DOCUMENTATION.md**
