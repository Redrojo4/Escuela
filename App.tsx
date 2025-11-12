import React, { useState } from 'react';
import { TabOption, AttendanceResult, GroupAverageResult, Criterion, Student } from './types';
import { Card } from './components/Card';
import { Input } from './components/Input';
import { Tab } from './components/Tab';

// SVG Icons for tabs
const AttendanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const StudentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const GroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.5 5.5a3 3 0 00-3 0V13a1 1 0 00-1 1v1a1 1 0 001 1h3a1 1 0 001-1v-1a1 1 0 00-1-1v-.5zM15.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3 5.5a3 3 0 013-3h1a3 3 0 013 3v.5a1 1 0 01-1 1v1a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a1 1 0 01-1-1V11.5z" /></svg>;
const RemoveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;

const ResultDisplay: React.FC<{ title: string; value: string; unit: string; valueClassName?: string }> = ({ title, value, unit, valueClassName = 'text-sky-400' }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg text-center">
        <span className="text-sm text-slate-400">{title}</span>
        <span className={`text-2xl font-bold ${valueClassName}`}>
            {value}<span className="text-lg ml-1">{unit}</span>
        </span>
    </div>
);

// --- CALCULATOR COMPONENTS ---

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
    const [students, setStudents] = useState<Student[]>([{ id: crypto.randomUUID(), name: '', grade: '' }]);
    const [result, setResult] = useState<GroupAverageResult | null>(null);
    const [error, setError] = useState<string>('');

    const handleStudentChange = (id: string, field: 'name' | 'grade', value: string) => {
        setStudents(students.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const addStudent = () => {
        if (students.length <= 60) {
            setStudents([...students, { id: crypto.randomUUID(), name: '', grade: '' }]);
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
            setError('Todas las calificaciones de los alumnos deben ser números.');
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
        const failedCount = numericGrades.filter(g => g <= 60).length;
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
                        <div className="col-span-6">
                            <Input label={`Alumno ${index + 1}`} type="text" placeholder="Nombre..." value={student.name} onChange={(e) => handleStudentChange(student.id, 'name', e.target.value)} />
                        </div>
                        <div className="col-span-5">
                            <Input label="Calificación" value={student.grade} onChange={(e) => handleStudentChange(student.id, 'grade', e.target.value)} min="0" max="100" />
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
            
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            
            {result && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ResultDisplay title="Promedio Grupo" value={result.groupAverage.toFixed(2)} unit="/100" />
                    <ResultDisplay title="Promedio" value={result.averageOn10.toFixed(2)} unit="/10" />
                    <ResultDisplay title="% Aprobación" value={result.approvalRate.toFixed(2)} unit="%" valueClassName={result.approvalRate >= 60 ? 'text-green-400' : 'text-yellow-400'}/>
                    <ResultDisplay title="Reprobados" value={result.failedCount.toString()} unit="alumnos" valueClassName={result.failedCount > 0 ? 'text-red-400' : 'text-sky-400'}/>
                </div>
            )}
        </Card>
    );
};

const App: React.FC = () => {
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
        <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        <p>Calculadora de Evaluación</p> 
                                <p>Sec. Num 5</p>
                    </h1>
                    <p className="mt-3 text-lg text-slate-400">Una herramienta para gestión de clases</p>
                </header>
                
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
                 <footer className="text-center mt-12 text-slate-500 text-sm">
                    <p>Creado por Pablo Soriano.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;