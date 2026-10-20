import React from 'react';

interface HeaderProps { onOpenMetricsModal?: () => void; }

const Header: React.FC<HeaderProps> = ({ onOpenMetricsModal }) => (
  <header className="pryzor-header">
    <div className="pryzor-header-inner">
      <a className="pryzor-brand" href="/" aria-label="Pryzor, início">
        <span className="pryzor-brand-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/></svg>
        </span>
        <span><strong>Pryzor<span className="pryzor-dot">.</span></strong><small>Steam price intelligence</small></span>
      </a>
      <button className="pryzor-metrics-button" type="button" onClick={onOpenMetricsModal}>
        <span aria-hidden="true">◈</span> Métricas do modelo <span aria-hidden="true">↗</span>
      </button>
    </div>
  </header>
);
export default Header;
