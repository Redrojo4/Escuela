
import React, { useState, useEffect } from 'react';
import { TabOption, AttendanceResult, GroupAverageResult, Criterion, Student, User, Role, Classroom, EnrolledStudent } from './types';
import { Card } from './components/Card';
import { Input } from './components/Input';
import { Tab } from './components/Tab';
import { db } from './database';

// SVG Icons
const AttendanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const StudentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const GroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.5 5.5a3 3 0 00-3 0V13a1 1 0 00-1 1v1a1 1 0 001 1h3a1 1 0 001-1v-1a1 1 0 00-1-1v-.5zM15.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3 5.5a3 3 0 013-3h1a3 3 0 013 3v.5a1 1 0 01-1 1v1a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a1 1 0 01-1-1V11.5z" /></svg>;
const RemoveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const ClassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 000-2z" clipRule="evenodd" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>;

const ResultDisplay: React.FC<{ title: string; value: string; unit: string; valueClassName?: string }> = ({ title, value, unit, valueClassName = 'text-sky-400' }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg text-center">
        <span className="text-sm text-slate-400">{title}</span>
        <span className={`text-2xl font-bold ${valueClassName}`}>
            {value}<span className="text-lg ml-1">{unit}</span>
        </span>
    </div>
);

// --- CALCULATOR COMPONENTS ---
interface AttendanceCalculatorProps {
    forcedStudentCount?: number;
}

