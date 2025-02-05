"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Demo data
const demoData = {
  distributions: Array.from({ length: 50 }, (_, i) => ({
    x: i,
    original: Math.sin(i * 0.5) * 10 + 50 + Math.random() * 5,
    synthetic: Math.sin(i * 0.5) * 10 + 50 + Math.random() * 5,
  })),
  statistics: {
    original: {
      mean: 50.2,
      median: 49.8,
      stdDev: 7.3,
      min: 35.4,
      max: 65.1,
    },
    synthetic: {
      mean: 50.5,
      median: 50.1,
      stdDev: 7.1,
      min: 36.2,
      max: 64.8,
    }
  }
}

export default function Analysis() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Numerical Analysis</h2>
      </div>
      <Tabs defaultValue="visualizations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Distribution Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demoData.distributions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="original" 
                      stroke="hsl(var(--chart-1))" 
                      name="Original Data" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="synthetic" 
                      stroke="hsl(var(--chart-2))" 
                      name="Synthetic Data" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Original Data Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {Object.entries(demoData.statistics.original).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="font-medium capitalize">{key}:</dt>
                      <dd>{value.toFixed(2)}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Synthetic Data Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {Object.entries(demoData.statistics.synthetic).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="font-medium capitalize">{key}:</dt>
                      <dd>{value.toFixed(2)}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distributions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Probability Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoData.distributions.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="original" 
                      fill="hsl(var(--chart-1))" 
                      name="Original Data" 
                    />
                    <Bar 
                      dataKey="synthetic" 
                      fill="hsl(var(--chart-2))" 
                      name="Synthetic Data" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}