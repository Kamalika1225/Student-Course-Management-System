/* ==========================================================
   Student Course Management & Learning Progress Tracking
   Core application logic (client-side data layer)

   Persistence: localStorage simulates the database so the
   whole system runs from static files with no server needed.
   Swap the LS.* functions for real fetch() calls to a backend
   API later without touching the page controllers below.
   ========================================================== */

const LS_KEYS = {
  students: "scms.students",
  courses: "scms.courses",
  enrollments: "scms.enrollments",
  notifications: "scms.notifications",
  seeded: "scms.seeded",
};

const SESSION_KEY = "scms.session";
const ADMIN_ACCOUNT = { email: "admin@campus.edu", password: "admin123", name: "Registrar Office" };

/* ---------- low level storage helpers ---------- */
const LS = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

function todayISO() {
  return new Date().toISOString();
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/* ---------- seed data ---------- */
function seedIfNeeded() {
  if (LS.get(LS_KEYS.seeded, false)) return;

  const courses = [
    {
      id: "crs-fullstack",
      code: "WEB-201",
      name: "Full Stack Web Development",
      instructor: "Priya Nair",
      duration: 12,
      category: "Web Development",
      description:
        "Build complete web applications end to end: semantic HTML, modern CSS, JavaScript, React on the front end, and Node.js with MongoDB on the back end.",
      modules: [
        { id: "m1", title: "HTML Fundamentals", type: "reading", duration: "45 min", content: "Structure content with semantic HTML5: headings, sections, forms, and accessibility basics." },
        { id: "m2", title: "CSS & Layout", type: "reading", duration: "60 min", content: "Flexbox, Grid, responsive breakpoints, and building a design system from scratch." },
        { id: "m3", title: "JavaScript Essentials", type: "video", duration: "50 min", content: "Variables, functions, DOM manipulation, and events." },
        { id: "m4", title: "React Basics", type: "video", duration: "55 min", content: "Components, props, state, and hooks." },
        { id: "m5", title: "Node.js & Express", type: "reading", duration: "40 min", content: "Building REST APIs, routing, and middleware." },
        { id: "m6", title: "MongoDB & Data", type: "reading", duration: "35 min", content: "Documents, collections, and connecting a database to an API." },
      ],
    },
    {
      id: "crs-python",
      code: "PROG-110",
      name: "Python Programming",
      instructor: "Arjun Mehta",
      duration: 8,
      category: "Programming",
      description: "A hands-on introduction to Python: syntax, data structures, file handling, and object-oriented programming.",
      modules: [
        { id: "m1", title: "Python Basics", type: "reading", duration: "30 min", content: "Variables, data types, and control flow." },
        { id: "m2", title: "Data Structures", type: "reading", duration: "40 min", content: "Lists, tuples, dictionaries, and sets." },
        { id: "m3", title: "File Handling", type: "video", duration: "25 min", content: "Reading and writing files safely." },
        { id: "m4", title: "Object-Oriented Python", type: "video", duration: "45 min", content: "Classes, objects, and inheritance." },
      ],
    },
    {
      id: "crs-react",
      code: "WEB-215",
      name: "React for Beginners",
      instructor: "Sara Liu",
      duration: 6,
      category: "Web Development",
      description: "Learn to build interactive user interfaces with React: components, state management, and client-side routing.",
      modules: [
        { id: "m1", title: "JSX & Components", type: "reading", duration: "30 min", content: "Writing components and composing UI with JSX." },
        { id: "m2", title: "State & Props", type: "video", duration: "35 min", content: "Passing data and managing local state." },
        { id: "m3", title: "Hooks", type: "video", duration: "40 min", content: "useState, useEffect, and custom hooks." },
        { id: "m4", title: "Routing", type: "reading", duration: "25 min", content: "Client-side navigation with React Router." },
      ],
    },
    {
      id: "crs-dbms",
      code: "DATA-130",
      name: "Database Management Systems",
      instructor: "Karan Shah",
      duration: 10,
      category: "Data",
      description: "Core database concepts: entity-relationship modeling, SQL, normalization, transactions, and indexing.",
      modules: [
        { id: "m1", title: "ER Modeling", type: "reading", duration: "35 min", content: "Entities, relationships, and schema design." },
        { id: "m2", title: "SQL Basics", type: "video", duration: "45 min", content: "SELECT, JOIN, and aggregate queries." },
        { id: "m3", title: "Normalization", type: "reading", duration: "30 min", content: "1NF through 3NF and why they matter." },
        { id: "m4", title: "Transactions & Indexing", type: "reading", duration: "40 min", content: "ACID properties and query performance." },
      ],
    },
  ];

  LS.set(LS_KEYS.courses, courses);
  LS.set(LS_KEYS.students, []);
  LS.set(LS_KEYS.enrollments, []);
  LS.set(LS_KEYS.notifications, []);
  LS.set(LS_KEYS.seeded, true);
}

/* ---------- data accessors ---------- */
const Students = {
  all: () => LS.get(LS_KEYS.students, []),
  save: (list) => LS.set(LS_KEYS.students, list),
  byEmail: (email) => Students.all().find((s) => s.email.toLowerCase() === email.toLowerCase()),
  byId: (id) => Students.all().find((s) => s.id === id),
  add: (student) => {
    const list = Students.all();
    list.push(student);
    Students.save(list);
  },
  update: (id, patch) => {
    const list = Students.all().map((s) => (s.id === id ? { ...s, ...patch } : s));
    Students.save(list);
  },
};

const Courses = {
  all: () => LS.get(LS_KEYS.courses, []),
  save: (list) => LS.set(LS_KEYS.courses, list),
  byId: (id) => Courses.all().find((c) => c.id === id),
  add: (course) => {
    const list = Courses.all();
    list.push(course);
    Courses.save(list);
  },
  update: (id, patch) => {
    const list = Courses.all().map((c) => (c.id === id ? { ...c, ...patch } : c));
    Courses.save(list);
  },
  remove: (id) => {
    Courses.save(Courses.all().filter((c) => c.id !== id));
  },
};

const Enrollments = {
  all: () => LS.get(LS_KEYS.enrollments, []),
  save: (list) => LS.set(LS_KEYS.enrollments, list),
  forStudent: (studentId) => Enrollments.all().filter((e) => e.studentId === studentId),
  forCourse: (courseId) => Enrollments.all().filter((e) => e.courseId === courseId),
  find: (studentId, courseId) => Enrollments.all().find((e) => e.studentId === studentId && e.courseId === courseId),
  enroll: (studentId, courseId) => {
    if (Enrollments.find(studentId, courseId)) return false;
    const list = Enrollments.all();
    list.push({ studentId, courseId, enrolledAt: todayISO(), completedModules: [] });
    Enrollments.save(list);
    return true;
  },
  toggleModule: (studentId, courseId, moduleId) => {
    const list = Enrollments.all();
    const e = list.find((x) => x.studentId === studentId && x.courseId === courseId);
    if (!e) return;
    const i = e.completedModules.indexOf(moduleId);
    if (i === -1) e.completedModules.push(moduleId);
    else e.completedModules.splice(i, 1);
    Enrollments.save(list);
  },
};

const Notifications = {
  all: () => LS.get(LS_KEYS.notifications, []),
  save: (list) => LS.set(LS_KEYS.notifications, list),
  forStudent: (studentId) =>
    Notifications.all()
      .filter((n) => n.studentId === studentId)
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
  add: (studentId, message) => {
    const list = Notifications.all();
    list.push({ id: uid("ntf"), studentId, message, date: todayISO(), read: false });
    Notifications.save(list);
  },
  markRead: (id) => {
    const list = Notifications.all().map((n) => (n.id === id ? { ...n, read: true } : n));
    Notifications.save(list);
  },
  unreadCount: (studentId) => Notifications.forStudent(studentId).filter((n) => !n.read).length,
};

/* ---------- progress helpers ---------- */
function courseProgress(studentId, courseId) {
  const course = Courses.byId(courseId);
  const enrollment = Enrollments.find(studentId, courseId);
  if (!course || !enrollment) return { percent: 0, completed: 0, total: 0 };
  const total = course.modules.length;
  const completed = enrollment.completedModules.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { percent, completed, total };
}

/* ---------- session / auth ---------- */
const Session = {
  get: () => JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"),
  set: (session) => sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)),
  clear: () => sessionStorage.removeItem(SESSION_KEY),
};

