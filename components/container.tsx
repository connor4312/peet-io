import React from 'react';
import style from './container.module.scss';

export const Container: React.FC = ({ children }) => (
  <div className={style.container}>{children}</div>
);
