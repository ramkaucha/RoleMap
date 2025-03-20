'use client';

import { useState } from 'react';
import PageWrapper from "@/components/PageWrapper";
import MetricsList from "./components/Metrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const activityTimelineData = [
  { week: 'Week 1', applications: 5 },
  { week: 'Week 2', applications: 8 },
  { week: 'Week 3', applications: 12 },
  { week: 'Week 4', applications: 6 },
  { week: 'Week 5', applications: 9 },
  { week: 'Week 6', applications: 11 },
  { week: 'Week 7', applications: 15 },
  { week: 'Week 8', applications: 10 },
];


export default function ApplicationActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Activity Timeline</CardTitle>
        <CardDescription>Weekly application submission activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activityTimelineData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5}}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone"
                dataKey="applications"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
