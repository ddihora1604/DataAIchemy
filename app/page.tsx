"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Download, FileUp } from "lucide-react"
import { toast } from "sonner"
import { processCSV, type Dataset } from "@/lib/data-service"

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedModel, setSelectedModel] = useState("vae")
  const [sampleSize, setSampleSize] = useState(1000)
  const [isGenerating, setIsGenerating] = useState(false)
  const [dataset, setDataset] = useState<Dataset | null>(null)

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.csv')) {
      try {
        const processedData = await processCSV(file)
        setSelectedFile(file)
        setDataset(processedData)
        toast.success("File uploaded and processed successfully")
      } catch (error) {
        toast.error("Error processing file")
      }
    } else {
      toast.error("Please upload a CSV file")
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.csv')) {
      try {
        const processedData = await processCSV(file)
        setSelectedFile(file)
        setDataset(processedData)
        toast.success("File uploaded and processed successfully")
      } catch (error) {
        toast.error("Error processing file")
      }
    } else {
      toast.error("Please upload a CSV file")
    }
  }

  const handleGenerate = async () => {
    if (!dataset) {
      toast.error("Please upload a dataset first")
      return
    }
    setIsGenerating(true)
    
    try {
      // Simulate data generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const blob = new Blob([JSON.stringify(dataset.data)], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'synthetic_data.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success("Data generated successfully")
    } catch (error) {
      toast.error("Error generating data")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Upload Dataset</CardTitle>
            <CardDescription>
              Upload your sample dataset in CSV format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed rounded-lg p-8 transition-colors hover:border-primary/50"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Drag and drop your CSV file here, or
                </p>
                <label htmlFor="file-upload" className="relative cursor-pointer">
                  <Button variant="link" className="text-sm">
                    choose a file
                  </Button>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileUp className="h-4 w-4" />
                  {selectedFile.name}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Selection</CardTitle>
            <CardDescription>
              Choose your preferred generation model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedModel}
              onValueChange={setSelectedModel}
              className="space-y-3"
              disabled={!dataset}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tabular-gan" id="tabular-gan" />
                <Label htmlFor="tabular-gan">Tabular GAN</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vae" id="vae" />
                <Label htmlFor="vae">Variational Autoencoder (VAE)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="copula" id="copula" />
                <Label htmlFor="copula">Copula-based Synthesis</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generation Settings</CardTitle>
            <CardDescription>
              Configure your synthetic data parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sample-size">Sample Size</Label>
              <Input
                id="sample-size"
                type="number"
                value={sampleSize}
                onChange={(e) => setSampleSize(parseInt(e.target.value))}
                min={100}
                max={100000}
                disabled={!dataset || !selectedModel}
              />
            </div>
            <Button 
              className="w-full"
              onClick={handleGenerate}
              disabled={!dataset || !selectedModel || isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Data"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!dataset || isGenerating}
              onClick={handleGenerate}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Generated Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}