function requireStudent() {
  const s = Session.get();
  if (!s || s.type !== "student") {
    window.location.href = "login.html";
    return null;
  }
  return s;
}

function requireAdmin() {
  const s = Session.get();
  if (!s || s.type !== "admin") {
    window.location.href = "login.html";
    return null;
  }
  return s;
}

/* ---------- shared chrome: header nav ---------- */
function renderNav() {
  const mount = document.getElementById("site-nav");
  if (!mount) return;
  const session = Session.get();

  let links = [];
  if (!session) {
    links = [
      ["index.html", "Home"],
      ["browse-courses.html", "Browse Courses"],
      ["login.html", "Log In"],
      ["register.html", "Register"],
    ];
  } else if (session.type === "student") {
    links = [
      ["student-dashboard.html", "Dashboard"],
      ["browse-courses.html", "Browse Courses"],
      ["my-courses.html", "My Courses"],
      ["progress.html", "Progress"],
      ["notifications.html", "Notifications"],
    ];
  } else if (session.type === "admin") {
    links = [
      ["admin-dashboard.html", "Dashboard"],
      ["courses.html", "Manage Courses"],
    ];
  }

  const linkHtml = links
    .map(([href, label]) => `<a href="${href}" class="${isCurrentPage(href) ? "active" : ""}">${label}</a>`)
    .join("");

  const identity = session
    ? `<span class="nav-user">${session.name}</span><button id="logout-btn" class="btn-ghost">Log Out</button>`
    : "";

  mount.innerHTML = `<div class="nav-links">${linkHtml}</div><div class="nav-identity">${identity}</div>`;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Session.clear();
      window.location.href = "index.html";
    });
  }
}

