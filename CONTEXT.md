# PlovDev Backend Context

## Project Overview
PlovDev is a Cambodian online learning platform teaching tech stacks to Cambodian students. Similar to Udemy but focused on Cambodia. The platform supports dual language (Khmer and English).

## Deadline
June 19, 2026 — Deploy link and repository submission

## Tech Stack
- Runtime: Node.js
- Framework: Express.js
- ORM: Sequelize
- Database: PostgreSQL (running in Docker)
- Authentication: JWT (access token 15m, refresh token 7d)
- File Storage: Cloudinary
- Email: Nodemailer + Gmail App Password
- Payment: ABA PayWay (QR scan)    
- Username generation: slugify library

## Environment Variables
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=PlovDevLocal
DB_HOST=127.0.0.1
DB_PORT=5432
EMAIL_USER=your_gmail
EMAIL_PASSWORD=your_app_password
JWT_SECRET=your_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

## Project Structure
backend/
├── CONTEXT.md
├── RULES.md
├── config/
│   ├── cloudinary.js
│   └── db.js
├── controllers/
│   ├── auth.controller.js
│   ├── course.controller.js
│   ├── teacherProfile.controller.js
│   └── studentProfile.controller.js
├── middlewares/
│   ├── authenticateToken.js
│   ├── isTeacher.js
│   ├── isAdmin.js
│   ├── isStudent.js
│   └── isTeacherOrAdmin.js
├── models/
│   ├── users.js
│   ├── teacher_profiles.js
│   ├── student_profiles.js
│   ├── otp_codes.js
│   ├── refresh_tokens.js
│   ├── courses.js
│   ├── sections.js
│   ├── lessons.js
│   ├── tags.js
│   ├── course_tags.js
│   ├── quizzes.js
│   ├── quiz_questions.js
│   ├── enrollments.js
│   ├── payments.js
│   ├── teacher_payouts.js
│   ├── lesson_progress.js
│   ├── quiz_attempts.js
│   ├── certificates.js
│   ├── course_progress.js
│   ├── reviews.js
│   ├── qa_posts.js
│   ├── qa_replies.js
│   ├── qa_upvotes.js
│   └── job_listings.js
├── routes/
│   ├── auth.routes.js
│   ├── course.routes.js
│   ├── teacherProfile.routes.js
│   └── studentProfile.routes.js
├── utils/
│   ├── generateForUser.js
│   ├── multer.js
│   ├── sendEmail.js
│   ├── uploadToCloudinary.js
│   
└── migrations/

---

## Database Tables (24 tables)

### Group 1 — Users & Auth (5 tables)

**users**
id, fullName, userName (auto generated from fullName using slugify),
email, phoneNumber, password (bcrypt hashed),
gender (male/female/other), is_verified (default false),
is_active (default true), is_blocked (default false),
role (admin/student/teacher), createdAt, updatedAt

**teacher_profiles** — one-to-one with users
id, profileUrl, profile_publicId, bio, yearsExp,
commissionRate (default 0.40), avgRating (default 0),
total_students (default 0), is_verified (default false),
account_name, account_number, khqr_url, khqr_public_id,
userId (unique FK → users.id), createdAt, updatedAt

**student_profiles** — one-to-one with users
id, profileUrl, profile_publicId, bio, github_url,
userId (unique FK → users.id), createdAt, updatedAt

**otp_codes**
id, code, expireAt, is_used (default false),
userId (FK → users.id), createdAt, updatedAt

**refresh_tokens**
id, token (unique), expires_at, is_revoked (default false),
userId (FK → users.id), createdAt, updatedAt

---

### Group 2 — Courses & Content (7 tables)

**courses**
id, title_en, description, what_you_learn, prerequisites,
language (km/en), thumbnailUrl, thumbnailPublicId,
price (default 0), originalPrice (default 0),
is_best_seller (default false), avg_rating (default 0),
totalStudent (default 0), totalReview (default 0),
status (draft/pending_review/published/rejected/archived default draft),
archived_at, teacherId (FK → users.id), createdAt, updatedAt

**sections**
id, title, position,
courseId (FK → courses.id), createdAt, updatedAt

**lessons**
id, title, videoUrl, videoPublicId, duration_secs,
is_free_preview (default false), position,
sectionId (FK → sections.id), createdAt, updatedAt

**tags**
id, name (unique), iconUrl, createdAt, updatedAt

**course_tags** — junction table
id, courseId (FK → courses.id),
tagId (FK → tags.id), createdAt, updatedAt

