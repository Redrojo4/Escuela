
import React, { useState, useEffect } from 'react';
import { TabOption, AttendanceResult, GroupAverageResult, Criterion, Student, User, Role, Classroom, EnrolledStudent } from './types';
import { Card } from './components/Card';
import { Input } from './components/Input';
import { Tab } from './components/Tab';

// SVG Icons
const AttendanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const StudentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const GroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.5 5.5a3 3 0 00-3 0V13a1 1 0 00-1 1v1a1 1 0 001 1h3a1 1 0 001-1v-1a1 1 0 00-1-1v-.5zM15.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3 5.5a3 3 0 013-3h1a3 3 0 013 3v.5a1 1 0 01-1 1v1a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a1 1 0 01-1-1V11.5z" /></svg>;
const RemoveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const ClassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>;
const CalcIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" /></svg>;


const ResultDisplay: React.FC<{ title: string; value: string; unit: string; valueClassName?: string }> = ({ title, value, unit, valueClassName = 'text-sky-400' }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg text-center">
        <span className="text-sm text-slate-400">{title}</span>
        <span className={`text-2xl font-bold ${valueClassName}`}>
            {value}<span className="text-lg ml-1">{unit}</span>
        </span>
    </div>
);

// --- ORIGINAL CALCULATOR COMPONENTS ---
const AttendanceCalculator: React.FC = () => {
    const [numStudents, setNumStudents] = useState('');
    const [numSessions, setNumSessions] = useState('');
    const [totalAbsences, setTotalAbsences] = useState('');
    const [result, setResult] = useState<AttendanceResult | null>(null);
    const [error, setError] = useState<string>('');

    const handleCalculate = () => {
        const students = parseInt(numStudents, 10);
        const sessions = parseInt(numSessions, 10);
        const absences = parseInt(totalAbsences, 10);

        if (isNaN(students) || isNaN(sessions) || isNaN(absences)) {
            setError('Todos los campos son obligatorios.');
            setResult(null);
            return;
        }

        if (students <= 0 || sessions <= 0 || absences < 0) {
            setError('Los valores deben ser positivos. Las faltas no pueden ser negativas.');
            setResult(null);
            return;
        }

        const totalPossibleAttendance = students * sessions;
        if (absences > totalPossibleAttendance) {
            setError('Las faltas totales no pueden exceder el número total de asistencias posibles.');
            setResult(null);
            return;
        }

        const attendedSessions = totalPossibleAttendance - absences;
        const attendance = (attendedSessions / totalPossibleAttendance) * 100;
        const nonAttendance = 100 - attendance;

        setResult({ attendance, nonAttendance });
        setError('');
    };
    
    return (
        <Card>
            <h2 className="text-xl font-bold mb-4 text-sky-400">Calcular Asistencia del Grupo</h2>
            <div className="space-y-4">
                <Input label="Cantidad de Alumnos" value={numStudents} onChange={(e) => setNumStudents(e.target.value)} min="1" />
                <Input label="Número de Sesiones" value={numSessions} onChange={(e) => setNumSessions(e.target.value)} min="1" />
                <Input label="Faltas Totales del Grupo" value={totalAbsences} onChange={(e) => setTotalAbsences(e.target.value)} min="0" />
            </div>
            <button onClick={handleCalculate} className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                Calcular
            </button>
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            {result && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ResultDisplay title="Asistencia" value={result.attendance.toFixed(2)} unit="%" />
                    <ResultDisplay title="Inasistencia" value={result.nonAttendance.toFixed(2)} unit="%" />
                </div>
            )}
        </Card>
    );
};

