
import React, { useState } from 'react';
import { parseFile } from './utils/parser';
import { StudentRecord } from './types';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { GraduationCap, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[] | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsParsing(true);
    try {
      const result = await parseFile(file);
      setStudents(result.students);
    } catch (err) {
      alert("Error parsing file: " + (err as Error).message);
    } finally {
      setIsParsing(false);
    }
  };

  const reset = () => {
    setStudents(null);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">MathInsight<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Teacher Dashboard
            </a>
          </div>
        </div>
      </nav>

      {/* Hero / Header */}
      {!students && (
        <header className="bg-indigo-600 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
              Data-Driven Excellence for <br className="hidden sm:block" /> Middle School Math
            </h1>
            <p className="text-indigo-100 text-lg sm:text-xl max-w-2xl mx-auto">
              Transform raw assessment CSVs into instructional power. 
              Get subgroup insights and growth patterns in seconds.
            </p>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="pb-12">
        {!students ? (
          <FileUpload onFileSelect={handleFileSelect} isLoading={isParsing} />
        ) : (
          <Dashboard students={students} onReset={reset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} MathInsight AI. Designed for Professional Educators.
          </p>
          <div className="mt-4 flex justify-center gap-8 text-xs font-bold text-slate-300 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-500">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-500">Support</a>
            <a href="#" className="hover:text-indigo-500">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
