
import React, { useState, useMemo, useEffect } from 'react';
import { StudentRecord, SubgroupFilter, AIAnalysisResult } from '../types';
import StudentTable from './StudentTable';
import InsightCard from './InsightCard';
import { getMathInsights } from '../services/geminiService';
import { Filter, BrainCircuit, RefreshCw, Users, BookOpen, Layers } from 'lucide-react';
import { calculateProficiencyRate } from "../utils/proficiency";


interface DashboardProps {
  students: StudentRecord[];
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, onReset }) => {
  const [activeFilter, setActiveFilter] = useState<SubgroupFilter>('ALL');
  const [aiInsights, setAiInsights] = useState<AIAnalysisResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const filteredStudents = useMemo(() => {
    switch (activeFilter) {
      case 'ELL':
        return students.filter(s => {
          const val = parseInt(s.ell);
          return val >= 1 && val <= 4;
        });
      case 'ESE':
        return students.filter(s => s.ese && s.ese.trim() !== "");
      case 'L25':
        return students.filter(s => s.l25l35Indicator === 'L25');
      case 'L35':
        return students.filter(s => s.l25l35Indicator === 'L35');
      case 'IMPROVED':
        return students.filter(s => s.growthStatus === 'Improved');
      case 'MAINTAINED':
        return students.filter(s => s.growthStatus === 'Maintained');
      case 'REGRESSED':
        return students.filter(s => s.growthStatus === 'Regressed');
      case 'NO_DATA':
        return students.filter(s => s.growthStatus === 'Insufficient Data');  
      default:
        return students;
    }
  }, [students, activeFilter]);

  const pm1ProficientRate = useMemo(
    () => calculateProficiencyRate(filteredStudents, "PM1"),
    [filteredStudents]
  );

  const pm2ProficientRate = useMemo(
    () => calculateProficiencyRate(filteredStudents, "PM2"),
    [filteredStudents]
  );

  const proficiencyDelta = pm2ProficientRate - pm1ProficientRate;

  const fetchInsights = async () => {
    if (filteredStudents.length === 0) return;
    setIsAiLoading(true);
    setAiError(null);
    try {
      const results = await getMathInsights(filteredStudents, activeFilter);
      setAiInsights(results);
    } catch (err: any) {
      setAiError(err.message || "Failed to generate AI insights.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Reset insights when filter changes
  useEffect(() => {
    setAiInsights(null);
  }, [activeFilter]);

  const stats = [
    { label: "Total Students", val: students.length, icon: <Users className="w-5 h-5 text-indigo-500"/> },
    { label: "Filtered Students", val: filteredStudents.length, icon: <Layers className="w-5 h-5 text-blue-500"/> },
    { label: "Average Absences", val: (filteredStudents.reduce((acc, s) => acc + s.absences, 0) / (filteredStudents.length || 1)).toFixed(1), icon: <BookOpen className="w-5 h-5 text-purple-500"/> },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <p className="text-3xl font-bold text-slate-800">{s.val}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">{s.icon}</div>
          </div>
        ))}
      </div>

      {/* Proficiency Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">PM1 Proficient</p>
          <p className="text-3xl font-bold text-slate-800">{pm1ProficientRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Levels 3–5</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">PM2 Proficient</p>
          <p className="text-3xl font-bold text-slate-800">{pm2ProficientRate}%</p>
          <p className="text-xs text-slate-400 mt-1">Levels 3–5</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">Proficiency Change</p>
          <p
            className={`text-3xl font-bold ${
              proficiencyDelta > 0
                ? 'text-emerald-600'
                : proficiencyDelta < 0
                ? 'text-red-600'
                : 'text-slate-600'
            }`}
          >
            {proficiencyDelta > 0 ? '+' : ''}
            {proficiencyDelta}%
          </p>
          <p className="text-xs text-slate-400 mt-1">PM2 − PM1</p>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Controls */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">
                <Filter className="w-4 h-4" />
                Student Filters
              </h3>

              {/* ======================
                  SUBGROUP FILTERS
                ====================== */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Subgroups
                </p>

                <nav className="space-y-1">
                  <FilterButton
                    label="All Students"
                    active={activeFilter === 'ALL'}
                    onClick={() => setActiveFilter('ALL')}
                  />

                  <FilterButton
                    label="ELL (1–4)"
                    active={activeFilter === 'ELL'}
                    onClick={() => setActiveFilter('ELL')}
                  />

                  <FilterButton
                    label="ESE (Non-blank)"
                    active={activeFilter === 'ESE'}
                    onClick={() => setActiveFilter('ESE')}
                  />

                  <FilterButton
                    label="Lowest 25%"
                    active={activeFilter === 'L25'}
                    onClick={() => setActiveFilter('L25')}
                  />

                  <FilterButton
                    label="Lowest 35%"
                    active={activeFilter === 'L35'}
                    onClick={() => setActiveFilter('L35')}
                  />
                </nav>
              </div>

              {/* ======================
                  GROWTH FILTERS
                ====================== */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Growth (PM1 → PM2)
                </p>

                <nav className="space-y-1">
                  <FilterButton
                    label="Improved"
                    active={activeFilter === 'IMPROVED'}
                    onClick={() => setActiveFilter('IMPROVED')}
                  />

                  <FilterButton
                    label="Maintained"
                    active={activeFilter === 'MAINTAINED'}
                    onClick={() => setActiveFilter('MAINTAINED')}
                  />

                  <FilterButton
                    label="Regressed"
                    active={activeFilter === 'REGRESSED'}
                    onClick={() => setActiveFilter('REGRESSED')}
                  />

                  <FilterButton
                    label="No Growth Data"
                    active={activeFilter === 'NO_DATA'}
                    onClick={() => setActiveFilter('NO_DATA')}
                  />
                </nav>
              </div>
            </div>

            <button
              onClick={fetchInsights}
              disabled={filteredStudents.length === 0 || isAiLoading}
              className={`
                w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-white shadow-lg transition-all
                ${filteredStudents.length === 0 || isAiLoading 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'}
              `}
            >
              <BrainCircuit className="w-5 h-5" />
              {isAiLoading ? "Analyzing..." : "Analyze with AI"}
            </button>

            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Data
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow space-y-8">
          {aiError && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm font-medium">
              {aiError}
            </div>
          )}

          {aiInsights && (
            <InsightCard insights={aiInsights} isLoading={isAiLoading} />
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              {activeFilter === 'ALL' ? 'Student Performance Overview' : `${activeFilter} Subgroup Data`}
            </h2>
            <StudentTable students={filteredStudents} />
          </div>
        </main>
      </div>
    </div>
  );
};

const FilterButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all
      ${active ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
    `}
  >
    {label}
  </button>
);

export default Dashboard;