const StudentAverageCalculator: React.FC = () => {
    const [criteria, setCriteria] = useState<Criterion[]>([{ id: crypto.randomUUID(), name: '', score: '' }]);
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string>('');

    const handleCriteriaChange = (id: string, field: 'name' | 'score', value: string) => {
        setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
    };
    
    const addCriterion = () => {
        if (criteria.length < 20) {
            setCriteria([...criteria, { id: crypto.randomUUID(), name: '', score: '' }]);
        }
    };

    const removeCriterion = (id: string) => {
        if (criteria.length > 1) {
            setCriteria(criteria.filter(c => c.id !== id));
        }
    };

    const handleCalculate = () => {
        const scores = criteria.map(c => parseInt(c.score, 10));
        if (scores.some(isNaN)) {
            setError('Todos los criterios deben tener un puntaje numérico.');
            setResult(null);
            return;
        }
        
        if(scores.some(s => s < 0)) {
            setError('Los puntajes de los criterios no pueden ser negativos.');
            setResult(null);
            return;
        }

        const total = scores.reduce((sum, score) => sum + score, 0);
        
        if (total > 100) {
            setError(`La suma de puntajes (${total}) no puede superar 100.`);
            setResult(null);
            return;
        }
        
        setResult(total);
        setError('');
    };

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4 text-sky-400">Calcular Promedio de Alumno</h2>
            <div className="space-y-4">
                {criteria.map((criterion, index) => (
                    <div key={criterion.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                            <Input label={`Criterio ${index + 1}`} type="text" placeholder="Ej: Examen" value={criterion.name} onChange={(e) => handleCriteriaChange(criterion.id, 'name', e.target.value)} />
                        </div>
                        <div className="col-span-5">
                            <Input label="Puntaje" value={criterion.score} onChange={(e) => handleCriteriaChange(criterion.id, 'score', e.target.value)} min="0" max="100" />
                        </div>
                        <div className="col-span-1 flex items-end justify-center h-full pb-2">
                             {criteria.length > 1 && (
                                <button onClick={() => removeCriterion(criterion.id)} className="text-slate-500 hover:text-red-400 transition-colors" aria-label="Eliminar criterio">
                                    <RemoveIcon />
                                </button>
                             )}
                        </div>
                    </div>
                ))}
                {criteria.length < 20 && (
                     <button onClick={addCriterion} className="w-full text-sky-400 border border-sky-400 hover:bg-sky-900 font-bold py-2 px-4 rounded-md transition-colors duration-200">
                        + Agregar Criterio
                    </button>
                )}
            </div>
             <button onClick={handleCalculate} className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                Calcular
            </button>
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            {result !== null && (
                 <div className="mt-6 grid grid-cols-1 gap-4">
                    <ResultDisplay title="Calificación Final del Alumno" value={result.toFixed(0)} unit="/ 100" />
                </div>
            )}
        </Card>
    );
};

const GroupAverageCalculator: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([{ id: crypto.randomUUID(), grade: '' }]);
    const [result, setResult] = useState<GroupAverageResult | null>(null);
    const [error, setError] = useState<string>('');

    const handleStudentChange = (id: string, value: string) => {
        setStudents(students.map(s => s.id === id ? { ...s, grade: value } : s));
    };

    const addStudent = () => {
        if (students.length <= 60) {
            setStudents([...students, { id: crypto.randomUUID(), grade: '' }]);
        }
    };
    
    const removeStudent = (id: string) => {
        if (students.length > 1) {
            setStudents(students.filter(s => s.id !== id));
        }
    };

    const handleCalculate = () => {
        const numericGrades = students.map(s => parseInt(s.grade, 10));

        if (numericGrades.some(isNaN)) {
            setError('Todas las calificaciones deben ser números.');
            setResult(null);
            return;
        }

        if (numericGrades.some(g => g < 0 || g > 100)) {
            setError('Las calificaciones deben estar entre 0 y 100.');
            setResult(null);
            return;
        }
        
        const studentsCount = numericGrades.length;
        const sum = numericGrades.reduce((acc, grade) => acc + grade, 0);
        const failedCount = numericGrades.filter(g => g <= 59).length;
        const passedCount = studentsCount - failedCount;
        
        const groupAverage = sum / studentsCount;
        const averageOn10 = groupAverage / 10;
        const approvalRate = (passedCount / studentsCount) * 100;
        
        setResult({ groupAverage, averageOn10, approvalRate, passedCount, failedCount });
        setError('');
    };

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4 text-sky-400">Calcular Promedio General del Grupo</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                 {students.map((student, index) => (
                    <div key={student.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-11">
                            <Input 
                                label={`Calificación Alumno ${index + 1}`} 
                                value={student.grade} 
                                onChange={(e) => handleStudentChange(student.id, e.target.value)} 
                                min="0" 
                                max="100" 
                                placeholder="0-100"
                            />
                        </div>
                         <div className="col-span-1 flex items-end justify-center h-full pb-2">
                             {students.length > 1 && (
                                <button onClick={() => removeStudent(student.id)} className="text-slate-500 hover:text-red-400 transition-colors" aria-label="Eliminar alumno">
                                    <RemoveIcon />
                                </button>
                             )}
                        </div>
                    </div>
                ))}
                 {students.length < 50 && (
                     <button onClick={addStudent} className="w-full text-sky-400 border border-sky-400 hover:bg-sky-900 font-bold py-2 px-4 rounded-md transition-colors duration-200">
                        + Agregar Alumno
                    </button>
                )}
            </div>

            <button onClick={handleCalculate} className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                Calcular
            </button>
            
            {result && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ResultDisplay title="Promedio Grupo" value={result.groupAverage.toFixed(2)} unit="/100" />
                    <ResultDisplay title="Promedio" value={result.averageOn10.toFixed(2)} unit="/10" />
                    <ResultDisplay title="% Aprobación" value={result.approvalRate.toFixed(2)} unit="%" valueClassName={result.approvalRate >= 60 ? 'text-green-400' : 'text-yellow-400'}/>
                    <ResultDisplay title="Reprobados" value={result.failedCount.toString()} unit="alumnos" valueClassName={result.failedCount > 0 ? 'text-red-400' : 'text-sky-400'}/>
                </div>
            )}
             {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
        </Card>
    );
};

