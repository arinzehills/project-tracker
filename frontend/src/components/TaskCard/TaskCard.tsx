'use client';

import React from 'react';
import styles from './TaskCard.module.css';

export interface TaskCardProps {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  daysLeft: number;
  comments?: number;
  attachments?: number;
  onCardClick?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  priority,
  daysLeft,
  comments = 0,
  attachments = 0,
  onCardClick,
}) => {
  const priorityColorMap = {
    'High': '#FF6B6B',
    'Medium': '#8B5CF6',
    'Low': '#A3E635',
  };

  return (
    <div
      className={styles.card}
      onClick={() => onCardClick?.(id)}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span
          className={styles.priorityBadge}
          style={{ backgroundColor: priorityColorMap[priority] }}
        >
          {priority} Priority
        </span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.icon}>⏱</span>
          <span className={styles.label}>{daysLeft} Days left</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>💬</span>
            <span className={styles.statValue}>{comments}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>📎</span>
            <span className={styles.statValue}>{attachments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
