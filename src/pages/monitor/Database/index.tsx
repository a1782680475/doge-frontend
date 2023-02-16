import React from "react";

const MonitorDatabase: React.FC = () => {
  return (<iframe src="/api/druid/index.html" frameBorder="no" scrolling="auto" style={{width: '100%', height: '100%'}}/>)
};
export default MonitorDatabase;
