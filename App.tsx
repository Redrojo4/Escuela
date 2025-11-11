
import React, { useState, useMemo } from 'react';
import { TabOption, AttendanceResult, GroupAverageResult } from './types';
import { Card } from './components/Card';
import { Input } from './components/Input';
import { Tab } from './components/Tab';

// SVG Icons for tabs
const AttendanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const StudentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const GroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.5 5.5a3 3 0 00-3 0V13a1 1 0 00-1 1v1a1 1 0 001 1h3a1 1 0 001-1v-1a1 1 0 00-1-1v-.5zM15.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm-3 5.5a3 3 0 013-3h1a3 3 0 013 3v.5a1 1 0 01-1 1v1a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a1 1 0 01-1-1V11.5z" /></svg>;

const ResultDisplay: React.FC<{ title: string; value: string; unit: string }> = ({ title, value, unit }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-700 rounded-lg text-center">
        <span className="text-sm text-slate-400">{title}</span>
        <span className="text-2xl font-bold text-sky-400">
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
    const [numCriteria, setNumCriteria] = useState('1');
    const [criteria, setCriteria] = useState<string[]>(['']);
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string>('');

    React.useEffect(() => {
        const count = parseInt(numCriteria) || 0;
        if (count > 0 && count <= 20) {
             setCriteria(c => {
                const newCriteria = [...c];
                while (newCriteria.length < count) newCriteria.push('');
                return newCriteria.slice(0, count);
             });
        }
    }, [numCriteria]);
    
    const handleCriteriaChange = (index: number, value: string) => {
        const newCriteria = [...criteria];
        newCriteria[index] = value;
        setCriteria(newCriteria);
    };

    const handleCalculate = () => {
        const scores = criteria.map(c => parseInt(c, 10));
        if (scores.some(isNaN)) {
            setError('Todos los criterios deben tener un valor numérico.');
            setResult(null);
            return;
        }
        
        if(scores.some(s => s < 0)) {
            setError('Las calificaciones de los criterios no pueden ser negativas.');
            setResult(null);
            return;
        }

        const total = scores.reduce((sum, score) => sum + score, 0);
        
        if (total > 100) {
            setError(`La suma de criterios (${total}) no puede superar 100.`);
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
                <Input label="Cantidad de Criterios de Evaluación" value={numCriteria} onChange={(e) => setNumCriteria(e.target.value)} min="1" max="20" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                    {criteria.map((value, index) => (
                        <Input key={index} label={`Criterio ${index + 1}`} value={value} onChange={(e) => handleCriteriaChange(index, e.target.value)} min="0" max="100" />
                    ))}
                </div>
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
    const [numStudents, setNumStudents] = useState('1');
    const [grades, setGrades] = useState<string[]>(['']);
    const [result, setResult] = useState<GroupAverageResult | null>(null);
    const [error, setError] = useState<string>('');

    React.useEffect(() => {
        const count = parseInt(numStudents) || 0;
        if (count > 0 && count <= 50) { // Limit to 50 students for performance
            setGrades(g => {
                const newGrades = [...g];
                while (newGrades.length < count) newGrades.push('');
                return newGrades.slice(0, count);
            });
        }
    }, [numStudents]);

    const handleGradeChange = (index: number, value: string) => {
        const newGrades = [...grades];
        newGrades[index] = value;
        setGrades(newGrades);
    };
    
    const handleCalculate = () => {
        const numericGrades = grades.map(g => parseInt(g, 10));

        if (numericGrades.some(isNaN)) {
            setError('Todas las calificaciones de los alumnos deben ser números.');
            setResult(null);
            return;
        }

        if (numericGrades.some(g => g < 10 || g > 100)) {
            setError('Las calificaciones deben estar entre 10 y 100.');
            setResult(null);
            return;
        }
        
        const studentsCount = numericGrades.length;
        const sum = numericGrades.reduce((acc, grade) => acc + grade, 0);
        const failedCount = numericGrades.filter(g => g <= 50).length;
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
            <Input label="Cantidad de Alumnos" value={numStudents} onChange={(e) => setNumStudents(e.target.value)} min="1" max="50" />

            <div className="mt-4 max-h-80 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {grades.map((grade, index) => (
                        <Input key={index} label={`Alumno ${index + 1}`} value={grade} onChange={(e) => handleGradeChange(index, e.target.value)} min="10" max="100"/>
                    ))}
                </div>
            </div>

            <button onClick={handleCalculate} className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                Calcular
            </button>
            
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            
            {result && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ResultDisplay title="Promedio Grupo" value={result.groupAverage.toFixed(2)} unit="/100" />
                    <ResultDisplay title="Promedio" value={result.averageOn10.toFixed(2)} unit="/10" />
                    <ResultDisplay title="% Aprobación" value={result.approvalRate.toFixed(2)} unit="%" />
                    <ResultDisplay title="Reprobados" value={result.failedCount.toString()} unit="alumnos" />
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
                        Calculadora de Papá
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
                    <p>Adaptado de la idea original de Pablo Soriano.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