function isCurrentPage(href) {
  return window.location.pathname.endsWith(href);
}

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function toast(el, message, kind = "info") {
  if (!el) return;
  el.textContent = message;
  el.className = `form-message ${kind}`;
  el.hidden = false;
}

/* ==========================================================
   Page controllers — one per data-page value
   ========================================================== */
const PAGES = {};

PAGES.home = function () {
  const grid = document.getElementById("home-course-grid");
  if (!grid) return;
  const courses = Courses.all().slice(0, 3);
  grid.innerHTML = courses.map(courseCardHTML).join("");
};

PAGES.register = function () {
  const form = document.getElementById("register-form");
  const msg = document.getElementById("form-message");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const department = form.department.value.trim();

    if (!name || !email || !password || !department) {
      toast(msg, "Please fill in every field.", "error");
      return;
    }
    if (Students.byEmail(email)) {
      toast(msg, "An account with this email already exists.", "error");
      return;
    }
    Students.add({ id: uid("stu"), name, email, password, department, createdAt: todayISO() });
    toast(msg, "Account created. Redirecting to log in…", "success");
    setTimeout(() => (window.location.href = "login.html"), 900);
  });
};

PAGES.login = function () {
  const tabs = document.querySelectorAll(".login-tab");
  const studentForm = document.getElementById("student-login-form");
  const adminForm = document.getElementById("admin-login-form");
  const msg = document.getElementById("form-message");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const role = tab.dataset.role;
      studentForm.hidden = role !== "student";
      adminForm.hidden = role !== "admin";
      msg.hidden = true;
    });
  });

  studentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = studentForm.email.value.trim();
    const password = studentForm.password.value;
    const student = Students.byEmail(email);
    if (!student || student.password !== password) {
      toast(msg, "Email or password is incorrect.", "error");
      return;
    }
    Session.set({ type: "student", id: student.id, name: student.name, email: student.email });
    window.location.href = "student-dashboard.html";
  });

  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = adminForm.email.value.trim();
    const password = adminForm.password.value;
    if (email.toLowerCase() !== ADMIN_ACCOUNT.email || password !== ADMIN_ACCOUNT.password) {
      toast(msg, "Admin credentials are incorrect.", "error");
      return;
    }
    Session.set({ type: "admin", id: "admin", name: ADMIN_ACCOUNT.name, email: ADMIN_ACCOUNT.email });
    window.location.href = "admin-dashboard.html";
  });
};

