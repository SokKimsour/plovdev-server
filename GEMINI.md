# PlovDev Backend Context

## CONTEXT

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
│   ├── section.controller.js
│   ├── lesson.controller.js
│   ├── tag.controller.js
│   ├── enrollment.controller.js
│   ├── payment.controller.js
│   ├── progress.controller.js
│   ├── quiz.controller.js
│   ├── certificate.controller.js
│   ├── review.controller.js
│   ├── qa.controller.js
│   ├── job.controller.js
│   ├── admin.controller.js
│   └── userProfile.controller.js
├── middlewares/
│   ├── authMiddleware.js
│   └── rateLimits.js
├── models/
│   ├── users.js
│   ├── user_profiles.js
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
│   ├── course_progress.js
│   ├── quiz_attempts.js
│   ├── certificates.js
│   ├── reviews.js
│   ├── qa_posts.js
│   ├── qa_replies.js
│   ├── wishlists.js
│   └── job_listings.js
├── routes/
│   ├── auth.routes.js
│   ├── course.routes.js
│   ├── section.routes.js
│   ├── lesson.routes.js
│   ├── tag.routes.js
│   ├── enrollment.routes.js
│   ├── payment.routes.js
│   ├── progress.routes.js
│   ├── quiz.routes.js
│   ├── certificate.routes.js
│   ├── review.routes.js
│   ├── qa.routes.js
│   ├── job.routes.js
│   ├── admin.routes.js
│   └── userProfile.routes.js
├── utils/
│   ├── generateForUser.js
│   ├── multer.js
│   ├── sendEmail.js
│   └── uploadToCloudinary.js
└── migrations/

---

## Database Tables (23 tables)

### Group 1 — Users & Auth (4 tables)

**users**
id, fullName, userName (auto generated from fullName using slugify),
email, phoneNumber, password (bcrypt hashed, nullable for OAuth),
gender (male/female/other), is_verified (default false),
is_active (default true), is_blocked (default false),
role (admin/user default user),
google_id (unique, nullable),
auth_provider (local/google default local),
createdAt, updatedAt

**user_profiles** — one-to-one with users (merged teacher + student profile)
id, profileUrl, profile_publicId, bio,
yearsExp (nullable — only filled by teachers),
github_url (nullable — only filled by students),
commissionRate (default 0.40),
avgRating (default 0),
total_students (default 0),
is_verified (default false — admin verifies teacher),
account_name (nullable — teacher payout info),
account_number (nullable — teacher payout info),
khqr_url (nullable — teacher KHQR image),
khqr_public_id (nullable — for Cloudinary deletion),
userId (unique FK → users.id), createdAt, updatedAt

**otp_codes**
id, code, expireAt, is_used (default false),
userId (FK → users.id), createdAt, updatedAt

**refresh_tokens**
id, token (unique), expires_at,
is_revoked (default false),
userId (FK → users.id), createdAt, updatedAt

---

### Group 2 — Courses & Content (7 tables)

**courses**
id, title_en, description, what_you_learn (stored as HTML from TipTap editor),
thumbnailUrl, thumbnailPublicId,
price (default 0), originalPrice (default 0),
is_best_seller (default false),
avg_rating (default 0),
totalStudent (default 0),
totalReview (default 0),
total_duration_secs (default 0 — sum of all lesson durations),
status (draft/pending_review/published/rejected/archived default draft),
rejected_reason (text, nullable — admin fills when rejecting),
archived_at (nullable),
teacherId (FK → users.id), createdAt, updatedAt

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
sectionId (nullable FK → sections.id — null means final course quiz),
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
status (pending/failed/success),
transaction_id (unique), paid_at,
payment_method (e.g. ABA),
is_refunded (default false), refundedAt (nullable),
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

**course_progress**
id, total_lessons, completed_lessons,
percentage (default 0), is_completed (default false),
last_accessed, completed_at,
lastLessonId (nullable FK → lessons.id — tracks resume point),
userId (FK → users.id), courseId (FK → courses.id),
createdAt, updatedAt

**quiz_attempts**
id, answers (JSONB), passed, attempt_at,
userId (FK → users.id), quizId (FK → quizzes.id),
createdAt, updatedAt

**certificates**
id, verification_id (unique), issued_at,
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

