import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './DataViewDrawer.module.css';

interface DataViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  series: { name: string; data: number[]; color: string }[];
  timeLabels: string[];
}

export const DataViewDrawer: React.FC<DataViewDrawerProps> = ({
  isOpen,
  onClose,
  title,
  series,
  timeLabels: _timeLabels
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate extended time labels for better scrolling demonstration
  const generateFullTimeLabels = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Generate more time labels by extending with 5-minute intervals over past 2 hours
    const extendedLabels: string[] = [];
    const startHour = Math.max(0, now.getHours() - 2);
    
    for (let h = startHour; h <= now.getHours(); h++) {
      for (let m = 0; m < 60; m += 5) {
        const hourStr = String(h).padStart(2, '0');
        const minStr = String(m).padStart(2, '0');
        extendedLabels.push(`${year}-${month}-${day} ${hourStr}:${minStr}:00`);
      }
    }
    
    return extendedLabels;
  };

  const fullTimeLabels = generateFullTimeLabels();
  
  // Generate data values for extended rows
  const getDataValue = (seriesIdx: number, rowIdx: number) => {
    const s = series[seriesIdx];
    if (s.data[rowIdx % s.data.length] !== undefined) {
      // Add some variation to make data look realistic
      const baseValue = s.data[rowIdx % s.data.length];
      const variation = (Math.sin(rowIdx * 0.5) * 0.2 + 1);
      return (baseValue * variation).toFixed(2);
    }
    return '-';
  };

  // Use portal to render at document body level for proper fullscreen positioning
  return createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.drawerContent}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Time</th>
                  {series.map((s, idx) => (
                    <th key={idx}>{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fullTimeLabels.map((time, rowIdx) => (
                  <tr key={rowIdx}>
                    <td>{time}</td>
                    {series.map((_, colIdx) => (
                      <td key={colIdx}>
                        {getDataValue(colIdx, rowIdx)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className={styles.footer}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default DataViewDrawer;