PAGES["forgot-password"] = function () {
  const form = document.getElementById("forgot-form");
  const msg = document.getElementById("form-message");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!Students.byEmail(email)) {
      toast(msg, "No account found with that email.", "error");
      return;
    }
    toast(msg, "Identity confirmed. Redirecting to reset your password…", "success");
    setTimeout(() => (window.location.href = `reset-password.html?email=${encodeURIComponent(email)}`), 900);
  });
};

PAGES["reset-password"] = function () {
  const email = qs("email");
  const form = document.getElementById("reset-form");
  const msg = document.getElementById("form-message");
  const label = document.getElementById("reset-email-label");
  if (label) label.textContent = email || "your account";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const student = Students.byEmail(email || "");
    if (!student) {
      toast(msg, "This reset link is no longer valid.", "error");
      return;
    }
    const pw = form.password.value;
    const pw2 = form.confirmPassword.value;
    if (pw.length < 6) {
      toast(msg, "Password must be at least 6 characters.", "error");
      return;
    }
    if (pw !== pw2) {
      toast(msg, "Passwords do not match.", "error");
      return;
    }
    Students.update(student.id, { password: pw });
    toast(msg, "Password updated. Redirecting to log in…", "success");
    setTimeout(() => (window.location.href = "login.html"), 900);
  });
};

PAGES["admin-dashboard"] = function () {
  if (!requireAdmin()) return;
  const students = Students.all();
  const courses = Courses.all();
  const enrollments = Enrollments.all();

  document.getElementById("stat-students").textContent = students.length;
  document.getElementById("stat-courses").textContent = courses.length;
  document.getElementById("stat-enrollments").textContent = enrollments.length;

  const avgCompletion = enrollments.length
    ? Math.round(
        enrollments.reduce((sum, e) => sum + courseProgress(e.studentId, e.courseId).percent, 0) / enrollments.length
      )
    : 0;
  document.getElementById("stat-completion").textContent = `${avgCompletion}%`;

  const tbody = document.getElementById("recent-enrollments");
  const recent = [...enrollments].sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt)).slice(0, 6);
  tbody.innerHTML = recent
    .map((e) => {
      const student = Students.byId(e.studentId);
      const course = Courses.byId(e.courseId);
      const p = courseProgress(e.studentId, e.courseId);
      return `<tr>
        <td>${student ? student.name : "—"}</td>
        <td>${course ? course.name : "—"}</td>
        <td>${formatDate(e.enrolledAt)}</td>
        <td>${p.percent}%</td>
      </tr>`;
    })
    .join("") || `<tr><td colspan="4" class="empty-cell">No enrollments yet.</td></tr>`;
};

PAGES.courses = function () {
  if (!requireAdmin()) return;
  const tbody = document.getElementById("courses-table-body");

  function render() {
    const courses = Courses.all();
    tbody.innerHTML =
      courses
        .map(
          (c) => `<tr>
        <td><span class="code-chip">${c.code}</span></td>
        <td>${c.name}</td>
        <td>${c.instructor}</td>
        <td>${c.duration} wks</td>
        <td>${c.modules.length}</td>
        <td class="row-actions">
          <a href="edit-course.html?id=${c.id}" class="btn-ghost small">Edit</a>
          <button class="btn-ghost small danger" data-delete="${c.id}">Delete</button>
        </td>
      </tr>`
        )
        .join("") || `<tr><td colspan="6" class="empty-cell">No courses yet. Add your first one.</td></tr>`;

    tbody.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Delete this course? This cannot be undone.")) {
          Courses.remove(btn.dataset.delete);
          render();
        }
      });
    });
  }
  render();
};

PAGES["add-course"] = function () {
  if (!requireAdmin()) return;
  const form = document.getElementById("course-form");
  const msg = document.getElementById("form-message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const code = form.code.value.trim().toUpperCase();
    const instructor = form.instructor.value.trim();
    const duration = Number(form.duration.value);
    const category = form.category.value.trim();
    const description = form.description.value.trim();
    const moduleNames = form.modules.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!name || !code || !instructor || !duration || !category || !description || moduleNames.length === 0) {
      toast(msg, "Please complete every field, including at least one module.", "error");
      return;
    }

    const modules = moduleNames.map((title, i) => ({
      id: `m${i + 1}`,
      title,
      type: i % 2 === 0 ? "reading" : "video",
      duration: "30 min",
      content: `Content for ${title}.`,
    }));

    Courses.add({ id: uid("crs"), code, name, instructor, duration, category, description, modules });
    toast(msg, "Course added. Redirecting…", "success");
    setTimeout(() => (window.location.href = "courses.html"), 800);
  });
};