const AttendanceCalculator: React.FC<AttendanceCalculatorProps> = ({ forcedStudentCount }) => {
    const [numStudents, setNumStudents] = useState('');
    const [numSessions, setNumSessions] = useState('');
    const [totalAbsences, setTotalAbsences] = useState('');
    const [result, setResult] = useState<AttendanceResult | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (forcedStudentCount !== undefined) {
            setNumStudents(forcedStudentCount.toString());
        }
    }, [forcedStudentCount]);

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
            setError('Los valores deben ser positivos.');
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
                <Input 
                    label="Cantidad de Alumnos" 
                    value={numStudents} 
                    onChange={(e) => !forcedStudentCount && setNumStudents(e.target.value)} 
                    min="1" 
                    type="number"
                    disabled={!!forcedStudentCount}
                    className={`w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${forcedStudentCount ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                {forcedStudentCount && <p className="text-xs text-slate-400 mt-[-10px]">* Calculado automáticamente según alumnos inscritos</p>}
                
                <Input label="Número de Sesiones" value={numSessions} onChange={(e) => setNumSessions(e.target.value)} min="1" type="number" />
                <Input label="Faltas Totales del Grupo" value={totalAbsences} onChange={(e) => setTotalAbsences(e.target.value)} min="0" type="number" />
            </div>
            <button onClick={handleCalculate} className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                Calcular Asistencia
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

interface StudentAverageCalculatorProps {
    enrolledStudents?: EnrolledStudent[];
    onSaveGrade?: (studentId: string, grade: number) => void;
}

const StudentAverageCalculator: React.FC<StudentAverageCalculatorProps> = ({ enrolledStudents, onSaveGrade }) => {
    const [criteria, setCriteria] = useState<Criterion[]>([{ id: crypto.randomUUID(), name: '', score: '' }]);
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');

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
            setError('Los puntajes no pueden ser negativos.');
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

    const handleSave = () => {
        if (result !== null && selectedStudentId && onSaveGrade) {
            onSaveGrade(selectedStudentId, result);
            alert("Calificación guardada correctamente.");
            setResult(null);
            setCriteria([{ id: crypto.randomUUID(), name: '', score: '' }]);
        } else if (!selectedStudentId) {
            setError("Debes seleccionar un alumno para guardar.");
        }
    }

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4 text-sky-400">Evaluar Alumno</h2>
            
            {enrolledStudents && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Seleccionar Alumno</label>
                    <select 
                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                        <option value="">-- Selecciona un alumno --</option>
                        {enrolledStudents.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name} {s.grade !== null ? `(Actual: ${s.grade})` : '(Sin Calif.)'}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="space-y-4">
                {criteria.map((criterion, index) => (
                    <div key={criterion.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6">
                            <Input label={`Criterio ${index + 1}`} type="text" placeholder="Ej: Examen" value={criterion.name} onChange={(e) => handleCriteriaChange(criterion.id, 'name', e.target.value)} />
                        </div>
                        <div className="col-span-5">
                            <Input label="Puntaje" value={criterion.score} onChange={(e) => handleCriteriaChange(criterion.id, 'score', e.target.value)} min="0" max="100" type="number" />
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
                Calcular Promedio
            </button>
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            
            {result !== null && (
                 <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-sky-900">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <ResultDisplay title="Calificación Calculada" value={result.toFixed(0)} unit="/ 100" />
                    </div>
                    {enrolledStudents && onSaveGrade && (
                        <button 
                            onClick={handleSave}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Guardar en Boleta del Alumno
                        </button>
                    )}
                    {enrolledStudents && !onSaveGrade && (
                        <div className="text-center p-2 bg-yellow-900/30 border border-yellow-700/50 rounded mt-2">
                             <p className="text-xs text-yellow-400">
                                <span className="font-bold">Modo Solo Lectura:</span> Solo el personal administrativo puede guardar la calificación final en el sistema.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

interface GroupAverageCalculatorProps {
    enrolledStudents?: EnrolledStudent[];
}

const GroupAverageCalculator: React.FC<GroupAverageCalculatorProps> = ({ enrolledStudents }) => {
    const [manualStudents, setManualStudents] = useState<Student[]>([{ id: crypto.randomUUID(), grade: '' }]);
    const [result, setResult] = useState<GroupAverageResult | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (enrolledStudents && enrolledStudents.length > 0) {
            calculateStats(enrolledStudents.map(s => s.grade ?? 0));
        } else if (enrolledStudents && enrolledStudents.length === 0) {
            setResult(null);
        }
    }, [enrolledStudents]);

    const handleManualStudentChange = (id: string, value: string) => {
        setManualStudents(manualStudents.map(s => s.id === id ? { ...s, grade: value } : s));
    };

    const addManualStudent = () => {
        setManualStudents([...manualStudents, { id: crypto.randomUUID(), grade: '' }]);
    };
    
    const removeManualStudent = (id: string) => {
        if (manualStudents.length > 1) {
            setManualStudents(manualStudents.filter(s => s.id !== id));
        }
    };

    const handleCalculateManual = () => {
        const numericGrades = manualStudents.map(s => parseInt(s.grade, 10));
        if (numericGrades.some(isNaN)) {
            setError('Todas las calificaciones deben ser números.');
            setResult(null);
            return;
        }
        calculateStats(numericGrades);
    };

    const calculateStats = (numericGrades: number[]) => {
         if (numericGrades.some(g => g < 0 || g > 100)) {
            setError('Las calificaciones deben estar entre 0 y 100.');
            setResult(null);
            return;
        }
        
        const studentsCount = numericGrades.length;
        if(studentsCount === 0) {
            setResult(null);
            return;
        }

        const sum = numericGrades.reduce((acc, grade) => acc + grade, 0);
        const failedCount = numericGrades.filter(g => g <= 59).length;
        const passedCount = studentsCount - failedCount;
        
        const groupAverage = sum / studentsCount;
        const averageOn10 = groupAverage / 10;
        const approvalRate = (passedCount / studentsCount) * 100;
        
        setResult({ groupAverage, averageOn10, approvalRate, passedCount, failedCount });
        setError('');
    }

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4 text-sky-400">Estadísticas del Grupo</h2>
            {enrolledStudents ? (
                <div className="space-y-4">
                     <div className="max-h-60 overflow-y-auto bg-slate-900 rounded p-4 border border-slate-700">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 text-slate-400">
                                    <th className="pb-2">Alumno</th>
                                    <th className="pb-2 text-right">Calificación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrolledStudents.map(s => (
                                    <tr key={s.id} className="border-b border-slate-800 last:border-0">
                                        <td className="py-2">{s.name}</td>
                                        <td className={`py-2 text-right font-bold ${(s.grade ?? 0) < 60 ? 'text-red-400' : 'text-green-400'}`}>
                                            {s.grade ?? '-'}
                                        </td>
                                    </tr>
                                ))}
                                {enrolledStudents.length === 0 && (
                                    <tr><td colSpan={2} className="py-4 text-center text-slate-500">No hay alumnos en este grupo.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                     {manualStudents.map((student, index) => (
                        <div key={student.id} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-11">
                                <Input 
                                    label={`Calificación Alumno ${index + 1}`} 
                                    value={student.grade} 
                                    onChange={(e) => handleManualStudentChange(student.id, e.target.value)} 
                                    min="0" 
                                    max="100" 
                                    placeholder="0-100"
                                    type="number"
                                />
                            </div>
                             <div className="col-span-1 flex items-end justify-center h-full pb-2">
                                 {manualStudents.length > 1 && (
                                    <button onClick={() => removeManualStudent(student.id)} className="text-slate-500 hover:text-red-400 transition-colors" aria-label="Eliminar alumno">
                                        <RemoveIcon />
                                    </button>
                                 )}
                            </div>
                        </div>
                    ))}
                     {manualStudents.length < 50 && (
                         <button onClick={addManualStudent} className="w-full text-sky-400 border border-sky-400 hover:bg-sky-900 font-bold py-2 px-4 rounded-md transition-colors duration-200">
                            + Agregar Alumno
                        </button>
                    )}
                     <button onClick={handleCalculateManual} className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                        Calcular
                    </button>
                </div>
            )}

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

const LandingScreen: React.FC<{ onSelectStudent: () => void, onSelectTeacher: () => void }> = ({ onSelectStudent, onSelectTeacher }) => {
    return (
        <div className="flex flex-col items-center justify-center pt-20 animate-fade-in">
            <h1 className="text-4xl font-extrabold text-white mb-2 text-center">Bienvenido</h1>
            <p className="text-slate-400 mb-12 text-center">Sistema de Evaluación Secundaria Num. 5</p>
            
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl px-4">
                <button 
                    onClick={onSelectStudent}
                    className="flex-1 bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 text-white p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center gap-4 group"
                >
                    <div className="bg-white/20 p-4 rounded-full group-hover:bg-white/30 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold">Soy Alumno</span>
                    <span className="text-green-200 text-sm">Consultar calificaciones</span>
                </button>

                <button 
                    onClick={onSelectTeacher}
                    className="flex-1 bg-gradient-to-br from-sky-600 to-sky-800 hover:from-sky-500 hover:to-sky-700 text-white p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center gap-4 group"
                >
                     <div className="bg-white/20 p-4 rounded-full group-hover:bg-white/30 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold">Soy Docente</span>
                     <span className="text-sky-200 text-sm">Administrar y evaluar</span>
                </button>
            </div>
        </div>
    );
};

const StudentPortal: React.FC<{ classrooms: Classroom[], students: EnrolledStudent[], onBack: () => void }> = ({ classrooms, students, onBack }) => {
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [accessCodeInput, setAccessCodeInput] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');
    
    // Derived state
    const filteredStudents = students.filter(s => s.classroomId === selectedClassId);
    const selectedStudent = students.find(s => s.id === selectedStudentId);
    const currentClass = classrooms.find(c => c.id === selectedClassId);

    const handleVerify = () => {
        if (!selectedStudent) return;
        
        // Verifica si el código coincide (o si no tiene código asignado, déjalo pasar por ahora)
        if (!selectedStudent.access_code || selectedStudent.access_code === accessCodeInput.trim()) {
            setIsAuthenticated(true);
            setAuthError('');
        } else {
            setAuthError('Contraseña incorrecta. Inténtalo de nuevo.');
            setIsAuthenticated(false);
        }
    };

    return (
        <div className="flex flex-col items-center pt-10 px-4 animate-fade-in">
             <button onClick={onBack} className="self-start mb-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                &larr; Volver al Inicio
            </button>
            
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Consulta de Alumnos</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">1. Selecciona tu Grupo</label>
                        <select 
                            className="w-full bg-slate-700 border border-slate-600 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={selectedClassId}
                            onChange={(e) => {
                                setSelectedClassId(e.target.value);
                                setSelectedStudentId('');
                                setIsAuthenticated(false);
                                setAccessCodeInput('');
                                setAuthError('');
                            }}
                        >
                            <option value="">-- Selecciona grupo --</option>
                            {classrooms.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedClassId && (
                         <div className="animate-fade-in">
                            <label className="block text-sm font-medium text-slate-400 mb-1">2. Busca tu Nombre</label>
                            <select 
                                className="w-full bg-slate-700 border border-slate-600 rounded-md py-3 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={selectedStudentId}
                                onChange={(e) => {
                                    setSelectedStudentId(e.target.value);
                                    setIsAuthenticated(false);
                                    setAccessCodeInput('');
                                    setAuthError('');
                                }}
                            >
                                <option value="">-- Selecciona tu nombre --</option>
                                {filteredStudents.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            {filteredStudents.length === 0 && <p className="text-xs text-yellow-400 mt-2">No hay alumnos registrados en este grupo.</p>}
                        </div>
                    )}

                    {/* Authentication Section */}
                    {selectedStudentId && !isAuthenticated && (
                        <div className="animate-fade-in mt-6 pt-4 border-t border-slate-700">
                             <h3 className="text-lg font-bold text-sky-400 mb-3 flex items-center gap-2">
                                <LockIcon /> Seguridad
                             </h3>
                             <p className="text-sm text-slate-400 mb-3">Ingresa la contraseña proporcionada por tu docente.</p>
                             <div className="flex flex-col gap-3">
                                 <Input 
                                    label="Contraseña" 
                                    type="password" 
                                    value={accessCodeInput} 
                                    onChange={(e) => setAccessCodeInput(e.target.value)}
                                    placeholder="Ingresa tu código"
                                 />
                                 <button 
                                    onClick={handleVerify}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                                 >
                                     Ver Mis Calificaciones
                                 </button>
                                 {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
                             </div>
                        </div>
                    )}
                </div>

                {selectedStudent && currentClass && isAuthenticated && (
                    <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-slate-700 text-center animate-fade-in">
                        <div className="mb-4">
                            <p className="text-sm text-slate-400 uppercase tracking-wider">Alumno</p>
                            <h3 className="text-xl font-bold text-white">{selectedStudent.name}</h3>
                        </div>
                        
                        <div className="mb-6">
                             <p className="text-sm text-slate-400 uppercase tracking-wider">Grupo</p>
                             <p className="text-lg text-sky-400 font-medium">{currentClass.name}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                             <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Calificación Final</p>
                             {selectedStudent.grade !== null ? (
                                <span className={`text-4xl font-extrabold ${selectedStudent.grade >= 60 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedStudent.grade}
                                </span>
                             ) : (
                                 <span className="text-xl text-slate-500 italic">No asignada</span>
                             )}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

