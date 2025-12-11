
import { createClient } from '@supabase/supabase-js';
import { User, Classroom, EnrolledStudent } from './types';

// ==============================================================================
// ⚠️ CONFIGURACIÓN DE SUPABASE ⚠️
// Copia estos datos desde tu proyecto en Supabase (Settings -> API)
// ==============================================================================
const SUPABASE_URL = 'https://qnmpbmtpbhkjcapdhiik.supabase.co';
const SUPABASE_KEY = 'process.env.SUPABASE_KEY';

// ------------------------------------------------------------------------------
// 📋 REQUERIMIENTOS DE BASE DE DATOS (SQL EDITOR)
// Ejecuta este comando en Supabase para asegurar que la tabla 'students' 
// tenga la columna para los parciales:
// 
// alter table students 
// add column if not exists "partialGrades" jsonb default '[null, null, null, null, null]';
// ------------------------------------------------------------------------------

// Inicializamos el cliente. Si no hay claves configuradas, fallará elegantemente.
const supabase = (SUPABASE_URL !== 'https://qnmpbmtpbhkjcapdhiik.supabase.co') 
    ? createClient(SUPABASE_URL, SUPABASE_KEY) 
    : null;

// Datos de respaldo por si no se configuran las claves (Modo Demo Local)
const LOCAL_KEYS = { USERS: 'local_users', CLASSES: 'local_classes', STUDENTS: 'local_students' };

class SchoolDatabase {

    constructor() {
        if (!supabase) {
            console.warn("⚠️ SUPABASE NO CONFIGURADO. Usando localStorage.");
            this.initLocal();
        }
    }