PAGES["edit-course"] = function () {
  if (!requireAdmin()) return;
  const id = qs("id");
  const course = Courses.byId(id);
  const msg = document.getElementById("form-message");
  if (!course) {
    toast(msg, "That course no longer exists.", "error");
    return;
  }
  const form = document.getElementById("course-form");
  form.name.value = course.name;
  form.code.value = course.code;
  form.instructor.value = course.instructor;
  form.duration.value = course.duration;
  form.category.value = course.category;
  form.description.value = course.description;
  form.modules.value = course.modules.map((m) => m.title).join(", ");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const moduleNames = form.modules.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const modules = moduleNames.map((title, i) => {
      const existing = course.modules[i];
      return existing
        ? { ...existing, title }
        : { id: `m${i + 1}`, title, type: "reading", duration: "30 min", content: `Content for ${title}.` };
    });

    Courses.update(course.id, {
      name: form.name.value.trim(),
      code: form.code.value.trim().toUpperCase(),
      instructor: form.instructor.value.trim(),
      duration: Number(form.duration.value),
      category: form.category.value.trim(),
      description: form.description.value.trim(),
      modules,
    });
    toast(msg, "Course updated.", "success");
    setTimeout(() => (window.location.href = "courses.html"), 800);
  });

  const deleteBtn = document.getElementById("delete-course-btn");
  deleteBtn.addEventListener("click", () => {
    if (confirm("Delete this course? This cannot be undone.")) {
      Courses.remove(course.id);
      window.location.href = "courses.html";
    }
  });
};

PAGES["course-details"] = function () {
  const id = qs("id");
  const course = Courses.byId(id);
  const container = document.getElementById("course-details-container");
  if (!course) {
    container.innerHTML = `<p class="empty-state">This course could not be found.</p>`;
    return;
  }

  document.getElementById("course-name").textContent = course.name;
  document.getElementById("course-code").textContent = course.code;
  document.getElementById("course-instructor").textContent = course.instructor;
  document.getElementById("course-duration").textContent = `${course.duration} weeks`;
  document.getElementById("course-category").textContent = course.category;
  document.getElementById("course-description").textContent = course.description;

  const moduleList = document.getElementById("course-module-list");
  moduleList.innerHTML = course.modules
    .map(
      (m, i) => `<li><span class="module-index">${String(i + 1).padStart(2, "0")}</span><span>${m.title}</span><span class="module-meta">${m.type} · ${m.duration}</span></li>`
    )
    .join("");

  const session = Session.get();
  const enrollBtn = document.getElementById("enroll-btn");
  const msg = document.getElementById("form-message");

  if (session && session.type === "student") {
    const already = Enrollments.find(session.id, course.id);
    if (already) {
      enrollBtn.textContent = "Go to Course Content";
      enrollBtn.addEventListener("click", () => (window.location.href = `course-content.html?id=${course.id}`));
    } else {
      enrollBtn.addEventListener("click", () => {
        Enrollments.enroll(session.id, course.id);
        Notifications.add(session.id, `You enrolled in ${course.name}.`);
        window.location.href = `enrollment-success.html?id=${course.id}`;
      });
    }
  } else {
    enrollBtn.textContent = "Log In to Enroll";
    enrollBtn.addEventListener("click", () => (window.location.href = "login.html"));
  }
};

