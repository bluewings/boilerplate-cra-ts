/* eslint-disable react/prop-types */
import React from 'react';
import EditPage from './EditPage';

const Wrapper = ({ children }) => (
  <div>
    <EditPage />
    {children}
  </div>
);

export default Wrapper;
