# Backend

The frontend in this project is fully interactive on its own: it uses the
browser's `localStorage`/`sessionStorage` as a stand-in database (see
`frontend/js/app.js`), so every page — registration, login, enrollment,
progress tracking, certificates — works without a server.

When you're ready to move to a real backend, this folder is where it goes.
Suggested structure for a Node.js/Express + MongoDB implementation that
mirrors the data model already used on the frontend:

```
backend/
  server.js
  config/
    db.js
  routes/
    authRoutes.js          -> register, login, forgot/reset password
    courseRoutes.js        -> CRUD for courses (admin)
    enrollmentRoutes.js     -> enroll, list my courses, toggle module complete
    progressRoutes.js       -> progress % per course
    notificationRoutes.js   -> list/mark-read notifications
  controllers/
  models/
    Student.js
    Course.js
    Enrollment.js
    Notification.js
  middleware/
    authMiddleware.js       -> JWT verification, admin guard
```

Each function in `frontend/js/app.js` under `Students`, `Courses`,
`Enrollments`, and `Notifications` maps directly to one of these routes —
swap the `localStorage` calls for `fetch()` calls to the API and the page
controllers (`PAGES.*`) don't need to change.