PAGES["browse-courses"] = function () {
  const grid = document.getElementById("browse-grid");
  const searchInput = document.getElementById("course-search");
  const categorySelect = document.getElementById("category-filter");

  const courses = Courses.all();
  const categories = ["All Categories", ...new Set(courses.map((c) => c.category))];
  categorySelect.innerHTML = categories.map((c) => `<option value="${c}">${c}</option>`).join("");

  function render() {
    const term = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const filtered = courses.filter((c) => {
      const matchesTerm = !term || c.name.toLowerCase().includes(term) || c.instructor.toLowerCase().includes(term);
      const matchesCategory = category === "All Categories" || c.category === category;
      return matchesTerm && matchesCategory;
    });
    grid.innerHTML =
      filtered.map(courseCardHTML).join("") || `<p class="empty-state">No courses match your search.</p>`;
  }

  searchInput.addEventListener("input", render);
  categorySelect.addEventListener("change", render);
  render();
};

PAGES["my-courses"] = function () {
  const session = requireStudent();
  if (!session) return;
  const grid = document.getElementById("my-courses-grid");
  const enrollments = Enrollments.forStudent(session.id);

  if (enrollments.length === 0) {
    grid.innerHTML = `<p class="empty-state">You have not enrolled in any courses yet. <a href="browse-courses.html">Browse the catalog</a>.</p>`;
    return;
  }

  grid.innerHTML = enrollments
    .map((e) => {
      const course = Courses.byId(e.courseId);
      if (!course) return "";
      const p = courseProgress(session.id, course.id);
      return `<article class="card course-card">
        <div class="card-top">
          <span class="code-chip">${course.code}</span>
          <span class="category-chip">${course.category}</span>
        </div>
        <h3>${course.name}</h3>
        <p class="muted">${course.instructor} · ${course.duration} weeks</p>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${p.percent}%"></div></div>
        <p class="muted small">${p.completed} of ${p.total} modules complete</p>
        <a class="btn" href="course-content.html?id=${course.id}">Continue Learning</a>
      </article>`;
    })
    .join("");
};

PAGES["enrollment-success"] = function () {
  const id = qs("id");
  const course = Courses.byId(id);
  if (course) {
    document.getElementById("enrolled-course-name").textContent = course.name;
    document.getElementById("continue-link").href = `course-content.html?id=${course.id}`;
  }
};

PAGES["course-content"] = function () {
  const session = requireStudent();
  if (!session) return;
  const id = qs("id");
  const course = Courses.byId(id);
  const container = document.getElementById("course-content-container");
  if (!course || !Enrollments.find(session.id, course.id)) {
    container.innerHTML = `<p class="empty-state">You are not enrolled in this course. <a href="browse-courses.html">Browse courses</a>.</p>`;
    return;
  }

  document.getElementById("course-content-title").textContent = course.name;
  const p = courseProgress(session.id, course.id);
  document.getElementById("course-content-progress").textContent = `${p.percent}% complete`;
  document.getElementById("course-progress-fill").style.width = `${p.percent}%`;

  const enrollment = Enrollments.find(session.id, course.id);
  const list = document.getElementById("module-list");
  list.innerHTML = course.modules
    .map((m) => {
      const done = enrollment.completedModules.includes(m.id);
      const link = m.type === "video" ? `video-player.html?id=${course.id}&m=${m.id}` : `module.html?id=${course.id}&m=${m.id}`;
      return `<li class="module-row ${done ? "done" : ""}">
        <a href="${link}" class="module-link">
          <span class="module-status">${done ? "✓" : ""}</span>
          <span class="module-title">${m.title}</span>
          <span class="module-meta">${m.type} · ${m.duration}</span>
        </a>
      </li>`;
    })
    .join("");

  document.getElementById("materials-link").href = `materials.html?id=${course.id}`;
  document.getElementById("certificate-link").href = `certificate.html?id=${course.id}`;
};

PAGES.module = function () {
  const session = requireStudent();
  if (!session) return;
  const courseId = qs("id");
  const moduleId = qs("m");
  const course = Courses.byId(courseId);
  const mod = course ? course.modules.find((m) => m.id === moduleId) : null;
  const container = document.getElementById("module-container");

  if (!course || !mod || !Enrollments.find(session.id, course.id)) {
    container.innerHTML = `<p class="empty-state">This module is not available.</p>`;
    return;
  }

  document.getElementById("module-title").textContent = mod.title;
  document.getElementById("module-course-name").textContent = course.name;
  document.getElementById("module-body").textContent = mod.content;
  document.getElementById("module-duration").textContent = mod.duration;

  const enrollment = Enrollments.find(session.id, course.id);
  const done = enrollment.completedModules.includes(mod.id);
  const completeBtn = document.getElementById("complete-btn");
  updateCompleteBtn(completeBtn, done);

  completeBtn.addEventListener("click", () => {
    Enrollments.toggleModule(session.id, course.id, mod.id);
    const nowDone = Enrollments.find(session.id, course.id).completedModules.includes(mod.id);
    updateCompleteBtn(completeBtn, nowDone);
    const p = courseProgress(session.id, course.id);
    if (nowDone && p.percent === 100) {
      Notifications.add(session.id, `You completed ${course.name}. Your certificate is ready.`);
    }
  });

  document.getElementById("back-to-course-link").href = `course-content.html?id=${course.id}`;
};

