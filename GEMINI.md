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
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url
FRONTEND_URL=your_frontend_url

## Project Structure
backend/
├── CONTEXT.md
├── RULES.md
├── config/
│   ├── cloudinary.js
│   └── db.js
├── controller/
│   ├── Auth.controller.js
│   ├── Course.controller.js
│   ├── Section.controller.js
│   ├── Lesson.controller.js
│   ├── Categories.controller.js
│   ├── Enrollments.controller.js
│   ├── Payment.controller.js
│   ├── Progress.controller.js
│   ├── Quiz.controller.js
│   ├── Certificate.controller.js
│   ├── review.controller.js
│   ├── Ra.controller.js
│   ├── Job.controller.js
│   ├── Admin.controller.js
│   └── UserProfile.controller.js
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
│   ├── Auth.routes.js
│   ├── Course.routes.js
│   ├── Section.routes.js
│   ├── Lesson.routes.js
│   ├── Categories.routes.js
│   ├── Enrollment.routes.js
│   ├── Payment.routes.js
│   ├── Progress.routes.js
│   ├── Quiz.routes.js
│   ├── Certificate.routes.js
│   ├── Review.routes.js
│   ├── Qa.routes.js
│   ├── Job.routes.js
│   ├── Admin.routes.js
│   └── UserProfile.routes.js
├── utils/
│   ├── generateForUser.js
│   ├── multer.js
│   ├── sendEmail.js
│   └── uploadToCloudinary.js
└── migrations/

---

## Database Tables (23 tables)

### Group 1 — Users & Auth (4 tables)

**Users**
id, fullName, userName, email, phoneNumber, password, gender (male, female, other), google_id, auth_provider (local, google), is_verified, is_active, is_blocked, role (admin, user), createdAt, updatedAt

**user_profiles** — one-to-one with Users
id, profileUrl, profilePublicId, bio, yearsExp, commissionRate, avgRating, total_students, accountName, accountNumber, khqr_url, khqr_publicId, is_verified, github_url, userId, createdAt, updatedAt

**OtpCode**
id, code, expireAt, is_used, userId, createdAt, updatedAt

**refreshTokens**
id, token, expireAt, userId, is_revoked, createdAt, updatedAt

---

### Group 2 — Courses & Content (7 tables)

**courses**
id, title_en, description, what_you_learn, archievedAt, thumbnailUrl, price, original_price, is_best_seller, thumbnailPublicId, avgRating, totalStudents, totalReview, total_duration_secs, status (draft, pending review, published, archived, rejected), teacherId, rejected_reason, createdAt, updatedAt

**sections**
id, title, position, courseId, createdAt, updatedAt

**lessons**
id, title, videoUrl, videoPublicId, duration_secs, is_free_preview, position, sectionId, createdAt, updatedAt

**categories**
id, name, iconUrl, createdAt, updatedAt

**course_categories** — junction table
id, title, courseId, categoryId, createdAt, updatedAt

**Quiz**
id, title, courseId, sectionId, createdAt, updatedAt

**QuizQuestion**
id, question, options (JSONB), correct_answer, explanation, position, quizId, createdAt, updatedAt

---

### Group 3 — Enrollment & Payments (3 tables)

**enrollments**
id, enrollmentAt, isCompleted, completeAt, userId, courseId, createdAt, updatedAt

**payments**
id, amount, commission, teacherPayout, status, transaction_id, paid_at, payment_method, is_refunded, refundedAt, userId, courseId, createdAt, updatedAt

**TeacherPayout**
id, periodMonth, totalEarned, commissionDeducted, netPayout, status, payment_method, receipt_url, paidAt, teacherId, createdAt, updatedAt

---

### Group 4 — Learning Progress (4 tables)

**LessonProgress**
id, is_complete, last_position_secs, completedAt, userId, lessonId, createdAt, updatedAt

**course_progress**
id, total_lessons, completed_lessons, percentage, is_completed, last_accessed, complete_at, userId, courseId, lastLessonId, createdAt, updatedAt

**QuizAttempt**
id, answers (JSONB), passed, attempt_at, userId, quizId, createdAt, updatedAt

**Certificate**
id, verification_id, issued_at, userId, courseId, createdAt, updatedAt

---

### Group 5 — Community (4 tables)

**Review**
id, rating, body, userId, courseId, createdAt, updatedAt

**QaPost**
id, body, is_answered, lessonId, userId, createdAt, updatedAt

**QaReply**
id, body, postId, userId, createdAt, updatedAt

**Wishlist** — junction table
id, userId, courseId, createdAt, updatedAt

---

### Group 6 — Job Board (1 table)

**JobListing**
id, company_name, hr_name, title, emp_type, description, location, salary_min, salary_max, skills (JSONB), contact_email, apply, source, applicants, rejectedAt, publishedAt, status (pending review, published, rejected), open_positions, company_logo, expires_at, createdAt, updatedAt

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
- No special role needed — any user can become a creator (there are no 'teacher' or 'student' roles in the system, only 'user' and 'admin').
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

### Swagger Documentation
We use \`swagger-autogen\` to generate API documentation. Every route definition must include the corresponding swagger tag as an inline comment so it appears in the correct group.
Example:
\`\`\`javascript
router.post('/auth/register', /* #swagger.tags = ['Auth'] */ register);
\`\`\`

### Error Response
We use a global error handler setup in `server.js` and `src/utils/appError.js`. Avoid writing repetitive try-catch blocks in your controllers; instead, use an async wrapper or `next(error)`.

```javascript
const AppError = require('../utils/appError');

throw new AppError("Invalid email or password", 400); // Bad Request
throw new AppError("Resource not found", 404); // Not Found
// or if you must use try-catch:
// catch (error) { next(error); }
```

### Success Response
```javascript
res.status(200).json({ status: 'success', message: 'Success', data })
res.status(201).json({ status: 'success', message: 'Created successfully', data })
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

### Cloudinary Folders & Media Formatting
- Profile pictures → plovdev/profiles (Format: `webp`)
- Course thumbnails → plovdev/thumbnails (Format: `webp`)
- Lesson videos → plovdev/videos (Format: `auto`, Quality: `auto`)
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
- Never use repetitive try-catch blocks without leveraging the global error handler
- Never hardcode values — always use environment variables
- Never change the response format — always throw `AppError` for server errors
- Never mix PUT and PATCH — use PUT for full replace, PATCH for partial update
- Never forget to delete old Cloudinary files before uploading new ones
- Never create a profile without checking if one already exists
- Never expose videoUrl to non-enrolled students
- Never show unpublished courses to students