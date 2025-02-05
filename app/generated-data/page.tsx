import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function GeneratedData() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Generated Data</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Generated Datasets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dataset Name</TableHead>
                <TableHead>Model Type</TableHead>
                <TableHead>Generated At</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>synthetic_data_001.csv</TableCell>
                <TableCell>VAE</TableCell>
                <TableCell>2025-01-15 14:30</TableCell>
                <TableCell>1,000 rows</TableCell>
                <TableCell>Download</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}