function updateCompleteBtn(btn, done) {
  btn.textContent = done ? "Marked Complete ✓" : "Mark as Complete";
  btn.classList.toggle("btn-secondary", done);
}

PAGES["video-player"] = function () {
  const session = requireStudent();
  if (!session) return;
  const courseId = qs("id");
  const moduleId = qs("m");
  const course = Courses.byId(courseId);
  const mod = course ? course.modules.find((m) => m.id === moduleId) : null;
  const container = document.getElementById("video-container");

  if (!course || !mod || !Enrollments.find(session.id, course.id)) {
    container.innerHTML = `<p class="empty-state">This video is not available.</p>`;
    return;
  }

  document.getElementById("video-title").textContent = mod.title;
  document.getElementById("video-course-name").textContent = course.name;

  const enrollment = Enrollments.find(session.id, course.id);
  const done = enrollment.completedModules.includes(mod.id);
  const completeBtn = document.getElementById("complete-btn");
  updateCompleteBtn(completeBtn, done);

  completeBtn.addEventListener("click", () => {
    Enrollments.toggleModule(session.id, course.id, mod.id);
    const nowDone = Enrollments.find(session.id, course.id).completedModules.includes(mod.id);
    updateCompleteBtn(completeBtn, nowDone);
  });

  document.getElementById("back-to-course-link").href = `course-content.html?id=${course.id}`;
};

PAGES.materials = function () {
  const session = requireStudent();
  if (!session) return;
  const courseId = qs("id");
  const course = Courses.byId(courseId);
  const list = document.getElementById("materials-list");
  if (!course || !Enrollments.find(session.id, course.id)) {
    list.innerHTML = `<p class="empty-state">Materials are only available to enrolled students.</p>`;
    return;
  }
  document.getElementById("materials-course-name").textContent = course.name;
  list.innerHTML = course.modules
    .map(
      (m) => `<li class="material-row">
        <span class="module-title">${m.title} — slide notes</span>
        <button class="btn-ghost small" data-name="${m.title}">Download</button>
      </li>`
    )
    .join("");
  list.querySelectorAll("[data-name]").forEach((btn) => {
    btn.addEventListener("click", () => alert(`In a connected backend, this would download notes for "${btn.dataset.name}".`));
  });
};

PAGES.progress = function () {
  const session = requireStudent();
  if (!session) return;
  const grid = document.getElementById("progress-grid");
  const enrollments = Enrollments.forStudent(session.id);
  if (enrollments.length === 0) {
    grid.innerHTML = `<p class="empty-state">Enroll in a course to start tracking progress.</p>`;
    return;
  }
  grid.innerHTML = enrollments
    .map((e) => {
      const course = Courses.byId(e.courseId);
      if (!course) return "";
      const p = courseProgress(session.id, course.id);
      const pending = course.modules.filter((m) => !e.completedModules.includes(m.id));
      return `<article class="card">
        <div class="card-top">
          <span class="code-chip">${course.code}</span>
          <span class="mono">${p.percent}%</span>
        </div>
        <h3>${course.name}</h3>
        <div class="progress-bar"><div class="progress-bar-fill" style="width:${p.percent}%"></div></div>
        <p class="muted small">${p.completed} completed · ${pending.length} pending</p>
        ${p.percent === 100 ? `<a class="btn small" href="certificate.html?id=${course.id}">View Certificate</a>` : `<a class="btn-ghost small" href="course-content.html?id=${course.id}">Continue</a>`}
      </article>`;
    })
    .join("");
};

