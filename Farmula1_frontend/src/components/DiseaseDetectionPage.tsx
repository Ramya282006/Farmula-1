import { useState } from "react";
import { motion } from "motion/react";
import {
  Camera,
  Upload,
  Scan,
  AlertTriangle,
  CheckCircle,
  Bell,
  FileText,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function DiseaseDetectionPage() {
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState(false);
  const [alertAdmin, setAlertAdmin] = useState(false);

  /* 🔴 ML STATES (ADDED) */
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<any | null>(null);

  /* 🔴 STATIC TREATMENT & PREVENTION (UNCHANGED AS REQUESTED) */
  /*const STATIC_TREATMENT = [
    "Apply fungicide containing Mancozeb or Propiconazole",
    "Remove and destroy severely infected leaves",
    "Improve air circulation around plants",
    "Apply treatment every 7-10 days for 3 weeks",
  ];

  const STATIC_PREVENTION = [
    "Use resistant wheat varieties",
    "Maintain proper plant spacing",
    "Avoid overhead irrigation",
    "Monitor regularly for early detection",
  ];*/

  /* 🔴 IMAGE UPLOAD */
  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setDetected(false);
  };

  /* 🔴 SCAN HANDLER (OLD UX + REAL API) */
  const handleScan = async () => {
    if (!imageFile) {
      alert("Please upload an image first");
      return;
    }

    setScanning(true);
    setDetected(false);

    const scanStart = Date.now(); // ensure minimum animation time

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch(
        "http://127.0.0.1:8000/api/predict-disease",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      const elapsed = Date.now() - scanStart;
      const delay = Math.max(0, 3000 - elapsed); // OLD 3s feel

      setTimeout(() => {
        setResult({
            ...data,
            affectedArea: "15-20%",
          });

        setScanning(false);
        setDetected(true);
      }, delay);
    } catch (error) {
      console.error(error);
      setScanning(false);
      alert("Disease prediction failed");
    }
  };

  const detectionResult = result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-6 px-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Scan className="w-7 h-7 text-orange-600" />
            </motion.div>
            <div>
              <h1 className="text-white mb-1">Crop Disease Detection</h1>
              <p className="text-orange-100 text-sm">
                AI-powered disease identification and treatment
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* MAIN AREA */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-none shadow-lg">
              {!detected ? (
                <div className="text-center">
                  <h2 className="text-green-900 mb-6">
                    Upload or Scan Crop Image
                  </h2>

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="image-upload"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="relative mb-8">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {!scanning ? (
                        <div className="text-center">
                          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">
                            Drag and drop image here
                          </p>
                          <p className="text-sm text-gray-500">
                            or click to browse
                          </p>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <ImageWithFallback
                            src="https://images.unsplash.com/photo-1716725330092-be290229e5f5"
                            alt="Scanning crop"
                            className="w-full h-full object-cover"
                          />

                          {/* HOLOGRAPHIC SCAN */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />

                          {/* SCAN GRID (RESTORED) */}
                          <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1 p-4">
                            {[...Array(48)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="border border-cyan-400/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.02,
                                }}
                              />
                            ))}
                          </div>

                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full">
                            <div className="flex items-center gap-2 text-white text-sm">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <Scan className="w-4 h-4" />
                              </motion.div>
                              Analyzing crop health...
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-full"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 w-5 h-5" />
                      Upload Image
                    </Button>

                    <Button
                      size="lg"
                      onClick={handleScan}
                      disabled={scanning}
                    >
                      <Camera className="mr-2 w-5 h-5" />
                      {scanning ? "Scanning..." : "Detect Disease"}
                    </Button>
                  </div>

                  {/* FARMER CARD (RESTORED) */}
                  <motion.div
                    className="mt-8 flex items-center gap-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1659021245220-8cf62b36fe25"
                        alt="Farmer using AR scanner"
                        className="w-24 h-24 rounded-xl object-cover shadow-lg"
                      />
                    </motion.div>
                    <div className="flex-1 text-left">
                      <h3 className="text-green-900 mb-2">Scan Your Crops</h3>
                      <p className="text-sm text-green-700/80">
                        Point your camera at affected crops or upload a photo
                        for instant AI-powered disease detection
                      </p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                /* RESULTS */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDetected(false)}
                    className="mb-4 rounded-full"
                  >
                    Scan Another
                  </Button>

                  <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 mb-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-red-900 mb-1">
                          {detectionResult?.disease} Detected
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className="bg-red-100 text-red-700">
                            {detectionResult?.confidence}% Confidence
                          </Badge>
                          <Badge className="bg-orange-100 text-orange-700">
                            {detectionResult?.severity} Severity
                          </Badge>
                          <Badge className="bg-amber-100 text-amber-700">
                            {detectionResult?.affectedArea}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-green-900 mb-3">
                          Recommended Treatment
                        </h4>
                        <ul className="space-y-2">
                          {detectionResult?.treatment?.map((item, index) => (
                            <li
                              key={index}
                              className="flex gap-2 text-sm text-green-800"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-green-900 mb-3">
                          Prevention Tips
                        </h4>
                        <ul className="space-y-2">
                          {detectionResult?.prevention?.map((item, index) => (
                            <li
                              key={index}
                              className="flex gap-2 text-sm text-green-800"
                            >
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-blue-900">
                            Alert Administrator
                          </p>
                          <p className="text-xs text-blue-700">
                            Notify admin about this disease detection
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={alertAdmin}
                        onCheckedChange={setAlertAdmin}
                      />
                    </div>
                  </Card>
                </motion.div>
              )}
            </Card>
          </div>

          {/* SIDEBAR (FULL RESTORED) */}
          <div className="space-y-6">
            <Card className="p-6 border-none shadow-lg">
              <h3 className="text-green-900 mb-4">Detection Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Scans</span>
                  <Badge className="bg-green-100 text-green-700">47</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Diseases Found</span>
                  <Badge className="bg-red-100 text-red-700">12</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Healthy Scans</span>
                  <Badge className="bg-blue-100 text-blue-700">35</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy Rate</span>
                  <Badge className="bg-purple-100 text-purple-700">96%</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-lg">
              <h3 className="text-green-900 mb-4">Common Diseases</h3>
              {[
                { name: "Leaf Rust", risk: "High", color: "red" },
                { name: "Powdery Mildew", risk: "Medium", color: "orange" },
                { name: "Blight", risk: "Low", color: "yellow" },
              ].map((d, i) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2"
                >
                  <span>{d.name}</span>
                  <Badge className={`bg-${d.color}-100 text-${d.color}-700`}>
                    {d.risk}
                  </Badge>
                </motion.div>
              ))}
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-600 to-green-700 text-white">
              <FileText className="w-8 h-8 mb-4" />
              <h3 className="mb-2">Need Help?</h3>
              <p className="text-sm text-green-100 mb-4">
                Download our comprehensive guide on crop disease management
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                Download Guide
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
