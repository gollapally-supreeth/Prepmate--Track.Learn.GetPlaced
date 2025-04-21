
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', progress: 65 },
  { name: 'Tue', progress: 75 },
  { name: 'Wed', progress: 85 },
  { name: 'Thu', progress: 70 },
  { name: 'Fri', progress: 90 },
  { name: 'Sat', progress: 80 },
  { name: 'Sun', progress: 95 },
];

export function ProgressChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip />
        <Line type="monotone" dataKey="progress" stroke="#9b87f5" strokeWidth={2} dot={{ fill: '#9b87f5' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
