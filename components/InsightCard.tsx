
import React from 'react';
import { AIAnalysisResult } from '../types';
import { Sparkles, TrendingUp, AlertTriangle, Users, Lightbulb } from 'lucide-react';

interface InsightCardProps {
  insights: AIAnalysisResult;
  isLoading: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          <div className="h-4 bg-slate-100 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl shadow-xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-indigo-200" />
          <h2 className="text-2xl font-bold">Executive Summary</h2>
        </div>
        <p className="text-indigo-50 leading-relaxed text-lg italic">
          "{insights.summary}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Growth Trends */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Growth Trends</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">{insights.growthTrends}</p>
        </section>

        {/* Regression Flags */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Regression Flags</h3>
          </div>
          {insights.regressionFlags.length > 0 ? (
            <ul className="space-y-3">
              {insights.regressionFlags.map((flag, idx) => (
                <li key={idx} className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                  <span className="block font-bold text-rose-800">{flag.studentName}</span>
                  <span className="text-sm text-rose-600">{flag.reason}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-sm">No regression flags identified.</p>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Grouping Suggestions */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <Users className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Instructional Groups</h3>
          </div>
          <div className="space-y-4">
            {insights.groupingSuggestions.map((group, idx) => (
              <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-1">
                <h4 className="font-bold text-slate-800">{group.groupName}</h4>
                <p className="text-xs text-indigo-600 font-medium mb-2">Focus: {group.focusArea}</p>
                <div className="flex flex-wrap gap-1">
                  {group.students.map(s => (
                    <span key={s} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Instructional Strategies */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-amber-600">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Targeted Strategies</h3>
          </div>
          <ul className="space-y-3">
            {insights.instructionalStrategies.map((strategy, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="min-w-[20px] h-5 w-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </div>
                <p className="text-slate-600 text-sm">{strategy}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default InsightCard;
