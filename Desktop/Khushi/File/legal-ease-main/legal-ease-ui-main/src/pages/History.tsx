import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Eye, Download, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: Date;
  status: 'analyzed' | 'processing' | 'error';
  summary: string;
  pages: number;
  size: string;
}

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const documents: Document[] = [
    {
      id: 1,
      name: "Employment_Contract_2024.pdf",
      type: "Employment Agreement",
      uploadDate: new Date(2024, 8, 15),
      status: 'analyzed',
      summary: "Standard employment contract with competitive benefits package and clear termination clauses.",
      pages: 12,
      size: "2.3 MB"
    },
    {
      id: 2,
      name: "NDA_TechCorp_Final.pdf",
      type: "Non-Disclosure Agreement",
      uploadDate: new Date(2024, 8, 10),
      status: 'analyzed',
      summary: "Comprehensive NDA with 5-year confidentiality period and specific technology protection clauses.",
      pages: 8,
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Lease_Agreement_Downtown.pdf",
      type: "Lease Agreement",
      uploadDate: new Date(2024, 8, 5),
      status: 'analyzed',
      summary: "Commercial lease with flexible terms, pet-friendly policies, and utilities included.",
      pages: 15,
      size: "3.1 MB"
    },
    {
      id: 4,
      name: "Service_Contract_Processing.pdf",
      type: "Service Contract",
      uploadDate: new Date(2024, 8, 1),
      status: 'processing',
      summary: "Currently being analyzed by our AI system...",
      pages: 10,
      size: "2.7 MB"
    }
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'bg-green-500/20 text-green-700 border-green-200';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-200';
      case 'error':
        return 'bg-red-500/20 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen subtle-gradient">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <motion.h1
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl font-bold text-foreground mb-4"
            >
              Document History
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Access and review all your previously analyzed legal documents
            </motion.p>
          </div>

          {/* Search and Filter */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="pl-10 bg-card/50 border-border/50 focus:border-accent/50 focus:ring-accent/20"
              />
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-accent mb-2">{documents.length}</div>
                <p className="text-muted-foreground">Total Documents</p>
              </CardContent>
            </Card>
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {documents.filter(d => d.status === 'analyzed').length}
                </div>
                <p className="text-muted-foreground">Analyzed</p>
              </CardContent>
            </Card>
            <Card className="glass-card text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  {documents.reduce((acc, doc) => acc + doc.pages, 0)}
                </div>
                <p className="text-muted-foreground">Total Pages</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-6 max-w-5xl mx-auto"
          >
            {filteredDocuments.length === 0 ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No documents found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </motion.div>
            ) : (
              filteredDocuments.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="glass-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="p-3 bg-primary/20 rounded-lg"
                          >
                            <FileText className="h-6 w-6 text-primary" />
                          </motion.div>
                          
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{document.name}</CardTitle>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{document.uploadDate.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="h-4 w-4" />
                                <span>{document.pages} pages</span>
                              </div>
                              <span>{document.size}</span>
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={`${getStatusColor(document.status)} border`}
                            >
                              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:scale-105 transition-all duration-300"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:scale-105 transition-all duration-300"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">Document Type</p>
                          <p className="text-sm text-muted-foreground">{document.type}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-foreground mb-1">AI Summary</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {document.summary}
                          </p>
                        </div>

                        {document.status === 'analyzed' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-accent hover:bg-accent/90 transition-all duration-300 hover:scale-105"
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Continue Analysis
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default History;