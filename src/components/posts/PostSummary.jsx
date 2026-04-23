'use client'

import { useState } from 'react'

export default function PostSummary({ summary }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Only show toggle if summary is reasonably long
  const isLong = summary.length > 280

  return (
    <div className="bg-indigo-600 rounded-3xl p-10 mb-16 shadow-xl shadow-indigo-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      
      <h3 className="text-white/80 font-bold uppercase tracking-widest text-xs mb-4">AI-Generated Summary</h3>
      
      <div className="relative">
        <p className={`text-white text-xl md:text-2xl font-bold leading-relaxed transition-all duration-500 ${!isExpanded && isLong ? 'line-clamp-3' : ''}`}>
          "{summary}"
        </p>
        
        {!isExpanded && isLong && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-indigo-600 to-transparent pointer-events-none" />
        )}
        
        {isLong && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 text-indigo-100 hover:text-white font-bold text-sm flex items-center gap-2 transition-colors group/btn"
          >
            <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm group-hover/btn:bg-white/30 transition-all flex items-center gap-2">
              {isExpanded ? 'Collapse Summary' : 'Read Full Summary'}
              <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