**wishlists** — junction table
id, userId (FK → users.id), courseId (FK → courses.id),
unique constraint on (userId, courseId),
createdAt, updatedAt

---

### Group 6 — Job Board (1 table)

**job_listings**
id, company_name, company_logo (nullable — Cloudinary URL),
hr_name, title,
emp_type (full-time/part-time/internship),
description (text),
location, salary_min, salary_max,
skills (JSONB), contact_email,
source (form/telegram_bot/admin),
open_positions (default 1 — PAX),
status (pending_review/published/rejected default pending_review),
rejectedAt (nullable), publishedAt (nullable),
expires_at, createdAt, updatedAt

---

## Auth Flow

### Local (email/password)
Register → OTP sent to email → verify OTP → logged in
Login → check auth_provider → check is_active/is_blocked → compare password → check is_verified → generate tokens
Forgot password → OTP sent → verify OTP → reset password

### Google OAuth
Click "Sign in with Google" → Google redirects back → OTP sent → verify OTP → logged in
auth_provider = 'google', password = null, is_verified = true automatically

### Login Order of Checks
```javascript
1. User exists?              → if not → 400 Invalid email or password
2. auth_provider = 'google'? → if yes → 400 Use Google login
3. is_active = false?        → if yes → 403 Account suspended
4. is_blocked = true?        → if yes → 403 Account suspended
5. password correct?         → if not → 400 Invalid email or password
6. is_verified = true?       → if not → 403 Please verify your email
7. Generate access token + refresh token
8. Cleanup expired/revoked refresh tokens for this user
9. Save new refresh token
10. Return tokens
```

### Token Cleanup on Login
```javascript
await refreshTokens.destroy({
  where: {
    userId: user.id,
    [Op.or]: [
      { expires_at: { [Op.lt]: new Date() } },
      { is_revoked: true }
    ]
  }
})
```

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
GET  /api/v1/auth/google
GET  /api/v1/auth/google/callback

### User Profile
POST  /api/v1/users/profile
PUT   /api/v1/users/profile
GET   /api/v1/users/profile
GET   /api/v1/users/profile/:userId
PATCH /api/v1/users/me/password

### Courses
GET    /api/v1/courses
GET    /api/v1/courses/:courseId
POST   /api/v1/courses
PUT    /api/v1/courses/:courseId
DELETE /api/v1/courses/:courseId
POST   /api/v1/courses/:courseId/submit
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
GET    /api/v1/lessons/:lessonId

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

### Wishlists
POST   /api/v1/wishlists/:courseId
DELETE /api/v1/wishlists/:courseId
GET    /api/v1/wishlists/me

### Job Board
GET    /api/v1/jobs
GET    /api/v1/jobs/:jobId
POST   /api/v1/jobs
PATCH  /api/v1/jobs/:jobId/apply

### Admin — Users
GET    /api/v1/admin/users
PATCH  /api/v1/admin/users/:userId/block
PATCH  /api/v1/admin/users/:userId/unblock

### Admin — Courses
GET    /api/v1/admin/courses
PATCH  /api/v1/admin/courses/:courseId/publish
PATCH  /api/v1/admin/courses/:courseId/reject

### Admin — Payouts
GET    /api/v1/admin/payouts
PATCH  /api/v1/admin/payouts/:payoutId/approve
PATCH  /api/v1/admin/payouts/:payoutId/reject

### Admin — Job Board
GET    /api/v1/admin/jobs
PATCH  /api/v1/admin/jobs/:jobId/publish
PATCH  /api/v1/admin/jobs/:jobId/reject
DELETE /api/v1/admin/jobs/:jobId

### Teacher Dashboard
GET    /api/v1/teachers/me/dashboard

---

## Key Business Rules

### Commission
- Platform takes 40% commission
- Teacher receives 60%
- Always store both values in payments table

### Course Status Flow
draft → (teacher submits) → pending_review → (admin approves) → published
→ (admin rejects)  → rejected → (teacher edits) → draft
published → (teacher archives) → archived
- Only published courses visible to students
- Teacher submits via POST /api/v1/courses/:courseId/submit
- Admin approves via PATCH /api/v1/admin/courses/:courseId/publish
- Admin rejects via PATCH /api/v1/admin/courses/:courseId/reject (must include rejected_reason)

