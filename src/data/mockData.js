export const USERS = [
  { id: 1, name: "Nodira Xolmatova", role: "teacher", login: "nodira", pass: "1234",  subject: "Matematika", avatar: "NX", color: "#4f6ef7" },
  { id: 2, name: "Bahodur Rahimov",  role: "teacher", login: "bahodur", pass: "1234", subject: "Fizika",     avatar: "BR", color: "#a855f7" },
  { id: 3, name: "Kamola Yusupova",  role: "admin",   login: "admin",   pass: "root", subject: null,         avatar: "KY", color: "#22d3a5" },
];

export const STUDENTS = [
  { id: 1, name: "Zilola Axmedova",  avatar: "ZA", color: "#f7a824", rating: 9.6, attendance: 100, tasks: 21, phone: "+998901234567" },
  { id: 2, name: "Bobur Toshmatov",  avatar: "BT", color: "#4f6ef7", rating: 9.1, attendance: 96,  tasks: 20, phone: "+998901234568" },
  { id: 3, name: "Alisher Farruxov", avatar: "AF", color: "#22d3a5", rating: 8.4, attendance: 92,  tasks: 18, phone: "+998901234569" },
  { id: 4, name: "Madina Nazarova",  avatar: "MN", color: "#a855f7", rating: 8.1, attendance: 88,  tasks: 17, phone: "+998901234570" },
  { id: 5, name: "Jasur Yusupov",    avatar: "JY", color: "#f75555", rating: 7.8, attendance: 85,  tasks: 16, phone: "+998901234571" },
  { id: 6, name: "Feruza Hamidova",  avatar: "FH", color: "#fbbf24", rating: 7.2, attendance: 79,  tasks: 14, phone: "+998901234572" },
];

export const TASKS = [
  { id: 1, subject: "Matematika", title: "Kvadrat tenglamalar", teacher: "Nodira xonim", due: "2025-03-03T18:00", status: "pending", unlockAt: "2025-03-03T14:00", submittedCount: 12, totalStudents: 28 },
  { id: 2, subject: "Fizika",     title: "Elektr zanjiri testi", teacher: "Bahodur aka", due: "2025-03-04T20:00", status: "done",    unlockAt: "2025-03-02T08:00", submittedCount: 24, totalStudents: 28 },
  { id: 3, subject: "Matematika", title: "Essay: Logarifmlar",   teacher: "Nodira xonim", due: "2025-03-02T22:00", status: "done",   unlockAt: "2025-03-01T08:00", submittedCount: 26, totalStudents: 28 },
  { id: 4, subject: "Fizika",     title: "Mexanika — Test #3",   teacher: "Bahodur aka",  due: "2025-03-05T16:00", status: "locked", unlockAt: "2025-03-05T09:00", submittedCount: 0,  totalStudents: 28 },
];
