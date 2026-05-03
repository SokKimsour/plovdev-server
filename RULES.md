# PlovDev Backend — Gemini CLI Rules

## IMPORTANT — Read This First
Before writing any code, always read these files:
1. CONTEXT.md
2. Any existing controller file related to the task
3. Any model file related to the task

Never assume anything about the project. Always read the files first.
When finish the flow of each endpoints for one table, you have to tell me so i have to review or read to understand the code.
Payments and Enrollment tables and endpoint I will handle it.

---

## Tech Stack
- Runtime: Node.js
- Framework: Express.js
- ORM: Sequelize
- Database: PostgreSQL (running in Docker)
- Authentication: JWT
- File Storage: Cloudinary
- Email: Nodemailer

---

## Project Structure
src/
├── config/
│   ├── cloudinary.js
│   └── db.js
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
└── migrations/

---

## Database Rules

### Migration Commands
- Generate migration: `npx sequelize-cli migration:generate --name migration-name`
- Run migration: `npm run migrate`
- Undo migration: `npx sequelize-cli db:migrate:undo`
- Undo all: `npx sequelize-cli db:migrate:undo:all`

### Migration Rules
- NEVER use `model: ModelName` inside migrations — always use `model: 'TableName'` as a string
- Always add `onDelete: 'CASCADE'` and `onUpdate: 'CASCADE'` on foreign keys
- Always add `allowNull: false` on required fields
- Always add `unique: true` on unique fields
- Table names are plural and snake_case: `users`, `teacher_profiles`, `course_tags`
- Always include `createdAt` and `updatedAt` in every migration

### Migration Template
```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('table_name', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // columns here
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('table_name')
  }
}
```

### Model Rules
- Model class name: PascalCase (`User`, `TeacherProfile`, `Course`)
- modelName: PascalCase (`'User'`, `'TeacherProfile'`)
- tableName: snake_case plural (`'users'`, `'teacher_profiles'`)
- Always define `tableName` explicitly in model
- Always define associations in `static associate(models)`
- Use `this` instead of class name inside associate
- Never return `password` field — always exclude it
- One-to-one relationships must have `unique: true` on foreign key

### Model Template
```javascript
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ModelName extends Model {
    static associate(models) {
      // define associations here
    }
  }

  ModelName.init({
    // columns here (no need for id, createdAt, updatedAt — Sequelize adds automatically)
  }, {
    sequelize,
    modelName: 'ModelName',
    tableName: 'table_name',
  })

  return ModelName
}
```

---

## API Rules

### Route Naming
- All routes prefixed with `/api/v1`
- Use plural nouns: `/courses` not `/course`
- Use kebab-case: `/teacher-profiles` not `/teacherProfiles`
- Use nested routes for relationships: `/courses/:courseId/sections`

### HTTP Methods
- `GET` — retrieve data
- `POST` — create new data
- `PUT` — replace entire resource
- `PATCH` — update partial resource
- `DELETE` — delete resource

### Middleware Order
```javascript
router.method('/path', authenticateToken, isRole, upload.single('field'), controller)
```

### Available Middlewares
- `authenticateToken` — verifies JWT token, adds `req.user`
- `isTeacher` — checks `req.user.role === 'teacher'`
- `isAdmin` — checks `req.user.role === 'admin'`
- `isStudent` — checks `req.user.role === 'student'`
- `isTeacherOrAdmin` — checks teacher or admin role

---

## Controller Rules

### Controller Structure
Every controller must follow this exact pattern:

```javascript
const functionName = async (req, res) => {
  try {
    // 1. Get user info from JWT
    const userId = req.user.id

    // 2. Check role if needed (if not using middleware)

    // 3. Get params and body
    const { param } = req.params
    const { field1, field2 } = req.body

    // 4. Validate required fields
    if (!field1) {
      return res.status(400).json({ message: 'Field1 is required!' })
    }

    // 5. Business logic

    // 6. Return response
    res.status(200).json({
      message: 'Success message',
      data: result
    })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}
```

### Response Format
```javascript
// Success
res.status(200).json({ message: 'Success', data })
res.status(201).json({ message: 'Created successfully', data }) // create

// Error
res.status(400).json({ message: 'Bad request message' })       // validation
res.status(401).json({ message: 'Unauthorized!' })              // no token
res.status(403).json({ message: 'Access denied!' })             // wrong role
res.status(404).json({ message: 'Resource not found!' })        // not found
res.status(500).json({ messageError: error.message })           // server error
```

