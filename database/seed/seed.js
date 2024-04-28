const mysql = require('mysql');
const env = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid').v4;

env.config();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'cumsdbms',
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Mysql Connected');
});
// Database query promises
const zeroParamPromise = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
};

const queryParamPromise = (sql, queryParam) => {
  return new Promise((resolve, reject) => {
    db.query(sql, queryParam, (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};
const relations = [
  'assignment_submission',
  'marks',
  'attendance',
  'assignment',
  'class',
  'fee',
  'student',
  'staff',
  'course',
  'admin',
  'college',
  'department',
];

const college_data = [
  { college_id: 'COLPHYS', college_name: 'College of Physical Sciences' },
  { college_id: 'COLENG', college_name: 'College of Engineering' },
  { college_id: 'COLBIOS', college_name: 'College of Biological Sciences' },
  { college_id: 'COLPLANT', college_name: 'College of Plant Science' },
  { college_id: 'COLERM', college_name: 'College of Enviromental Management' },
];

const department_data = [
  { dept_id: 'CSC', d_name: 'Computer Science', college_id: 'COLPHYS' },
  { dept_id: 'PHS', d_name: 'Physics', college_id: 'COLPHYS' },
  { dept_id: 'CVE', d_name: 'Civil Engineering', college_id: 'COLENG' },
  { dept_id: 'STS', d_name: 'Statistics', college_id: 'COLPHYS' },
  { dept_id: 'SSLM', d_name: 'Bio-Technology', college_id: 'COLPLANT' },
  { dept_id: 'EMT', d_name: 'Enviromental Management and Toxicology', college_id: 'COLERM' },
  { dept_id: 'PAB', d_name: 'Pure and Applied Botany', college_id: 'COLBIOS' },
];

const csc_courses = [
  {
    semester: 1,
    c_id: 'CSC101',
    name: 'Introduction to Computer Science',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 3,
  },
  {
    semester: 1,
    c_id: 'CSC103',
    name: 'Computer Programming I',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'CSC105',
    name: 'Database Systems',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 1,
    c_id: 'CSC107',
    name: 'History of Computer',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 2,
    c_id: 'CSC102',
    name: 'Computing Mathematics III',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 3,
  },
  {
    semester: 2,
    c_id: 'CSC104',
    name: 'Electronics I',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 2,
  },
  {
    semester: 2,
    c_id: 'CSC106',
    name: 'Network Analysis and Synthesis',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSC201',
    name: 'Linear Programming',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 3,
    c_id: 'CSC203',
    name: 'Data Structures',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 3,
  },
  {
    semester: 3,
    c_id: 'ECE205',
    name: 'Transmission of Big Data',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 2,
  },
  {
    semester: 3,
    c_id: 'CSC207',
    name: 'Probability Theory and Communication',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSC202',
    name: 'Digital Signal Processing',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 3,
  },
  {
    semester: 4,
    c_id: 'CSC204',
    name: 'Digital Communication',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 4,
    c_id: 'CSC206',
    name: 'Microprocessor and its Applications',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 1,
  },
  {
    semester: 4,
    c_id: 'CSC208',
    name: 'Data Transfer and Propagation',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 3,
  },
  {
    semester: 5,
    c_id: 'CSC301',
    name: 'Software Engineering I',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'CSC303',
    name: 'Artificial Intelligence',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 5,
    c_id: 'CSC305',
    name: 'Computer Networks',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 6,
    c_id: 'CSC302',
    name: 'Computer Networks II',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 6,
    c_id: 'CSC304',
    name: 'Computing Technology',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 1,
  },
  {
    semester: 6,
    c_id: 'CSC306',
    name: 'Software Engineering II',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 7,
    c_id: 'CSC401',
    name: 'Natural Language Processing I',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 7,
    c_id: 'CSC403',
    name: 'Computer Vision I',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 7,
    c_id: 'CSC405',
    name: 'Seminar I',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 1,
  },
  {
    semester: 8,
    c_id: 'CSC402',
    name: 'Natural Language Processing II',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 8,
    c_id: 'CSC404',
    name: 'Computer Vision II',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 4,
  },
  {
    semester: 8,
    c_id: 'CSC406',
    name: 'Seminar II',
    c_type: 'Practical',
    dept_id: 'CSC',
    credits: 1,
  },
  {
    semester: 8,
    c_id: 'CSC492',
    name: 'Final Project',
    c_type: 'Theory',
    dept_id: 'CSC',
    credits: 8,
  }
];

const studentsData = [
  {
    s_name: 'Marvis Chuckwudi',
    gender: 'Female',
    dob: '2000-01-02',
    email: 'marv@gmail.com',
    s_address: '6649 N Blue Gum St, Abeokuta, Ogun State',
    contact: '234-810-374-9840',
    section: 1,
    dept_id: 'CSC',
  },
  {
    s_name: 'Malik Diyaolu',
    gender: 'Male',
    dob: '2002-01-03',
    email: 'malikdiya@outlook.com',
    s_address: '4 B Blue Ridge Blvd-Brighton-48116',
    contact: '234-810-374-9840',
    section: 1,
    dept_id: 'CVE',
  }
]

const staffData = [
  {
    st_name: 'Kuti Ope',
    dob: '1997-04-25',
    email: 'kutiope@hotmail.com',
    st_address: 'Lorem dummy address',
    city: 'Abeokuta',
    zip: '75284',
    contact: '509-847-3352',
  },
  {
    st_name: 'Prof. Oka rojo',
    dob: '1934-07-12',
    email: 'rojooke@hotmail.com',
    st_address: 'Lorem dummy address',
    city: 'Oshogo',
    zip: '75284',
    contact: '509-847-3352',
  },
]

const reset = async () => {
  try {
    await new Promise((r) => setTimeout(r, 2000)); // wait for mysql connection
    await zeroParamPromise('SET FOREIGN_KEY_CHECKS = 0');
    for (let i = 0; i < relations.length; ++i) {
      await zeroParamPromise('TRUNCATE TABLE ' + relations[i]);
      console.log(relations[i] + ' truncated');
    }
    await zeroParamPromise('SET FOREIGN_KEY_CHECKS = 1');

    // 1.Add Admin
    const hashedPassword = await bcrypt.hash('123456', 8);
    await queryParamPromise('insert into admin set ?', {
      admin_id: uuidv4(),
      name: 'Super Malik',
      email: 'malikopeyemi5@gmail.com',
      password: hashedPassword,
    });

    console.log('admin added');

    // 2.Add Colleges
    for (let i = 0; i < college_data.length; ++i) {
      await queryParamPromise(
        'insert into college set ?',
        college_data[i]
      );
    }
    // 2.Add Departments
    for (let i = 0; i < department_data.length; ++i) {
      await queryParamPromise(
        'insert into department set ?',
        department_data[i]
      );
    }
    console.log('colleges added');
    // 3.Add Courses
    for (let i = 0; i < csc_courses.length; ++i) {
      await queryParamPromise('insert into course set ?', csc_courses[i]);
    }
    console.log('courses added');
    // 4.Add Staffs
    for (let i = 0; i < staffData.length; ++i) {
      const currentStaff = staffData[i];
      const dept_id = department_data[parseInt(i / 15)].dept_id;
      const gender = i % 2 === 0 ? 'Male' : 'Female';
      const hashedPassword = await bcrypt.hash(currentStaff.dob, 8);
      await queryParamPromise('insert into staff set ?', {
        st_id: uuidv4(),
        st_name: currentStaff.st_name,
        gender,
        dob: currentStaff.dob,
        email: currentStaff.email,
        st_address:
          currentStaff.st_address +
          '-' +
          currentStaff.city +
          '-' +
          currentStaff.zip,
        contact: currentStaff.contact.split(' ')[0],
        dept_id,
        password: hashedPassword,
      });
    }
    console.log('staffs added');

    // 5.Add Students
    for (let i = 0; i < studentsData.length; ++i) {
      let currentStudent = studentsData[i];
      const hashedPassword = await bcrypt.hash(currentStudent.dob, 8);
      currentStudent = {
        s_id: uuidv4(),
        ...currentStudent,
        password: hashedPassword,
      };
      await queryParamPromise('insert into student set ?', currentStudent);
    }
    console.log('students added');
    // 5.Add Classes
    for (department of department_data) {
      const dept_id = department.dept_id;
      const staffs = await queryParamPromise(
        'SELECT st_id from staff where dept_id = ?',
        [dept_id]
      );
      const courses = await queryParamPromise(
        'SELECT c_id from course where dept_id = ? AND semester = ?',
        [dept_id, 1]
      );
      let st_idx = 0;
      for (let j = 0; j < courses.length; ++j) {
        await queryParamPromise('INSERT INTO class set ?', {
          section: 1,
          semester: 1,
          c_id: courses[j].c_id,
          st_id: staffs[st_idx++].st_id,
        });
        await queryParamPromise('INSERT INTO class set ?', {
          section: 2,
          semester: 1,
          c_id: courses[j].c_id,
          st_id: staffs[st_idx++].st_id,
        });
        await queryParamPromise('INSERT INTO class set ?', {
          section: 3,
          semester: 1,
          c_id: courses[j].c_id,
          st_id: staffs[st_idx++].st_id,
        });
      }
    }
    console.log('Classes Added');
  } catch (err) {
    throw err;
  } finally {
    process.exit();
  }
};
reset();
