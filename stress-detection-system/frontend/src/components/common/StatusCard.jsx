import React from 'react';

export const StatusCard = ({ title, subtitle, icon: Icon, children, className = '', badge }) => {
  return (
    <div className={`bg-dark-800/80 backdrop-blur-md border border-dark-700/60 rounded-2xl p-5 shadow-xl transition-all hover:border-dark-600/80 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Icon size={20} />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 font-medium">{subtitle}</p>}
          </div>
        </div>
        {badge}
      </div>
      <div>{children}</div>
    </div>
  );
};
