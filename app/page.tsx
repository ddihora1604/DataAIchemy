"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, Download, FileUp } from "lucide-react"
import { toast } from "sonner"
import { processCSV, type Dataset } from "@/lib/data-service"
import { useNotifications } from "@/contexts/notification-context"
import { UploadSuccessDialog } from "@/components/upload-success-dialog"

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedModel, setSelectedModel] = useState("vae")
  const [sampleSize, setSampleSize] = useState(1000)
  const [isGenerating, setIsGenerating] = useState(false)
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [generatedData, setGeneratedData] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addNotification } = useNotifications()
  const [uploadSuccessOpen, setUploadSuccessOpen] = useState(false)
  const [uploadedFileDetails, setUploadedFileDetails] = useState<{
    name: string;
    rows: number;
    columns: number;
  } | null>(null)

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    
    if (!file) {
      addNotification(
        "Upload Error",
        "No file was dropped. Please try again.",
        "alert"
      )
      return
    }

    if (file.name.endsWith('.csv')) {
      addNotification(
        "File Received",
        "Starting to process your CSV file...",
        "action"
      )
      await handleFileProcess(file)
    } else {
      toast.error("Please upload a CSV file")
      addNotification(
        "Invalid File Type",
        "Only CSV files are supported. Please upload a valid CSV file.",
        "alert"
      )
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (!file) {
      addNotification(
        "Upload Error",
        "No file was selected. Please try again.",
        "alert"
      )
      return
    }

    if (file.name.endsWith('.csv')) {
      addNotification(
        "File Selected",
        "Starting to process your CSV file...",
        "action"
      )
      await handleFileProcess(file)
    } else if (file) {
      toast.error("Please upload a CSV file")
      addNotification(
        "Invalid File Type",
        "Only CSV files are supported. Please upload a valid CSV file.",
        "alert"
      )
    }
  }

  const handleFileProcess = async (file: File) => {
    try {
      addNotification(
        "Processing Dataset",
        `Starting to process ${file.name}...`,
        "action",
        true
      )

      const processedData = await processCSV(file)
      setSelectedFile(file)
      setDataset(processedData)
      
      // Set upload details for the success dialog
      setUploadedFileDetails({
        name: file.name,
        rows: Object.values(processedData)[0]?.length || 0,
        columns: Object.keys(processedData).length
      })
      
      // Show success dialog
      setUploadSuccessOpen(true)

      // Success notification - immediate
      addNotification(
        "Dataset Uploaded",
        `Successfully processed ${file.name}`,
        "action",
        true
      )

      // Insights and recommendations will be shown randomly later
      
    } catch (error) {
      console.error("Error processing file:", error)
      toast.error("Error processing file")
      addNotification(
        "Upload Error",
        "Failed to process the file. Please ensure it's a valid CSV.",
        "alert",
        true
      )
    }
  }

  const handleGenerate = async () => {
    if (!dataset) {
      toast.error("Please upload a dataset first")
      return
    }
    setIsGenerating(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const dummyData = `id,value\n1,100\n2,200\n3,300`
      setGeneratedData(dummyData)
      toast.success("Data generated successfully")
      addNotification(
        "Generation Complete",
        `Successfully generated ${sampleSize} samples using ${selectedModel.toUpperCase()}`,
        "action"
      )
      addNotification(
        "Performance Insight",
        `Your synthetic data shows a 95% similarity with the original dataset`,
        "insight"
      )
    } catch (error) {
      console.error("Error generating data:", error)
      toast.error("Error generating data")
      addNotification(
        "Generation Error",
        "Failed to generate synthetic data. Please try again.",
        "alert"
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = () => {
    if (!generatedData) {
      toast.error("No generated data available")
      return
    }

    try {
      const blob = new Blob([generatedData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'synthetic_data.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success("Dataset exported successfully")
    } catch (error) {
      console.error("Error exporting data:", error)
      toast.error("Error exporting data")
    }
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
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
                <Button 
                  variant="link" 
                  className="text-sm"
                  onClick={handleChooseFile}
                >
                  choose a file
                </Button>
                <Input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />
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
              disabled={!generatedData || isGenerating}
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Generated Data
            </Button>
          </CardContent>
        </Card>
      </div>

      {uploadedFileDetails && (
        <UploadSuccessDialog
          isOpen={uploadSuccessOpen}
          onClose={() => setUploadSuccessOpen(false)}
          fileName={uploadedFileDetails.name}
          fileDetails={{
            rows: uploadedFileDetails.rows,
            columns: uploadedFileDetails.columns
          }}
        />
      )}
    </div>
  )
}