// --- NEW APP COMPONENTS ---

const CalculatorModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabOption>('attendance');

    const renderContent = () => {
        switch (activeTab) {
            case 'attendance':
                return <AttendanceCalculator />;
            case 'student':
                return <StudentAverageCalculator />;
            case 'group':
                return <GroupAverageCalculator />;
            default:
                return null;
        }
    };

    return (
        <div>
            <nav className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8">
                <Tab 
                  label="Asistencia" 
                  isActive={activeTab === 'attendance'} 
                  onClick={() => setActiveTab('attendance')} 
                  icon={<AttendanceIcon />}
                />
                <Tab 
                  label="Alumno" 
                  isActive={activeTab === 'student'} 
                  onClick={() => setActiveTab('student')}
                  icon={<StudentIcon />}
                />
                <Tab 
                  label="Grupo" 
                  isActive={activeTab === 'group'} 
                  onClick={() => setActiveTab('group')} 
                  icon={<GroupIcon />}
                />
            </nav>
            <main>
                {renderContent()}
            </main>
        </div>
    );
}

const LoginScreen: React.FC<{ onLogin: (u: string, p: string) => void, error: string }> = ({ onLogin, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    }

    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
                    <Input label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 mt-4">
                        Entrar
                    </button>
                    <div className="mt-4 p-2 bg-slate-700 rounded text-xs text-slate-400">
                        <p>Prueba Admin: admin / admin123</p>
                        <p>Prueba Docente: docente / docente123</p>
                    </div>
                </form>
            </Card>
        </div>
    );
}

// --- ADMIN DASHBOARD ---