    private initLocal() {
        // Inicializa datos locales si no hay Supabase
        if (!localStorage.getItem(LOCAL_KEYS.USERS)) {
            const seed: User[] = [
                { id: '1', username: 'admin', password: 'admin123', name: 'Director (Local)', role: 'admin' },
                { id: '2', username: 'docente', password: 'docente123', name: 'Docente (Local)', role: 'docente' }
            ];
            localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(seed));
        }
    }

    // --- HELPER PARA ERROR ---
    private handleError(error: any) {
        if (error) console.error("Supabase Error:", error);
    }

    // --- USERS ---
    async getUsers(): Promise<User[]> {
        if (!supabase) return JSON.parse(localStorage.getItem(LOCAL_KEYS.USERS) || '[]');
        
        const { data, error } = await supabase.from('users').select('*');
        this.handleError(error);
        return data || [];
    }

    async addUser(user: User): Promise<User[]> {
        if (!supabase) {
            const users = await this.getUsers();
            const newUsers = [...users, user];
            localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(newUsers));
            return newUsers;
        }

        const { error } = await supabase.from('users').insert(user);
        this.handleError(error);
        return this.getUsers();
    }

    async deleteUser(id: string): Promise<User[]> {
        if (!supabase) {
            const users = (await this.getUsers()).filter(u => u.id !== id);
            localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));
            return users;
        }

        const { error } = await supabase.from('users').delete().eq('id', id);
        this.handleError(error);
        return this.getUsers();
    }

    async updateUserPassword(id: string, newPass: string): Promise<User[]> {
        if (!supabase) {
            const users = (await this.getUsers()).map(u => u.id === id ? {...u, password: newPass} : u);
            localStorage.setItem(LOCAL_KEYS.USERS, JSON.stringify(users));
            return users;
        }

        const { error } = await supabase.from('users').update({ password: newPass }).eq('id', id);
        this.handleError(error);
        return this.getUsers();
    }

    // --- CLASSROOMS ---
    async getClassrooms(): Promise<Classroom[]> {
        if (!supabase) return JSON.parse(localStorage.getItem(LOCAL_KEYS.CLASSES) || '[]');

        const { data, error } = await supabase.from('classrooms').select('*');
        this.handleError(error);
        return data || [];
    }

    async addClassroom(classroom: Classroom): Promise<Classroom[]> {
        if (!supabase) {
            const current = await this.getClassrooms();
            const updated = [...current, classroom];
            localStorage.setItem(LOCAL_KEYS.CLASSES, JSON.stringify(updated));
            return updated;
        }

        const { error } = await supabase.from('classrooms').insert(classroom);
        this.handleError(error);
        return this.getClassrooms();
    }

    async deleteClassroom(id: string): Promise<Classroom[]> {
        if (!supabase) {
            const current = (await this.getClassrooms()).filter(c => c.id !== id);
            localStorage.setItem(LOCAL_KEYS.CLASSES, JSON.stringify(current));
            return current;
        }

        const { error } = await supabase.from('classrooms').delete().eq('id', id);
        this.handleError(error);
        return this.getClassrooms();
    }

    // --- STUDENTS ---
    async getStudents(): Promise<EnrolledStudent[]> {
        if (!supabase) {
            const data = JSON.parse(localStorage.getItem(LOCAL_KEYS.STUDENTS) || '[]');
            // Asegurar compatibilidad hacia atrás si faltan partialGrades
            return data.map((s: any) => ({
                ...s,
                partialGrades: s.partialGrades || [null, null, null, null, null]
            }));
        }

        const { data, error } = await supabase.from('students').select('*');
        this.handleError(error);
        
        // Normalización si los datos vienen vacíos
        if(data) {
             return data.map((s: any) => ({
                ...s,
                partialGrades: s.partialGrades || [null, null, null, null, null]
            }));
        }
        return [];
    }

    async addStudent(student: EnrolledStudent): Promise<EnrolledStudent[]> {
        // Asegurar que inicialice con 5 parciales vacíos
        const newStudent = {
            ...student,
            partialGrades: [null, null, null, null, null],
            grade: null
        };

        if (!supabase) {
            const current = await this.getStudents();
            const updated = [...current, newStudent];
            localStorage.setItem(LOCAL_KEYS.STUDENTS, JSON.stringify(updated));
            return updated;
        }

        const { error } = await supabase.from('students').insert(newStudent);
        this.handleError(error);
        return this.getStudents();
    }

    async deleteStudent(id: string): Promise<EnrolledStudent[]> {
        if (!supabase) {
            const current = (await this.getStudents()).filter(s => s.id !== id);
            localStorage.setItem(LOCAL_KEYS.STUDENTS, JSON.stringify(current));
            return current;
        }

        const { error } = await supabase.from('students').delete().eq('id', id);
        this.handleError(error);
        return this.getStudents();
    }

    // Nuevo método para actualizar TODAS las calificaciones de un golpe (Batch Update)
    async updateStudentGrades(id: string, newPartials: (number | null)[]): Promise<EnrolledStudent[]> {
        const students = await this.getStudents();
        const student = students.find(s => s.id === id);

        if (!student) return students;

        // Calcular nuevo promedio final
        const takenPartials = newPartials.filter(g => g !== null && g !== undefined && g.toString() !== '') as number[];
        const average = takenPartials.length > 0 
            ? Math.round(takenPartials.reduce((a, b) => a + b, 0) / takenPartials.length)
            : null;

        const updatedStudent = { ...student, partialGrades: newPartials, grade: average };

        if (!supabase) {
            const updatedList = students.map(s => s.id === id ? updatedStudent : s);
            localStorage.setItem(LOCAL_KEYS.STUDENTS, JSON.stringify(updatedList));
            return updatedList;
        }

        const { error } = await supabase.from('students').update({ 
            partialGrades: newPartials, 
            grade: average 
        }).eq('id', id);
        
        this.handleError(error);
        return this.getStudents();
    }

    // Método legacy para actualizar un solo parcial (usado por el maestro si evalua 1 por 1)
    async updateStudentPartialGrade(id: string, partialIndex: number, grade: number): Promise<EnrolledStudent[]> {
        const students = await this.getStudents();
        const student = students.find(s => s.id === id);
        if (!student) return students;

        const newPartials = [...(student.partialGrades || [null, null, null, null, null])];
        newPartials[partialIndex] = grade;
        
        return this.updateStudentGrades(id, newPartials);
    }
    
    // Método legacy
    async updateStudentGrade(id: string, grade: number | null): Promise<EnrolledStudent[]> {
         return this.updateStudentPartialGrade(id, 0, grade || 0);
    }

    async resetDatabase() {
        if (!supabase) {
            localStorage.clear();
            window.location.reload();
            return;
        }
        
        await supabase.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
        await supabase.from('classrooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('users').delete().neq('username', 'admin'); 
    }
}

export const db = new SchoolDatabase();
