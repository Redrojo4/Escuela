import React, { useState, useEffect, useMemo, forwardRef } from 'react';
import { 
  Users, 
  GraduationCap, 
  School, 
  LogOut, 
  User as UserIcon, 
  LayoutDashboard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ChevronLeft, 
  Calculator, 
  BarChart3, 
  ClipboardCheck,
  Key,
  Calendar,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from './lib/db';
import { User, Classroom, Student, UserRole } from './types';
import logo from './assets/logo.png';

// --- COMPONENTS ---
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl ${className}`}>
    {children}
  </div>
);

const Input = forwardRef(({ label, id, type = 'text', ...props }: any, ref: any) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
    <input 
      id={id} 
      ref={ref} 
      type={type} 
      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" 
      {...props} 
    />
  </div>
));

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const variants: any = {
    primary: 'bg-sky-600 hover:bg-sky-500 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    ghost: 'hover:bg-slate-700/50 text-slate-400 hover:text-white'
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const ResultDisplay = ({ title, value, unit, color = 'text-sky-400' }: any) => (
  <div className="flex flex-col items-center justify-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">{title}</span>
    <span className={`text-2xl font-mono font-bold ${color}`}>{value}<span className="text-sm ml-1 opacity-70">{unit}</span></span>
  </div>
);

// --- VIEWS ---

const Landing = ({ onStudent, onTeacher }: any) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center gap-12 px-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <img 
        src={logo} 
        alt="Logo" 
        className="w-32 h-32 rounded-full mx-auto shadow-2xl border-4 border-sky-500/20"
      />
      <h1 className="text-4xl font-black tracking-tight text-white">SISTEMA ESCOLAR</h1>
      <p className="text-slate-400 font-medium">Escuela Secundaria Num. 5 "Gral. Carolina Balboa Gojon"</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStudent}
        className="group relative overflow-hidden bg-emerald-600/10 border border-emerald-500/30 p-8 rounded-2xl text-left transition-all hover:border-emerald-500/60"
      >
        <div className="relative z-10 space-y-2">
          <GraduationCap className="w-12 h-12 text-emerald-400 mb-4" />
          <h3 className="text-2xl font-bold text-emerald-500">Soy Alumno</h3>
          <p className="text-slate-400 text-sm">Consulta tus calificaciones y promedio parcial.</p>
        </div>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onTeacher}
        className="group relative overflow-hidden bg-sky-600/10 border border-sky-500/30 p-8 rounded-2xl text-left transition-all hover:border-sky-500/60"
      >
        <div className="relative z-10 space-y-2">
          <School className="w-12 h-12 text-sky-400 mb-4" />
          <h3 className="text-2xl font-bold text-sky-500">Soy Docente</h3>
          <p className="text-slate-400 text-sm">Gestiona grupos, alumnos y evaluaciones.</p>
        </div>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-500/20 transition-all" />
      </motion.button>
    </div>
  </div>
);

const Login = ({ users, onLogin, onBack }: any) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const found = users.find((x: any) => x.username === u && x.password === p);
    if (found) {
      onLogin(found);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold">Bienvenido</h2>
            <p className="text-sm text-slate-400">Ingresa tus credenciales para continuar</p>
          </div>
          <div className="space-y-4">
            <Input label="Usuario" value={u} onChange={(e: any) => setU(e.target.value)} />
            <Input label="Contraseña" type="password" value={p} onChange={(e: any) => setP(e.target.value)} />
            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
            <Button onClick={handleLogin} className="w-full py-3">Iniciar Sesión</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const StudentPortal = ({ data, onBack }: any) => {
  const [cId, setCId] = useState('');
  const [sId, setSId] = useState('');
  const [code, setCode] = useState('');
  const [auth, setAuth] = useState(false);

  const students = useMemo(() => data.students.filter((s: any) => s.classroomId === cId), [data.students, cId]);
  const student = useMemo(() => students.find((s: any) => s.id === sId), [students, sId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
        {!auth ? (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold">Portal del Alumno</h2>
              <p className="text-sm text-slate-400">Selecciona tu grupo y nombre</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Grupo</label>
                <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white" value={cId} onChange={e => setCId(e.target.value)}>
                  <option value="">Seleccionar Grupo...</option>
                  {data.classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Alumno</label>
                <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white" value={sId} onChange={e => setSId(e.target.value)} disabled={!cId}>
                  <option value="">Seleccionar Alumno...</option>
                  {students.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <Input label="Código de Acceso" type="password" value={code} onChange={(e: any) => setCode(e.target.value)} />
              <Button onClick={() => student?.access_code === code ? setAuth(true) : alert('Código incorrecto')} className="w-full py-3" variant="success">Ver Calificaciones</Button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold">{student.name}</h3>
              <p className="text-slate-400 text-sm">Grupo: {data.classes.find((c: any) => c.id === student.classroomId)?.name}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {student.partialGrades.map((g: any, i: number) => (
                <div key={i} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Parcial {i+1}</span>
                  <span className={`text-xl font-mono font-bold ${g === null ? 'text-slate-600' : g < 60 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {g ?? '--'}
                  </span>
                </div>
              ))}
              <div className="bg-sky-600/10 p-3 rounded-xl border border-sky-500/30 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-sky-500 block mb-1">Promedio</span>
                <span className={`text-xl font-mono font-bold ${student.grade === null ? 'text-slate-600' : student.grade < 60 ? 'text-red-400' : 'text-sky-400'}`}>
                  {student.grade ?? '--'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

// --- TEACHER DASHBOARD ---

const TeacherDashboard = ({ user, data, setData }: any) => {
  const [selClass, setSelClass] = useState<Classroom | null>(null);
  const [tab, setTab] = useState('attendance');
  
  const teacherClasses = useMemo(() => data.classes.filter((c: any) => c.teacherId === user.id), [data.classes, user.id]);

  if (selClass) {
    const students = data.students.filter((s: any) => s.classroomId === selClass.id);
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelClass(null)} className="flex items-center gap-2 text-sky-400 hover:text-sky-300 font-bold transition-colors">
            <ChevronLeft className="w-5 h-5" /> Mis Grupos
          </button>
          <div className="text-right">
            <h2 className="text-xl font-black text-white">{selClass.name}</h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest">{students.length} Alumnos Inscritos</p>
          </div>
        </div>

        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          {[
            { id: 'attendance', label: 'Asistencia', icon: ClipboardCheck },
            { id: 'eval', label: 'Evaluación', icon: Calculator },
            { id: 'stats', label: 'Estadísticas', icon: BarChart3 }
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === t.id ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'attendance' && <AttendanceView studentsCount={students.length} />}
            {tab === 'eval' && <EvaluationView students={students} onSaveGrade={async (id, p, g) => setData({...data, students: await db.updateStudentPartialGrade(id, p, g)})} />}
            {tab === 'stats' && <StatsView students={students} />}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Mis Grupos</h2>
        <div className="bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
          <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">Docente: {user.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teacherClasses.map((c: any) => (
          <motion.div 
            key={c.id}
            whileHover={{ scale: 1.02, translateY: -4 }}
            onClick={() => setSelClass(c)}
            className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 cursor-pointer hover:border-sky-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                <School className="w-6 h-6 text-sky-400" />
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                {data.students.filter((s: any) => s.classroomId === c.id).length} Alumnos
              </span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">{c.name}</h3>
            <p className="text-sm text-slate-400 mt-1">Haga clic para gestionar evaluación y asistencia.</p>
          </motion.div>
        ))}
        {teacherClasses.length === 0 && (
          <div className="col-span-full py-12 text-center space-y-4 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
            <School className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-slate-500 font-medium">No tienes grupos asignados todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AttendanceView = ({ studentsCount }: { studentsCount: number }) => {
  const [sessions, setSessions] = useState('');
  const [absences, setAbsences] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const sess = parseInt(sessions), a = parseInt(absences);
    if (isNaN(sess) || isNaN(a)) return;
    const total = studentsCount * sess;
    const att = ((total - a) / total) * 100;
    setResult({ attendance: att, nonAttendance: 100 - att });
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-sky-500/20 rounded-lg"><ClipboardCheck className="w-5 h-5 text-sky-400" /></div>
        <h3 className="text-lg font-bold">Cálculo de Asistencia Grupal</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Input label="Alumnos" value={studentsCount} disabled type="number" />
        <Input label="Sesiones Totales" value={sessions} onChange={(e: any) => setSessions(e.target.value)} type="number" placeholder="Ej. 40" />
        <div className="sm:col-span-2">
          <Input label="Faltas Acumuladas del Grupo" value={absences} onChange={(e: any) => setAbsences(e.target.value)} type="number" placeholder="Suma de todas las faltas" />
        </div>
      </div>
      <Button onClick={calculate} className="w-full py-3">Calcular Porcentajes</Button>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid grid-cols-2 gap-4">
          <ResultDisplay title="Asistencia" value={result.attendance.toFixed(2)} unit="%" color="text-emerald-400" />
          <ResultDisplay title="Inasistencia" value={result.nonAttendance.toFixed(2)} unit="%" color="text-red-400" />
        </motion.div>
      )}
    </Card>
  );
};