const LoginScreen: React.FC<{ onLogin: (u: string, p: string) => void, error: string, onReset: () => void, onBack: () => void }> = ({ onLogin, error, onReset, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(username, password);
    }

    return (
        <div className="flex flex-col items-center justify-center pt-10 animate-fade-in">
            <button onClick={onBack} className="self-start ml-4 sm:ml-0 md:absolute md:top-24 md:left-10 mb-6 text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                &larr; Volver al Inicio
            </button>
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Acceso Docentes</h2>
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
                <div className="text-center mt-4">
                    <button 
                        type="button" 
                        onClick={onReset} 
                        className="text-xs text-slate-500 underline hover:text-sky-400 transition-colors"
                    >
                        Restaurar Datos de Prueba
                    </button>
                </div>
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
    const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'docente' as Role });
    const [newClass, setNewClass] = useState({ name: '', teacherId: '' });
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentDOB, setNewStudentDOB] = useState(''); // Estado para fecha nacimiento

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

    const generateAccessCode = () => {
        // Genera un código aleatorio de 6 caracteres (mayúsculas y números)
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const handleAddStudent = () => {
        if(selectedClassId && newStudentName && newStudentDOB) {
            const uniqueCode = generateAccessCode();
            actions.addStudent({
                id: crypto.randomUUID(),
                name: newStudentName,
                classroomId: selectedClassId,
                grade: null,
                dob: newStudentDOB,
                access_code: uniqueCode // Guarda el código generado
            });
            setNewStudentName('');
            setNewStudentDOB('');
            alert(`Alumno registrado.\nIMPORTANTE: La contraseña del alumno es: ${uniqueCode}`);
        } else {
            alert("Por favor ingresa nombre y fecha de nacimiento.");
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
                    
                    <div className="bg-slate-700 p-4 rounded-lg mb-6 border border-slate-600">
                        <h3 className="font-bold text-sky-400 mb-2">Registrar Nuevo Alumno</h3>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-grow w-full">
                                <Input label="Nombre del Alumno" value={newStudentName} onChange={e => setNewStudentName(e.target.value)} placeholder="Ej: Juan Perez" />
                            </div>
                            <div className="w-full md:w-1/3">
                                <Input label="Fecha de Nacimiento" type="date" value={newStudentDOB} onChange={e => setNewStudentDOB(e.target.value)} />
                            </div>
                            <button onClick={handleAddStudent} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md h-10 mb-[1px]">
                                Generar Alta
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {classStudents.map(student => (
                            <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-700 p-3 rounded gap-3">
                                <div className="flex-grow">
                                    <span className="font-bold block">{student.name}</span>
                                    <span className="text-xs text-slate-400">
                                        Nacimiento: {student.dob || 'N/A'} | 
                                        Contraseña: <span className="text-yellow-400 font-mono font-bold bg-slate-800 px-1 rounded ml-1 select-all">{student.access_code || 'Sin código'}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 justify-end">
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
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => {
                                                const newPass = prompt(`Ingrese la nueva contraseña para ${teacher.name}:`);
                                                if (newPass) {
                                                    actions.resetPassword(teacher.id, newPass);
                                                    alert('Contraseña actualizada correctamente.');
                                                }
                                            }}
                                            className="text-yellow-400 hover:text-yellow-300 p-1"
                                            title="Cambiar Contraseña"
                                        >
                                            <KeyIcon />
                                        </button>
                                        <button onClick={() => actions.deleteUser(teacher.id)} className="text-red-400 hover:text-red-300 p-1">
                                            <RemoveIcon />
                                        </button>
                                    </div>
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
// (No changes needed in layout, just re-using the async actions passed from parent)

interface TeacherDashboardProps {
    currentUser: User;
    classrooms: Classroom[];
    students: EnrolledStudent[];
    actions: any;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, classrooms, students, actions }) => {
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabOption>('attendance');

    const myClassrooms = classrooms.filter(c => c.teacherId === currentUser.id);

    if (selectedClassId) {
        const currentClass = classrooms.find(c => c.id === selectedClassId);
        const classStudents = students.filter(s => s.classroomId === selectedClassId);
        
        const renderContent = () => {
            switch (activeTab) {
                case 'attendance':
                    return <AttendanceCalculator forcedStudentCount={classStudents.length} />;
                case 'student':
                    return <StudentAverageCalculator enrolledStudents={classStudents} />;
                case 'group':
                    return <GroupAverageCalculator enrolledStudents={classStudents} />;
                default:
                    return null;
            }
        };

        return (
            <div>
                 <button onClick={() => setSelectedClassId(null)} className="mb-4 text-sky-400 hover:text-sky-300 flex items-center gap-1">
                    &larr; Volver a Mis Salones
                </button>
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-1">{currentClass?.name}</h2>
                    <p className="text-slate-400">Gestionando {classStudents.length} alumnos</p>
                </div>
                
                <nav className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8 overflow-x-auto">
                    <Tab 
                    label="Asistencia" 
                    isActive={activeTab === 'attendance'} 
                    onClick={() => setActiveTab('attendance')} 
                    icon={<AttendanceIcon />}
                    />
                    <Tab 
                    label="Evaluación Alumno" 
                    isActive={activeTab === 'student'} 
                    onClick={() => setActiveTab('student')}
                    icon={<StudentIcon />}
                    />
                    <Tab 
                    label="Estadísticas Grupo" 
                    isActive={activeTab === 'group'} 
                    onClick={() => setActiveTab('group')} 
                    icon={<GroupIcon />}
                    />
                </nav>
                
                <main>
                    {renderContent()}
                </main>
            </div>
        )
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Selecciona un Salón para trabajar</h2>
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
            
            <div className="mt-12 pt-8 border-t border-slate-800">
                <h3 className="text-xl text-slate-500 mb-4 text-center">Calculadoras Rápidas (Sin guardar datos)</h3>
                <div className="flex justify-center gap-4 flex-wrap">
                    <button onClick={() => setSelectedClassId('manual')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded border border-slate-700">
                        Calculadora Manual
                    </button>
                </div>
                {selectedClassId === 'manual' && (
                     <div className="mt-8">
                         <button onClick={() => setSelectedClassId(null)} className="mb-4 text-sky-400 hover:text-sky-300 flex items-center gap-1 mx-auto">
                            &uarr; Cerrar Manual
                        </button>
                        <div className="max-w-3xl mx-auto">
                            <StudentAverageCalculator />
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
}

// --- MAIN APP ---

type ViewMode = 'landing' | 'login' | 'student';

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [students, setStudents] = useState<EnrolledStudent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('landing');
    const [loginError, setLoginError] = useState('');

    // Load Data on Mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [u, c, s] = await Promise.all([
                    db.getUsers(),
                    db.getClassrooms(),
                    db.getStudents()
                ]);
                setUsers(u);
                setClassrooms(c);
                setStudents(s);
            } catch(e) {
                console.error("Error loading DB", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

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
        setViewMode('landing');
    }

    const handleResetData = async () => {
        if(window.confirm("¿Estás seguro de restaurar los datos de prueba? Se borrarán todos los usuarios y salones creados.")){
            setIsLoading(true);
            await db.resetDatabase();
            window.location.reload();
        }
    }

    // Acciones Wrapper Asíncronas
    const createAsyncAction = (action: (...args: any[]) => Promise<any>, updateState: (data: any) => void) => {
        return async (...args: any[]) => {
            setIsLoading(true);
            try {
                const newData = await action(...args);
                updateState(newData);
            } finally {
                setIsLoading(false);
            }
        };
    };

    const dbActions = {
        addUser: createAsyncAction((u) => db.addUser(u), setUsers),
        deleteUser: createAsyncAction((id) => db.deleteUser(id), setUsers),
        resetPassword: createAsyncAction((id, pass) => db.updateUserPassword(id, pass), setUsers),
        
        addClassroom: createAsyncAction((c) => db.addClassroom(c), setClassrooms),
        deleteClassroom: createAsyncAction((id) => db.deleteClassroom(id), setClassrooms),
        
        addStudent: createAsyncAction((s) => db.addStudent(s), setStudents),
        deleteStudent: createAsyncAction((id) => db.deleteStudent(id), setStudents),
        updateGrade: createAsyncAction((id, g) => db.updateStudentGrade(id, g), setStudents)
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl text-white font-bold">Cargando Sistema...</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl flex items-center gap-2">
                             <HomeIcon />
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
                    {!currentUser && viewMode === 'landing' && (
                        <LandingScreen 
                            onSelectStudent={() => setViewMode('student')}
                            onSelectTeacher={() => setViewMode('login')}
                        />
                    )}

                    {!currentUser && viewMode === 'student' && (
                        <StudentPortal 
                            classrooms={classrooms}
                            students={students}
                            onBack={() => setViewMode('landing')}
                        />
                    )}

                    {!currentUser && viewMode === 'login' && (
                        <LoginScreen 
                            onLogin={handleLogin} 
                            error={loginError} 
                            onReset={handleResetData} 
                            onBack={() => setViewMode('landing')}
                        />
                    )}
                    
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