**quizzes**
id, title, courseId (FK → courses.id),
sectionId (nullable FK → sections.id — null means final quiz),
createdAt, updatedAt

**quiz_questions**
id, question, options (JSONB), correct_answer,
explanation, position,
quizId (FK → quizzes.id), createdAt, updatedAt

---

### Group 3 — Enrollment & Payments (3 tables)

**enrollments**
id, enrolledAt, isCompleted (default false), completedAt,
userId (FK → users.id), courseId (FK → courses.id),
paymentId (nullable FK → payments.id — null for free courses),
createdAt, updatedAt

**payments**
id, amount, commission (40%), teacherPayout (60%),
status (pending/failed/success), transaction_id (unique),
paid_at, is_refunded (default false), refundedAt,
userId (FK → users.id), courseId (FK → courses.id),
createdAt, updatedAt

**teacher_payouts**
id, periodMonth, totalEarned, commissionDeducted,
netPayout, status (pending/paid/failed default pending),
payment_method (default ABA), receipt_url, paidAt,
teacherId (FK → users.id), createdAt, updatedAt

---

### Group 4 — Learning Progress (4 tables)

**lesson_progress**
id, is_complete (default false), last_position_secs, completedAt,
userId (FK → users.id), lessonId (FK → lessons.id),
createdAt, updatedAt

**quiz_attempts**
id, answers (JSONB), passed, attempt_at,
userId (FK → users.id), quizId (FK → quizzes.id),
createdAt, updatedAt

**certificates**
id, verification_id (unique), issued_at,
userId (FK → users.id), courseId (FK → courses.id),
createdAt, updatedAt

**course_progress**
id, total_lessons, completed_lessons, percentage (default 0),
is_completed (default false), last_accessed, completed_at,
userId (FK → users.id), courseId (FK → courses.id),
createdAt, updatedAt

---

### Group 5 — Community (4 tables)

**reviews**
id, rating (1-5), body,
userId (FK → users.id), courseId (FK → courses.id),
createdAt, updatedAt

**qa_posts**
id, body, is_answered (default false),
lessonId (FK → lessons.id), userId (FK → users.id),
createdAt, updatedAt

**qa_replies**
id, body,
postId (FK → qa_posts.id), userId (FK → users.id),
createdAt, updatedAt

**qa_upvotes**
id, postId (nullable FK → qa_posts.id),
replyId (nullable FK → qa_replies.id),
userId (FK → users.id), createdAt, updatedAt

---

### Group 6 — Job Board (1 table)

**job_listings**
id, company_name, hr_name, title,
job_type (full-time/part-time/internship),
location, salary_min, salary_max, skills (JSONB),
apply_url, source (form/telegram_bot/admin),
is_approved (default false), applicants (default 0),
status (pending_review/active/rejected default pending_review),
rejectedAt, publishedAt, expires_at,
createdAt, updatedAt

---

## Completed APIs

### Auth
POST /api/v1/auth/register
POST /api/v1/auth/verify-otp
POST /api/v1/auth/resend-otp
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/verify-forgot-otp
POST /api/v1/auth/reset-password

### Teacher Profile
POST /api/v1/teacher/profile
PUT  /api/v1/teacher/profile
GET  /api/v1/teacher/profile
GET  /api/v1/teacher/profile/:userId

### Student Profile
POST /api/v1/student/profile
PUT  /api/v1/student/profile
GET  /api/v1/student/profile
GET  /api/v1/student/profile/:userId

### Courses
GET    /api/v1/courses
GET    /api/v1/courses/:courseId
POST   /api/v1/courses
PUT    /api/v1/courses/:courseId
DELETE /api/v1/courses/:courseId
PUT    /api/v1/courses/:courseId/publish
GET    /api/v1/courses/me

---

## Remaining APIs to Build

### Sections
POST   /api/v1/courses/:courseId/sections
GET    /api/v1/courses/:courseId/sections
PUT    /api/v1/sections/:sectionId
DELETE /api/v1/sections/:sectionId

### Lessons
POST   /api/v1/sections/:sectionId/lessons
GET    /api/v1/sections/:sectionId/lessons
PUT    /api/v1/lessons/:lessonId
DELETE /api/v1/lessons/:lessonId

### Tags
GET    /api/v1/tags
POST   /api/v1/tags
POST   /api/v1/courses/:courseId/tags/:tagId
DELETE /api/v1/courses/:courseId/tags/:tagId