const EvaluationView = ({ students, onSaveGrade }: any) => {
  const [selId, setSelId] = useState('');
  const [selP, setSelP] = useState(0);
  const [criteria, setCriteria] = useState([{ id: 1, name: '', score: '' }]);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const sum = criteria.reduce((a, c) => a + (parseInt(c.score) || 0), 0);
    setResult(sum);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/20 rounded-lg"><Calculator className="w-5 h-5 text-emerald-400" /></div>
          <h3 className="text-lg font-bold">Calculadora de Evaluación</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Alumno</label>
            <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white" value={selId} onChange={e => setSelId(e.target.value)}>
              <option value="">Seleccionar Alumno...</option>
              {students.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Parcial</label>
            <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white" value={selP} onChange={e => setSelP(parseInt(e.target.value))}>
              {[0,1,2,3,4].map(i => <option key={i} value={i}>Parcial {i+1}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Criterios de Evaluación</span>
            <span className="text-xs font-bold text-slate-400">Total: {criteria.reduce((a, c) => a + (parseInt(c.score) || 0), 0)} pts</span>
          </div>
          {criteria.map((c, i) => (
            <div key={c.id} className="flex gap-2">
              <input className="flex-grow bg-slate-900/50 border border-slate-700 p-2 rounded-lg text-sm" placeholder="Ej. Examen, Tareas..." value={c.name} onChange={e => setCriteria(criteria.map(x => x.id === c.id ? {...x, name: e.target.value} : x))} />
              <input className="w-24 bg-slate-900/50 border border-slate-700 p-2 rounded-lg text-sm font-mono text-center" type="number" placeholder="Pts" value={c.score} onChange={e => setCriteria(criteria.map(x => x.id === c.id ? {...x, score: e.target.value} : x))} />
              {criteria.length > 1 && (
                <button onClick={() => setCriteria(criteria.filter(x => x.id !== c.id))} className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          ))}
          <button onClick={() => setCriteria([...criteria, { id: Date.now(), name: '', score: '' }])} className="text-sky-400 text-xs font-bold flex items-center gap-1 hover:text-sky-300 transition-colors">
            <Plus className="w-3 h-3" /> Añadir Criterio
          </button>
        </div>

        <div className="flex gap-3">
          <Button onClick={calculate} className="flex-1 py-3">Calcular</Button>
          {result !== null && selId && (
            <Button onClick={() => { onSaveGrade(selId, selP, result); setResult(null); }} variant="success" className="flex-1 py-3">
              <CheckCircle2 className="w-5 h-5" /> Guardar Nota
            </Button>
          )}
        </div>
      </Card>

      <div className="space-y-6">
        {result !== null && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <ResultDisplay title="Resultado Final" value={result.toString()} unit="/100" color={result < 60 ? 'text-red-400' : 'text-emerald-400'} />
          </motion.div>
        )}
        <Card className="p-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Notas Recientes</h4>
          <div className="space-y-2">
            {students.slice(0, 5).map((s: any) => (
              <div key={s.id} className="flex justify-between items-center p-2 bg-slate-900/30 rounded-lg border border-slate-700/30">
                <span className="text-xs font-medium truncate max-w-[120px]">{s.name}</span>
                <span className={`text-xs font-mono font-bold ${s.grade < 60 ? 'text-red-400' : 'text-sky-400'}`}>{s.grade ?? '--'}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatsView = ({ students }: any) => {
  const stats = useMemo(() => {
    if (!students?.length) return null;
    const grades = students.map((s: any) => s.grade || 0);
    const avg = grades.reduce((a: number, b: number) => a + b, 0) / grades.length;
    const failed = grades.filter((g: number) => g < 60).length;
    const passed = grades.length - failed;
    return { avg, app: (passed / grades.length) * 100, failed, passed };
  }, [students]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-sky-500/20 rounded-lg"><BarChart3 className="w-5 h-5 text-sky-400" /></div>
          <h3 className="text-lg font-bold">Resumen de Aprovechamiento</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ResultDisplay title="Promedio Grupal" value={stats.avg.toFixed(1)} unit="" />
          <ResultDisplay title="Tasa de Aprobación" value={stats.app.toFixed(0)} unit="%" color="text-emerald-400" />
          <ResultDisplay title="Alumnos Aprobados" value={stats.passed.toString()} unit="" color="text-emerald-400" />
          <ResultDisplay title="Alumnos Reprobados" value={stats.failed.toString()} unit="" color="text-red-400" />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold mb-6">Distribución de Notas</h3>
        <div className="space-y-4">
          {students.map((s: any) => (
            <div key={s.id} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{s.name}</span>
                <span className={`font-mono font-bold ${s.grade < 60 ? 'text-red-400' : 'text-sky-400'}`}>{s.grade ?? '--'}</span>
              </div>
              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${s.grade || 0}%` }}
                  className={`h-full rounded-full ${s.grade < 60 ? 'bg-red-500' : 'bg-sky-500'}`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// --- ADMIN VIEW ---

const AdminDashboard = ({ data, setData }: any) => {
  const [tab, setTab] = useState('users');
  const [selClass, setSelClass] = useState<Classroom | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Panel de Control</h2>
        <div className="bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Administrador</span>
        </div>
      </div>

      <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
        <button onClick={() => { setTab('users'); setSelClass(null); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'users' && !selClass ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
          <UserIcon className="w-4 h-4" /> Docentes
        </button>
        <button onClick={() => { setTab('classes'); setSelClass(null); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'classes' || selClass ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
          <School className="w-4 h-4" /> Salones y Alumnos
        </button>
      </div>

      {tab === 'users' ? (
        <AdminUsers users={data.users} onUpdate={(u: any) => setData({...data, users: u})} />
      ) : selClass ? (
        <AdminClassDetail 
          classroom={selClass} 
          students={data.students.filter((s: any) => s.classroomId === selClass.id)} 
          onBack={() => setSelClass(null)}
          onUpdateStudents={(s: any) => setData({...data, students: s})}
        />
      ) : (
        <AdminClasses 
          classes={data.classes} 
          users={data.users} 
          onUpdate={(c: any) => setData({...data, classes: c})} 
          onSelect={setSelClass}
        />
      )}
    </div>
  );
};

const AdminUsers = ({ users, onUpdate }: any) => {
  const [n, setN] = useState(''), [u, setU] = useState(''), [p, setP] = useState('');
  const add = async () => {
    if (!n || !u || !p) return;
    const next = await db.addUser({ id: Date.now().toString(), name: n, username: u, password: p, role: 'docente' });
    onUpdate(next);
    setN(''); setU(''); setP('');
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 h-fit">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-sky-400" /> Nuevo Docente</h3>
        <div className="space-y-4">
          <Input label="Nombre Completo" value={n} onChange={(e: any) => setN(e.target.value)} placeholder="Ej. Juan Pérez" />
          <Input label="Usuario" value={u} onChange={(e: any) => setU(e.target.value)} placeholder="Ej. jperez" />
          <Input label="Contraseña" value={p} onChange={(e: any) => setP(e.target.value)} placeholder="Ej. 123456" />
          <Button onClick={add} className="w-full py-3">Registrar Docente</Button>
        </div>
      </Card>
      <div className="lg:col-span-2 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Docentes Registrados</h3>
        {users.filter((x: any) => x.role !== 'admin').map((x: any) => (
          <div key={x.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center group hover:border-sky-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-sky-400 font-bold">
                {x.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{x.name}</p>
                <p className="text-xs text-slate-500">User: {x.username} | Pass: {x.password}</p>
              </div>
            </div>
            <button onClick={async () => onUpdate(await db.deleteUser(x.id))} className="text-slate-500 hover:text-red-400 p-2 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminClasses = ({ classes, users, onUpdate, onSelect }: any) => {
  const [n, setN] = useState(''), [tId, setTId] = useState('');
  const add = async () => {
    if (!n || !tId) return;
    const next = await db.addClassroom({ id: Date.now().toString(), name: n, teacherId: tId });
    onUpdate(next);
    setN(''); setTId('');
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 h-fit">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-sky-400" /> Nuevo Salón</h3>
        <div className="space-y-4">
          <Input label="Nombre del Salón" value={n} onChange={(e: any) => setN(e.target.value)} placeholder="Ej. 1ro A" />
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Docente Asignado</label>
            <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white" value={tId} onChange={e => setTId(e.target.value)}>
              <option value="">Seleccionar Docente...</option>
              {users.filter((u: any) => u.role === 'docente').map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <Button onClick={add} className="w-full py-3">Crear Salón</Button>
        </div>
      </Card>
      <div className="lg:col-span-2 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Salones Activos</h3>
        {classes.map((c: any) => (
          <div key={c.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center group hover:border-sky-500/30 transition-all">
            <div className="flex items-center gap-3 cursor-pointer flex-grow" onClick={() => onSelect(c)}>
              <div className="w-10 h-10 bg-sky-500/10 rounded-lg flex items-center justify-center text-sky-400">
                <School className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white group-hover:text-sky-400 transition-colors">{c.name}</p>
                <p className="text-xs text-slate-500">Docente: {users.find((u: any) => u.id === c.teacherId)?.name || 'No asignado'}</p>
              </div>
            </div>
            <button onClick={async () => onUpdate(await db.deleteClassroom(c.id))} className="text-slate-500 hover:text-red-400 p-2 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminClassDetail = ({ classroom, students, onBack, onUpdateStudents }: any) => {
  const [newName, setNewName] = useState('');
  const add = async () => {
    if (!newName) return;
    const next = await db.addStudent({ 
      id: Date.now().toString(), 
      name: newName, 
      classroomId: classroom.id, 
      access_code: Math.random().toString(36).slice(-6).toUpperCase() 
    });
    onUpdateStudents(next);
    setNewName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sky-400 hover:text-sky-300 font-bold transition-colors">
          <ChevronLeft className="w-5 h-5" /> Volver a Salones
        </button>
        <h3 className="text-xl font-bold">{classroom.name}</h3>
      </div>

      <Card>
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Inscribir Alumno</h4>
        <div className="flex gap-3">
          <input className="flex-grow bg-slate-900/50 border border-slate-700 p-2.5 rounded-lg text-sm" placeholder="Nombre completo del alumno" value={newName} onChange={e => setNewName(e.target.value)} />
          <Button onClick={add} variant="success">Inscribir</Button>
        </div>
      </Card>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Alumnos en este Salón ({students.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {students.map((s: any) => (
            <div key={s.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{s.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 uppercase font-bold">Código:</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{s.access_code}</span>
                </div>
              </div>
              <button onClick={async () => onUpdateStudents(await db.deleteStudent(s.id))} className="text-slate-500 hover:text-red-400 p-2 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [view, setView] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState({ users: [] as User[], classes: [] as Classroom[], students: [] as Student[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [u, c, s] = await Promise.all([db.getUsers(), db.getClassrooms(), db.getStudents()]);
      setData({ users: u, classes: c, students: s });
      setLoading(false);
    })();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full"
      />
    </div>
  );

  const renderContent = () => {
    if (user?.role === 'admin') return <AdminDashboard data={data} setData={setData} />;
    if (user?.role === 'docente') return <TeacherDashboard user={user} data={data} setData={setData} />;
    if (view === 'student') return <StudentPortal data={data} onBack={() => setView('landing')} />;
    if (view === 'login') return <Login users={data.users} onLogin={(u: User) => setUser(u)} onBack={() => setView('landing')} />;
    return <Landing onStudent={() => setView('student')} onTeacher={() => setView('login')} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20 md:pb-8">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{user.role}</p>
              </div>
              <button 
                onClick={() => { setUser(null); setView('landing'); }}
                className="p-2 bg-slate-800 hover:bg-red-600/20 text-slate-400 hover:text-red-400 rounded-lg transition-all border border-slate-700"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (user?.id || '')}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Navigation (Only if logged in) */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-6 py-3 flex justify-around items-center z-50">
          <button onClick={() => setView('landing')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors">
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Inicio</span>
          </button>
          <button onClick={() => setUser(null)} className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase">Salir</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
