# Certificate Generation & Verification Flow

![PlovDev Certificate Mockup](/Users/anbschool0027/.gemini/antigravity/brain/ceb21477-411f-4ac8-bcb8-5e3c4889b1c2/plovdev_certificate_modern_1779768308465.png)

This documentation explains how the certificate logic, database schema, trigger flow, and APIs are implemented in the backend.

---

## 1. Flow Overview
Certificates are automatically issued when a student satisfies **both** of the following requirements:
1. **100% Course Progress:** All lessons in the course are marked as complete.
2. **Passed the Final Quiz:** The student has achieved a passing score ($\ge$ 70%) on the course's final quiz (where `sectionId` is `null`).

Because students can complete these two steps in any order, the backend checks and generates the certificate on **two separate triggers**:

```
[Student completes last lesson] ------> [Check: 100% progress & Final quiz passed?]
                                                      |
                                                      |--> (If Yes & No Certificate exists)
                                                      |    Generate UUID verification_id
                                                      |    Save Certificate in Database
                                                      |
[Student passes final quiz] ----------> [Check: 100% progress & Final quiz passed?]
```

---

## 2. API Endpoints

### **Get My Certificates** (Protected)
* **Endpoint:** `GET /api/v1/certificates/me`
* **Controller:** `getMyCertificates`
* **Access:** Enrolled students
* **Description:** Retrieves all certificates issued to the currently logged-in student, including course title and thumbnail.

### **Verify Certificate** (Public)
* **Endpoint:** `GET /api/v1/certificates/verify/:verificationId`
* **Controller:** `verifyCertificate`
* **Access:** Public (no auth required)
* **Description:** Used by recruiters, LinkedIn viewers, etc. to verify the authenticity of a certificate. Returns the student's name, course details, and issued date.

---

## 3. Database Schema
* **`courses`**: Used to identify the course and sections.
* **`course_progress`**: Tracks total/completed lessons and completion state (`is_completed: true`).
* **`quizzes` / `quiz_attempts`**: Matches final exam quiz (where `sectionId` is `null`) and searches for attempts where `passed: true`.
* **`certificates`**: Stores the generated certificate mapping:
  * `verification_id` (UUID v4)
  * `issued_at` (Timestamp)
  * `userId` (FK to Users)
  * `courseId` (FK to courses)

---

## 4. Trigger Code Implementation Locations

### **Trigger A: Lesson Toggle Controller**
* **File:** `src/controller/CourseProgress.controller.js`
* **Behavior:** When a lesson completion state is toggled and the overall course progress hits 100%, the controller queries the database for the final quiz attempt. If passed, it generates the certificate and returns it in the response payload.

### **Trigger B: Quiz Attempt Controller**
* **File:** `src/controller/Quiz.controller.js`
* **Behavior:** When a student passes the final exam quiz (where `sectionId` is `null`), the controller checks if the course progress is already 100%. If so, it generates the certificate and returns it in the response payload.

---

## 5. Frontend PDF Generation Guide (Option A)
Since this implementation uses client-side rendering for PDFs:
1. When the frontend receives `certificateGenerated: true` from the backend API, it redirects the user to `/certificates/verify/:verificationId`.
2. The page fetches details from `GET /api/v1/certificates/verify/:verificationId`.
3. The frontend renders a premium certificate layout.
4. The frontend runs `html2pdf().from(certificateElement).save()` to download it as a local landscape A4 PDF.