interface AdminDashboardProps {
    users: User[];
    classrooms: Classroom[];
    students: EnrolledStudent[];
    actions: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, classrooms, students, actions }) => {
    const [tab, setTab] = useState<'users' | 'classes'>('users');
    
    // User Form State
    const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'docente' as Role });
    
    // Class Form State
    const [newClass, setNewClass] = useState({ name: '', teacherId: '' });

    // Selected Class for management
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [newStudentName, setNewStudentName] = useState('');

    const teachers = users.filter(u => u.role === 'docente');

    const handleAddUser = () => {
        if(newUser.name && newUser.username && newUser.password) {
            actions.addUser({ ...newUser, id: crypto.randomUUID() });
            setNewUser({ name: '', username: '', password: '', role: 'docente' });
        }
    };

    const handleAddClass = () => {
        if(newClass.name && newClass.teacherId) {
            actions.addClassroom({ ...newClass, id: crypto.randomUUID() });
            setNewClass({ name: '', teacherId: '' });
        }
    };

    const handleAddStudent = () => {
        if(selectedClassId && newStudentName) {
            actions.addStudent({
                id: crypto.randomUUID(),
                name: newStudentName,
                classroomId: selectedClassId,
                grade: null
            });
            setNewStudentName('');
        }
    }

    if (selectedClassId) {
        const currentClass = classrooms.find(c => c.id === selectedClassId);
        const classStudents = students.filter(s => s.classroomId === selectedClassId);
        
        return (
            <div>
                 <button onClick={() => setSelectedClassId(null)} className="mb-4 text-sky-400 hover:text-sky-300 flex items-center gap-1">
                    &larr; Volver a Salones
                </button>
                <Card>
                    <h2 className="text-2xl font-bold mb-4 text-white">Gestionar: {currentClass?.name}</h2>
                    
                    <div className="flex gap-2 mb-6 items-end">
                        <div className="flex-grow">
                            <Input label="Nombre del Nuevo Alumno" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} />
                        </div>
                        <button onClick={handleAddStudent} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md h-10 mb-[1px]">Agregar</button>
                    </div>

                    <div className="space-y-2">
                        {classStudents.map(student => (
                            <div key={student.id} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                                <div className="flex-grow">
                                    <span className="font-bold">{student.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                     <div className="flex flex-col items-end">
                                        <span className="text-xs text-slate-400">Calificación</span>
                                        <input 
                                            type="number" 
                                            min="0" max="100"
                                            className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-right text-white"
                                            value={student.grade ?? ''}
                                            onChange={(e) => actions.updateGrade(student.id, e.target.value ? parseInt(e.target.value) : null)}
                                        />
                                    </div>
                                    <button onClick={() => actions.deleteStudent(student.id)} className="text-red-400 hover:text-red-300">
                                        <RemoveIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {classStudents.length === 0 && <p className="text-slate-500 text-center py-4">No hay alumnos en este salón.</p>}
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-center space-x-4 mb-6">
                <Tab label="Gestión Docentes" isActive={tab === 'users'} onClick={() => setTab('users')} icon={<UserIcon />} />
                <Tab label="Gestión Salones" isActive={tab === 'classes'} onClick={() => setTab('classes')} icon={<ClassIcon />} />
            </div>

            {tab === 'users' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-sky-400">Dar de Alta Docente</h3>
                        <div className="space-y-3">
                            <Input label="Nombre Completo" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                            <Input label="Usuario" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                            <Input label="Contraseña" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                            <button onClick={handleAddUser} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded mt-4">Guardar Docente</button>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-sky-400">Lista de Docentes</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {teachers.map(teacher => (
                                <div key={teacher.id} className="flex justify-between items-center bg-slate-700 p-3 rounded">
                                    <div>
                                        <p className="font-bold">{teacher.name}</p>
                                        <p className="text-xs text-slate-400">@{teacher.username}</p>
                                    </div>
                                    <button onClick={() => actions.deleteUser(teacher.id)} className="text-red-400 hover:text-red-300 p-1">
                                        <RemoveIcon />
                                    </button>
                                </div>
                            ))}
                            {teachers.length === 0 && <p className="text-slate-500 italic">No hay docentes registrados.</p>}
                        </div>
                    </Card>
                </div>
            )}

            {tab === 'classes' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-sky-400">Crear Salón</h3>
                        <div className="space-y-3">
                            <Input label="Nombre del Salón (Ej: 3ro A)" value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} />
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Asignar Docente</label>
                                <select 
                                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    value={newClass.teacherId}
                                    onChange={e => setNewClass({...newClass, teacherId: e.target.value})}
                                >
                                    <option value="">Seleccione un docente...</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <button onClick={handleAddClass} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded mt-4">Crear Salón</button>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-sky-400">Salones Activos</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {classrooms.map(cls => {
                                const teacherName = teachers.find(t => t.id === cls.teacherId)?.name || 'Sin Asignar';
                                return (
                                    <div key={cls.id} className="flex justify-between items-center bg-slate-700 p-3 rounded">
                                        <div onClick={() => setSelectedClassId(cls.id)} className="cursor-pointer flex-grow hover:opacity-80">
                                            <p className="font-bold text-lg text-sky-300">{cls.name}</p>
                                            <p className="text-xs text-slate-400">Docente: {teacherName}</p>
                                        </div>
                                        <button onClick={() => actions.deleteClassroom(cls.id)} className="text-red-400 hover:text-red-300 p-1 ml-2">
                                            <RemoveIcon />
                                        </button>
                                    </div>
                                )
                            })}
                             {classrooms.length === 0 && <p className="text-slate-500 italic">No hay salones registrados.</p>}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

// --- TEACHER DASHBOARD ---

interface TeacherDashboardProps {
    currentUser: User;
    classrooms: Classroom[];
    students: EnrolledStudent[];
    actions: any;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, classrooms, students, actions }) => {
    const [tab, setTab] = useState<'my_classes' | 'calculator'>('my_classes');
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    const myClassrooms = classrooms.filter(c => c.teacherId === currentUser.id);

    if (selectedClassId) {
        const currentClass = classrooms.find(c => c.id === selectedClassId);
        const classStudents = students.filter(s => s.classroomId === selectedClassId);
        
        return (
            <div>
                 <button onClick={() => setSelectedClassId(null)} className="mb-4 text-sky-400 hover:text-sky-300 flex items-center gap-1">
                    &larr; Volver a Mis Salones
                </button>
                <Card>
                    <h2 className="text-2xl font-bold mb-4 text-white">Calificaciones: {currentClass?.name}</h2>
                    <div className="space-y-2">
                        {classStudents.map(student => (
                            <div key={student.id} className="flex items-center justify-between bg-slate-700 p-3 rounded">
                                <span className="font-bold">{student.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-400 mr-2">Calif:</span>
                                    <input 
                                        type="number" 
                                        min="0" max="100"
                                        className="w-20 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-center text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                                        value={student.grade ?? ''}
                                        placeholder="-"
                                        onChange={(e) => actions.updateGrade(student.id, e.target.value ? parseInt(e.target.value) : null)}
                                    />
                                </div>
                            </div>
                        ))}
                        {classStudents.length === 0 && <p className="text-slate-500 text-center py-4">No hay alumnos inscritos en este salón.</p>}
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div>
             <div className="flex justify-center space-x-4 mb-6">
                <Tab label="Mis Salones" isActive={tab === 'my_classes'} onClick={() => setTab('my_classes')} icon={<ClassIcon />} />
                <Tab label="Calculadora" isActive={tab === 'calculator'} onClick={() => setTab('calculator')} icon={<CalcIcon />} />
            </div>

            {tab === 'calculator' && <CalculatorModule />}
            
            {tab === 'my_classes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myClassrooms.map(cls => (
                        <div key={cls.id} onClick={() => setSelectedClassId(cls.id)} className="cursor-pointer bg-slate-800 p-6 rounded-lg shadow-lg hover:bg-slate-700 transition-colors border border-transparent hover:border-sky-500 group">
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-sky-400">{cls.name}</h3>
                            <p className="text-slate-400">{students.filter(s => s.classroomId === cls.id).length} Alumnos</p>
                        </div>
                    ))}
                    {myClassrooms.length === 0 && (
                        <div className="col-span-full text-center text-slate-500 py-10 bg-slate-800 rounded-lg">
                            No tienes salones asignados. Contacta al administrador.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// --- MAIN APP ---

// Initial Data for reset
const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Director Principal', role: 'admin' },
  { id: '2', username: 'docente', password: 'docente123', name: 'Maestro Ejemplar', role: 'docente' }
];

const App: React.FC = () => {
    // Database State
    const [users, setUsers] = useState<User[]>(() => {
        const saved = localStorage.getItem('school_users');
        return saved ? JSON.parse(saved) : INITIAL_USERS;
    });
    const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
        const saved = localStorage.getItem('school_classrooms');
        return saved ? JSON.parse(saved) : [];
    });
    const [students, setStudents] = useState<EnrolledStudent[]>(() => {
        const saved = localStorage.getItem('school_students');
        return saved ? JSON.parse(saved) : [];
    });

    // Session State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loginError, setLoginError] = useState('');

    // Persistence Effects
    useEffect(() => localStorage.setItem('school_users', JSON.stringify(users)), [users]);
    useEffect(() => localStorage.setItem('school_classrooms', JSON.stringify(classrooms)), [classrooms]);
    useEffect(() => localStorage.setItem('school_students', JSON.stringify(students)), [students]);

    // Actions
    const handleLogin = (u: string, p: string) => {
        const user = users.find(user => user.username === u && user.password === p);
        if (user) {
            setCurrentUser(user);
            setLoginError('');
        } else {
            setLoginError('Credenciales incorrectas');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setLoginError('');
    }

    const dbActions = {
        addUser: (user: User) => setUsers([...users, user]),
        deleteUser: (id: string) => setUsers(users.filter(u => u.id !== id)),
        addClassroom: (cls: Classroom) => setClassrooms([...classrooms, cls]),
        deleteClassroom: (id: string) => setClassrooms(classrooms.filter(c => c.id !== id)),
        addStudent: (student: EnrolledStudent) => setStudents([...students, student]),
        deleteStudent: (id: string) => setStudents(students.filter(s => s.id !== id)),
        updateGrade: (id: string, grade: number | null) => setStudents(students.map(s => s.id === id ? { ...s, grade } : s))
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                             Sistema Escolar
                        </h1>
                        <p className="mt-1 text-lg text-slate-400">Secundaria Num. 5</p>
                    </div>
                    {currentUser && (
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="font-bold text-white">{currentUser.name}</p>
                                <p className="text-xs text-slate-400 uppercase">{currentUser.role}</p>
                            </div>
                            <button onClick={handleLogout} className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Cerrar Sesión">
                                <LogoutIcon />
                            </button>
                        </div>
                    )}
                </header>
                
                <main>
                    {!currentUser && <LoginScreen onLogin={handleLogin} error={loginError} />}
                    
                    {currentUser?.role === 'admin' && (
                        <AdminDashboard 
                            users={users} 
                            classrooms={classrooms} 
                            students={students} 
                            actions={dbActions} 
                        />
                    )}

                    {currentUser?.role === 'docente' && (
                        <TeacherDashboard 
                            currentUser={currentUser}
                            classrooms={classrooms}
                            students={students}
                            actions={dbActions} 
                        />
                    )}
                </main>
                 <footer className="text-center mt-12 text-slate-500 text-sm">
                    <p>Creado por Pablo Soriano.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