PAGES.certificate = function () {
  const session = requireStudent();
  if (!session) return;
  const courseId = qs("id");
  const course = Courses.byId(courseId);
  const container = document.getElementById("certificate-container");
  const p = course ? courseProgress(session.id, course.id) : { percent: 0 };

  if (!course || !Enrollments.find(session.id, course.id)) {
    container.innerHTML = `<p class="empty-state">Certificate not available for this course.</p>`;
    return;
  }
  if (p.percent < 100) {
    container.innerHTML = `<p class="empty-state">Complete all modules in <strong>${course.name}</strong> to unlock your certificate. You are at ${p.percent}%.</p>`;
    return;
  }

  document.getElementById("cert-student-name").textContent = session.name;
  document.getElementById("cert-course-name").textContent = course.name;
  document.getElementById("cert-date").textContent = formatDate(todayISO());
  document.getElementById("print-btn").addEventListener("click", () => window.print());
};

PAGES["student-dashboard"] = function () {
  const session = requireStudent();
  if (!session) return;
  document.getElementById("welcome-name").textContent = session.name.split(" ")[0];

  const enrollments = Enrollments.forStudent(session.id);
  const completedCourses = enrollments.filter((e) => courseProgress(session.id, e.courseId).percent === 100);
  const ongoing = enrollments.length - completedCourses.length;

  document.getElementById("stat-enrolled").textContent = enrollments.length;
  document.getElementById("stat-completed").textContent = completedCourses.length;
  document.getElementById("stat-ongoing").textContent = ongoing;

  const avg = enrollments.length
    ? Math.round(enrollments.reduce((sum, e) => sum + courseProgress(session.id, e.courseId).percent, 0) / enrollments.length)
    : 0;
  document.getElementById("stat-average").textContent = `${avg}%`;

  const list = document.getElementById("dashboard-course-list");
  list.innerHTML =
    enrollments
      .slice(0, 4)
      .map((e) => {
        const course = Courses.byId(e.courseId);
        if (!course) return "";
        const p = courseProgress(session.id, course.id);
        return `<li class="module-row">
        <a class="module-link" href="course-content.html?id=${course.id}">
          <span class="module-title">${course.name}</span>
          <span class="module-meta">${p.percent}% complete</span>
        </a>
      </li>`;
      })
      .join("") || `<li class="empty-cell">No enrollments yet — <a href="browse-courses.html">browse courses</a>.</li>`;

  const notifList = document.getElementById("dashboard-notifications");
  const notifs = Notifications.forStudent(session.id).slice(0, 3);
  notifList.innerHTML =
    notifs.map((n) => `<li>${n.message}<span class="muted small block">${formatDate(n.date)}</span></li>`).join("") ||
    `<li class="empty-cell">No notifications yet.</li>`;
};

PAGES.notifications = function () {
  const session = requireStudent();
  if (!session) return;
  const list = document.getElementById("notifications-list");

  function render() {
    const notifs = Notifications.forStudent(session.id);
    list.innerHTML =
      notifs
        .map(
          (n) => `<li class="notification-row ${n.read ? "" : "unread"}">
        <div>
          <p>${n.message}</p>
          <span class="muted small">${formatDate(n.date)}</span>
        </div>
        ${!n.read ? `<button class="btn-ghost small" data-read="${n.id}">Mark read</button>` : ""}
      </li>`
        )
        .join("") || `<li class="empty-cell">You have no notifications.</li>`;

    list.querySelectorAll("[data-read]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Notifications.markRead(btn.dataset.read);
        render();
      });
    });
  }
  render();
};

/* ---------- reusable markup ---------- */
function courseCardHTML(course) {
  return `<article class="card course-card">
    <div class="card-top">
      <span class="code-chip">${course.code}</span>
      <span class="category-chip">${course.category}</span>
    </div>
    <h3>${course.name}</h3>
    <p class="muted">${course.instructor} · ${course.duration} weeks</p>
    <p class="small">${course.description}</p>
    <a class="btn" href="course-details.html?id=${course.id}">View Course</a>
  </article>`;
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  seedIfNeeded();
  renderNav();
  const page = document.body.dataset.page;
  if (page && PAGES[page]) PAGES[page]();
});