### Who Can Create Courses
- Any user with role = 'user' can create a course
- No special role needed — platform is open to teachers
- Course goes through admin review before publishing

### Enrollment
- Free courses (price = 0) → enroll immediately, no payment needed
- Paid courses → need confirmed payment first
- Create course_progress row on enrollment
- Student cannot enroll twice in same course

### Progress
- percentage = (completed_lessons / total_lessons) * 100
- When percentage = 100 → set is_completed = true
- Update last_position_secs every time student watches
- Update lastLessonId on course_progress every time lesson is watched
- Update last_accessed on course_progress on every lesson watch

### Quiz
- Passing score = 70% hardcoded in backend
- Compare student answers against correct_answer field
- After passing final quiz → check all lessons complete → auto generate certificate

### Certificate
- Only generate when ALL lessons complete AND final quiz passed
- Always generate unique verification_id (use UUID or nanoid)
- Store issued_at timestamp

### Teacher Payout
- Calculated monthly by admin
- Admin manually transfers to teacher ABA account
- Admin uploads receipt_url as proof
- Admin clicks Approve → status changes to paid
- Teacher downloads receipt from payment history

### Job Board Flow
HR posts job (via form or Telegram bot)
→ status: pending_review
→ Admin reviews and clicks Publish → status: published → visible to students
→ Admin rejects → status: rejected
- Apply Now button opens mailto: contact_email (no tracking needed)
- Telegram bot calls POST /api/v1/jobs with source: 'telegram_bot'

### Wishlist
- User can add/remove courses from wishlist
- Unique constraint on (userId, courseId) prevents duplicates
- Shown in My Learning → Favorite tab

### Refresh Token
- On logout → set is_revoked = true (do NOT delete)
- On login → delete all expired or revoked tokens for that user first
- Tokens expire after 7 days

---

## Important Conventions

### Error Response
```javascript
res.status(500).json({ messageError: error.message })
```

### Success Response
```javascript
res.status(200).json({ message: 'Success', data })
res.status(201).json({ message: 'Created successfully', data })
```

### Migration Commands
```bash
npx sequelize-cli migration:generate --name migration-name
npm run migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:migrate:undo:all
```

### Model Naming
- Class: PascalCase → User, UserProfile, Course
- modelName: PascalCase → 'User', 'UserProfile'
- tableName: snake_case plural → 'users', 'user_profiles'

### Cloudinary Folders
- Profile pictures → plovdev/profiles
- Course thumbnails → plovdev/thumbnails
- Lesson videos → plovdev/videos
- Receipts → plovdev/receipts
- KHQR images → plovdev/profiles

### Number Parsing from form-data
```javascript
const parsedPrice = price ? parseFloat(price) : 0
const parsedPosition = position ? parseInt(position) : 1
```

### Create Then Fetch Pattern
```javascript
await Model.create({ ...data })
const result = await Model.findOne({
  where: { id: newRecord.id },
  include: [...]
})
```

### Ownership Check
```javascript
// user owns resource
const resource = await Model.findOne({
  where: { id: resourceId, userId: req.user.id }
})

// admin can access any resource
const resource = await Model.findOne({
  where: req.user.role === 'admin'
    ? { id: resourceId }
    : { id: resourceId, teacherId: req.user.id }
})
```

### Always Exclude Password
```javascript
attributes: { exclude: ['password'] }
```

### total_duration_secs Update
When a lesson is created, updated, or deleted — always update courses.total_duration_secs:
```javascript
const totalDuration = await lessons.sum('duration_secs', {
  include: [{ model: sections, as: 'section', where: { courseId } }]
})
await courses.update({ total_duration_secs: totalDuration }, { where: { id: courseId } })
```

---

## Do NOT Do These
- Never install new packages without asking
- Never change existing migration files that already ran
- Never use `model: ModelName` in migrations — use `model: 'TableName'` string
- Never return password in any response
- Never skip error handling
- Never hardcode values — always use environment variables
- Never change the response format — always use `messageError` for server errors
- Never mix PUT and PATCH — use PUT for full replace, PATCH for partial update
- Never forget to delete old Cloudinary files before uploading new ones
- Never create a profile without checking if one already exists
- Never expose videoUrl to non-enrolled students
- Never show unpublished courses to students