### Ownership Check
Teacher can only modify their own resources:
```javascript
const resource = await Model.findOne({
  where: { id: resourceId, teacherId: req.user.id }
})
if (!resource) {
  return res.status(404).json({ message: 'Resource not found!' })
}
```

Admin can modify any resource:
```javascript
const resource = await Model.findOne({
  where: req.user.role === 'admin'
    ? { id: resourceId }
    : { id: resourceId, teacherId: req.user.id }
})
```

---

## Cloudinary Rules

### Upload Image
```javascript
const result = await uploadBufferImageToCloudinary(req.file.buffer, {
  folder: 'plovdev/profiles',    // or thumbnails
  resource_type: 'image'
})
const imageUrl = result.secure_url
const imagePublicId = result.public_id
```

### Upload Video
```javascript
const result = await uploadVideoToCloudinary(req.file.buffer, {
  folder: 'plovdev/videos'
})
const videoUrl = result.secure_url
const videoPublicId = result.public_id
```

### Delete File
```javascript
if (resource.publicId) {
  await cloudinary.uploader.destroy(resource.publicId)
}
```

### Folder Structure
- Profile pictures: `plovdev/profiles`
- Course thumbnails: `plovdev/thumbnails`
- Lesson videos: `plovdev/videos`
- Receipts → plovdev/receipts
- KHQR images → plovdev/profiles

### Always Save PublicId
Every table that stores a Cloudinary URL must also store the `publicId` for deletion.

---

## Sequelize Query Rules

### Always exclude password
```javascript
attributes: { exclude: ['password'] }
// or specify exact fields
attributes: ['id', 'fullName', 'userName', 'email']
```

### Include associations
```javascript
include: [{
  model: Users,
  as: 'user',           // must match 'as' in model association
  attributes: ['id', 'fullName', 'userName']
}]
```

### findOne vs findByPk
```javascript
// use findByPk when you have the primary key
const course = await courses.findByPk(courseId)

// use findOne when you have other conditions
const course = await courses.findOne({ where: { teacherId, id: courseId } })
```

### Create then fetch pattern
Sequelize `create` does not support `include`. Always fetch after create:
```javascript
await Model.create({ ...data })

const result = await Model.findOne({
  where: { id: newRecord.id },
  include: [...]
})
```

### Parse numbers from form-data
```javascript
const parsedPrice = price ? parseFloat(price) : 0
const parsedPosition = position ? parseInt(position) : 1
```

---

## File Upload Rules

### Multer setup
```javascript
const upload = require('../utils/multer')

// single file
upload.single('fieldName')

// field name must match Postman key name
```

### When to use upload middleware
- Profile picture update → `upload.single('file')`
- Course thumbnail → `upload.single('thumbnail')`
- Lesson video → `upload.single('video')`

---

## Important Business Rules

### Commission
- Platform takes 40% commission
- Teacher receives 60%
- Always store both values in payments table

### Course Status Flow
- New courses start as status: 'draft'
- Teacher submits for review → status: 'pending_review'
- Admin approves → status: 'published'
- Admin rejects → status: 'rejected'
- Teacher can archive published course → status: 'archived'
- Only published courses show to students

### Enrollment
- Free courses (price = 0) → enroll immediately
- Paid courses → need confirmed payment first
- Create `course_progress` row on enrollment
- Student cannot enroll twice in same course

### Progress
- `percentage = (completed_lessons / total_lessons) * 100`
- When `percentage = 100` → set `is_completed = true`
- Update `course_progress` every time a lesson is completed

### Quiz
- Passing score = 70%
- Store answers as JSONB
- Compare against `correct_answer` field
- After passing final quiz → check if all lessons done → generate certificate

### Certificate
- Only generate when ALL lessons complete AND final quiz passed
- Always generate unique `verification_id`
- Store `issued_at` timestamp

---

## Do NOT Do These
- Never install new packages without asking
- Never change existing migration files that already ran
- Never use `model: ModelName` in migrations — use `model: 'TableName'` string
- Never return password in any response
- Never skip error handling
- Never hardcode values — always use environment variables
- Never change the response format — always use `messageError` for errors
- Never mix `PUT` and `PATCH` — use only`PUT` for partial updates because postgres understand this one
- Never forget to delete old Cloudinary files before uploading new ones
- Never create a user profile without checking if one already exists