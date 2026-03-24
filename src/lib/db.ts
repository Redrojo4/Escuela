import { createClient } from '@supabase/supabase-js';
import { User, Classroom, Student } from '../types';

const SUPABASE_URL = 'https://qnmpbmtpbhkjcapdhiik.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

const sb = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
const LOCAL_KEYS = { USERS: 'local_users', CLASSES: 'local_classes', STUDENTS: 'local_students' };

export const db = {
  async getUsers(): Promise<User[]> {
    if (!sb) return JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');
    const { data } = await sb.from('users').select('*');
    return data || [];
  },
  async addUser(user: User): Promise<User[]> {
    if (!sb) {
      const users = [...await this.getUsers(), user];
      localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));
      return users;
    }
    await sb.from('users').insert(user);
    return this.getUsers();
  },
  async deleteUser(id: string): Promise<User[]> {
    if (!sb) {
      const users = (await this.getUsers()).filter(u => u.id !== id);
      localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));
      return users;
    }
    await sb.from('users').delete().eq('id', id);
    return this.getUsers();
  },
  async getClassrooms(): Promise<Classroom[]> {
    if (!sb) return JSON.parse(localStorage.getItem(LOCAL_KEYS.CLASSES) || '[]');
    const { data } = await sb.from('classrooms').select('*');
    return data || [];
  },
  async addClassroom(classroom: Classroom): Promise<Classroom[]> {
    if (!sb) {
      const updated = [...await this.getClassrooms(), classroom];
      localStorage.setItem(LOCAL_KEYS.CLASSES, JSON.stringify(updated));
      return updated;
    }
    await sb.from('classrooms').insert(classroom);
    return this.getClassrooms();
  },
  async deleteClassroom(id: string): Promise<Classroom[]> {
    if (!sb) {
      const current = (await this.getClassrooms()).filter(c => c.id !== id);
      localStorage.setItem(LOCAL_KEYS.CLASSES, JSON.stringify(current));
      return current;
    }
    await sb.from('classrooms').delete().eq('id', id);
    return this.getClassrooms();
  },
  async getStudents(): Promise<Student[]> {
    if (!sb) {
      const data = JSON.parse(localStorage.getItem(LOCAL_KEYS.STUDENTS) || '[]');
      return data.map((s: any) => ({ ...s, partialGrades: s.partialGrades || [null, null, null, null, null] }));
    }
    const { data } = await sb.from('students').select('*');
    return (data || []).map((s: any) => ({ ...s, partialGrades: s.partialGrades || [null, null, null, null, null] }));
  },
  async addStudent(student: Partial<Student>): Promise<Student[]> {
    const newStudent = { ...student, partialGrades: [null, null, null, null, null], grade: null } as Student;
    if (!sb) {
      const updated = [...await this.getStudents(), newStudent];
      localStorage.setItem(LOCAL_KEYS.STUDENTS, JSON.stringify(updated));
      return updated;
    }
    await sb.from('students').insert(newStudent);
    return this.getStudents();
  },
  async deleteStudent(id: string): Promise<Student[]> {
    if (!sb) {
      const current = (await this.getStudents()).filter(s => s.id !== id);
      localStorage.setItem(LOCAL_KEYS.STUDENTS, JSON.stringify(current));
      return current;
    }
    await sb.from('students').delete().eq('id', id);
    return this.getStudents();
  },
  async updateStudentGrades(id: string, newPartials: (number | null)[]): Promise<Student[]> {
    const students = await this.getStudents();
    const student = students.find(s => s.id === id);
    if (!student) return students;
    const taken = newPartials.filter(g => g !== null && g !== undefined && (typeof g === 'number'));
    const average = taken.length > 0 ? Math.round(taken.reduce((a, b) => (a || 0) + (b || 0), 0) / taken.length) : null;
    const updated = { ...student, partialGrades: newPartials, grade: average };
    if (!sb) {
      const list = students.map(s => s.id === id ? updated : s);
      localStorage.setItem(LOCAL_KEYS.STUDENTS, JSON.stringify(list));
      return list;
    }
    await sb.from('students').update({ partialGrades: newPartials, grade: average }).eq('id', id);
    return this.getStudents();
  },
  async updateStudentPartialGrade(id: string, partialIndex: number, grade: number): Promise<Student[]> {
    const students = await this.getStudents();
    const student = students.find(s => s.id === id);
    if (!student) return students;
    const newPartials = [...(student.partialGrades || [null, null, null, null, null])];
    newPartials[partialIndex] = grade;
    return this.updateStudentGrades(id, newPartials);
  }
};