### Enrollments
POST   /api/v1/enrollments
GET    /api/v1/enrollments/me
GET    /api/v1/courses/:courseId/students

### Payments
POST   /api/v1/payments/initiate
POST   /api/v1/payments/webhook
GET    /api/v1/payments/me
GET    /api/v1/admin/payments

### Learning Progress
PUT    /api/v1/lessons/:lessonId/progress
GET    /api/v1/courses/:courseId/progress

### Quizzes
POST   /api/v1/courses/:courseId/quizzes
POST   /api/v1/quizzes/:quizId/questions
POST   /api/v1/quizzes/:quizId/attempt
GET    /api/v1/quizzes/:quizId/attempts/me

### Certificates
GET    /api/v1/certificates/me
GET    /api/v1/certificates/:verificationId

### Reviews
POST   /api/v1/courses/:courseId/reviews
GET    /api/v1/courses/:courseId/reviews

### Q&A
GET    /api/v1/lessons/:lessonId/qa
POST   /api/v1/lessons/:lessonId/qa
POST   /api/v1/qa/:postId/replies
PUT    /api/v1/qa/:postId/upvote

### Job Board
GET    /api/v1/jobs
GET    /api/v1/jobs/:jobId
POST   /api/v1/jobs
PUT    /api/v1/admin/jobs/:jobId/approve
DELETE /api/v1/admin/jobs/:jobId

### Admin
GET    /api/v1/admin/users
PUT    /api/v1/admin/users/:userId/block
GET    /api/v1/admin/payouts
PUT    /api/v1/admin/payouts/:payoutId/approve
PUT    /api/v1/admin/payouts/:payoutId/reject
GET    /api/v1/admin/courses
PUT    /api/v1/admin/courses/:courseId/approve

---

## Key Business Rules

### Commission
- Platform takes 40% commission
- Teacher receives 60%
- Always store both values in payments table

### Course Status Flow
draft → pending_review → published
→ rejected
published → archived

### Enrollment
- Free courses (price = 0) → enroll immediately
- Paid courses → need confirmed payment first
- Create course_progress row on enrollment
- Student cannot enroll twice in same course

### Progress
- percentage = (completed_lessons / total_lessons) * 100
- When percentage = 100 → set is_completed = true
- Update last_position_secs every time student watches

### Quiz
- Passing score = 70% hardcoded in backend
- Compare student answer against correct_answer field
- After passing final quiz → check all lessons complete → auto generate certificate

### Certificate
- Only generate when ALL lessons complete AND final quiz passed
- Always generate unique verification_id
- Store issued_at timestamp

### Teacher Payout
- Calculated monthly by system
- Admin manually transfers to teacher ABA account
- Admin uploads receipt as proof
- Admin clicks Approve → status changes to paid
- Teacher downloads receipt from Payment History

### Job Board
- All jobs start as pending_review
- Admin approves → status active → visible to students
- Admin rejects → status rejected

---

## Important Conventions

### Error Response
```javascript
res.status(500).json({ messageError: error.message })
```

### Success Response
```javascript
res.status(200).json({ message: 'Success', data })
res.status(201).json({ message: 'Created', data })
```

### Migration Commands
```bash
npx sequelize-cli migration:generate --name migration-name
npm run migrate
npx sequelize-cli db:migrate:undo
```

### Model Naming
- Class: PascalCase → User, TeacherProfile, Course
- modelName: PascalCase → 'User', 'TeacherProfile'
- tableName: snake_case plural → 'users', 'teacher_profiles'

### Cloudinary Folders
- Profile pictures → plovdev/profiles
- Course thumbnails → plovdev/thumbnails
- Lesson videos → plovdev/videos
- Receipts → plovdev/receipts

### Number Parsing from form-data
```javascript
const parsedPrice = price ? parseFloat(price) : 0
const parsedPosition = position ? parseInt(position) : 1
```

### Create Then Fetch Pattern
Sequelize create does not support include. Always fetch after create:
```javascript
await Model.create({ ...data })
const result = await Model.findOne({ where: { id }, include: [...] })
```

### Ownership Check
```javascript
// teacher owns resource
const resource = await Model.findOne({
  where: { id: resourceId, teacherId: req.user.id }
})

// admin can access any resource
const resource = await Model.findOne({
  where: req.user.role === 'admin'
    ? { id: resourceId }
    : { id: resourceId, teacherId: req.user.id }
})
```