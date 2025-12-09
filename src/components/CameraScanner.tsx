// import React, { useRef, useState, useCallback } from 'react';
// import { Camera, Upload, X, RotateCcw, Check } from 'lucide-react';
// import Tesseract from 'tesseract.js';

// interface CameraScannerProps {
//   onImageCapture: (data: {
//     image: string;
//     text: string;
//     fields: {
//       tag: string;
//       po: string;
//       req: string;
//     };
//   }) => void;
//   onClose: () => void;
// }

// export function CameraScanner({ onImageCapture, onClose }: CameraScannerProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [ocrProgress, setOcrProgress] = useState<string>('');

//   const startCamera = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
      
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
//       });
      
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//     } catch (err) {
//       setError('Unable to access camera. Please check permissions or try uploading an image instead.');
//       console.error('Camera access error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const stopCamera = useCallback(() => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//   }, [stream]);

//   const capturePhoto = useCallback(() => {
//     if (!videoRef.current || !canvasRef.current) return;
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     if (!context) return;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const imageData = canvas.toDataURL('image/jpeg', 0.8);
//     setCapturedImage(imageData);
//     stopCamera();
//   }, [stopCamera]);

//   const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const imageData = e.target?.result as string;
//       setCapturedImage(imageData);
//     };
//     reader.readAsDataURL(file);
//   }, []);

//   // 🔹 Función mejorada para extraer campos específicos
//   const extractFields = (text: string) => {
//     console.log("=== TEXTO OCR COMPLETO ===");
//     console.log(text);
//     console.log("=== FIN TEXTO OCR ===");

//     // Dividir el texto en líneas para mejor análisis
//     const lines = text.split('\n').map(line => line.trim());
//     console.log("=== LÍNEAS DEL OCR ===");
//     lines.forEach((line, index) => {
//       console.log(`${index}: "${line}"`);
//     });
    
//     // 🔹 TAG: Buscar "TAG" seguido de ":" y números/letras
//     let tag = '';
//     const tagPatterns = [
//       /TAG\s*[:.\s]*\s*([A-Z0-9]{3,8})/i,         // TAG: 5365
//       /TAG[\s\S]*?([0-9]{4})/i,                    // TAG seguido de 4 dígitos
//     ];
    
//     for (const pattern of tagPatterns) {
//       const match = text.match(pattern);
//       if (match && match[1] && !match[1].includes('*') && match[1] !== '8') {
//         tag = match[1];
//         break;
//       }
//     }

//     // 🔹 Estrategia por posición para OC y REQ
//     let po = '';
//     let req = '';
    
//     // Buscar índices de OC y REQ en las líneas
//     const ocLineIndex = lines.findIndex(line => line.toUpperCase().includes('OC'));
//     const reqLineIndex = lines.findIndex(line => line.toUpperCase().includes('REQ'));
    
//     console.log("OC encontrado en línea:", ocLineIndex);
//     console.log("REQ encontrado en línea:", reqLineIndex);
    
//     // Para OC: buscar el patrón * 6 7 0 4 3 5 * después de encontrar "OC"
//     if (ocLineIndex >= 0) {
//       // Buscar en las siguientes 3 líneas después de "OC"
//       for (let i = ocLineIndex + 1; i < Math.min(ocLineIndex + 4, lines.length); i++) {
//         const line = lines[i];
//         const ocPatterns = [
//           /\*\s*6\s*7\s*0\s*4\s*3\s*5\s*\*/i,        // * 6 7 0 4 3 5 *
//           /670435/,                                    // Número directo
//           /\*\s*([0-9\s]{10,})\s*\*/i,               // Cualquier número largo entre *
//         ];
        
//         for (const pattern of ocPatterns) {
//           const match = line.match(pattern);
//           if (match) {
//             if (match[1]) {
//               po = match[1].replace(/\s+/g, '');  // Remover espacios
//             } else if (match[0].includes('670435')) {
//               po = '670435';
//             }
//             if (po && po.length >= 6) break;
//           }
//         }
//         if (po) break;
//       }
//     }
    
//     // Para REQ: buscar el patrón * 6 7 0 3 2 9 * después de encontrar "REQ"
//     if (reqLineIndex >= 0) {
//       // Buscar en las siguientes 3 líneas después de "REQ"
//       for (let i = reqLineIndex + 1; i < Math.min(reqLineIndex + 4, lines.length); i++) {
//         const line = lines[i];
//         const reqPatterns = [
//           /\*\s*6\s*7\s*0\s*3\s*2\s*9\s*\*/i,        // * 6 7 0 3 2 9 *
//           /670329/,                                    // Número directo
//           /\*\s*([0-9\s]{10,})\s*\*/i,               // Cualquier número largo entre *
//         ];
        
//         for (const pattern of reqPatterns) {
//           const match = line.match(pattern);
//           if (match) {
//             if (match[1]) {
//               req = match[1].replace(/\s+/g, '');  // Remover espacios
//             } else if (match[0].includes('670329')) {
//               req = '670329';
//             }
//             if (req && req.length >= 6) break;
//           }
//         }
//         if (req) break;
//       }
//     }

//     // 🔹 Fallback: buscar números específicos en todo el texto
//     if (!po && text.includes('670435')) {
//       po = '670435';
//     }
//     if (!req && text.includes('670329')) {
//       req = '670329';
//     }

//     console.log("=== RESULTADOS EXTRAÍDOS ===");
//     console.log("TAG:", tag);
//     console.log("PO/OC:", po);
//     console.log("REQ:", req);
//     console.log("=== FIN RESULTADOS ===");

//     return { tag, po, req };
//   };

//   const confirmImage = useCallback(async () => {
//     if (!capturedImage) return;
//     setIsLoading(true);
//     setError(null);
//     setOcrProgress('Iniciando OCR...');

//     try {
//       const { data: { text } } = await Tesseract.recognize(
//         capturedImage,
//         'eng',
//         { 
//           logger: (m) => {
//             if (m.status === 'recognizing text') {
//               setOcrProgress(`Procesando: ${Math.round(m.progress * 100)}%`);
//             }
//             console.log(m);
//           }
//         }
//       );

//       setOcrProgress('Extrayendo información...');
      
//       // Usar la función mejorada para extraer campos
//       const extractedFields = extractFields(text);

//       onImageCapture({
//         image: capturedImage,
//         text,
//         fields: extractedFields
//       });

//     } catch (err) {
//       console.error("OCR error:", err);
//       setError("No se pudo procesar la imagen. Intenta de nuevo.");
//     } finally {
//       setIsLoading(false);
//       setOcrProgress('');
//     }
//   }, [capturedImage, onImageCapture]);

//   const retakePhoto = useCallback(() => {
//     setCapturedImage(null);
//     setOcrProgress('');
//     startCamera();
//   }, [startCamera]);

//   React.useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, [stopCamera]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <Camera className="h-5 w-5 text-blue-600" />
//             <h2 className="text-lg font-semibold text-gray-900">Scan Device Label</h2>
//           </div>
//           <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           {!capturedImage ? (
//             <div className="space-y-4">
//               {stream ? (
//                 <div className="relative">
//                   <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-lg bg-gray-900" />
//                   <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
//                     <div className="text-white text-center">
//                       <p className="text-sm font-medium">Position device label in frame</p>
//                       <p className="text-xs opacity-75">Ensure text is clear and well-lit</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
//                   {isLoading ? (
//                     <div className="text-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-2" />
//                       <p className="text-sm text-gray-600">Starting camera...</p>
//                     </div>
//                   ) : error ? (
//                     <div className="text-center text-red-600">
//                       <Camera className="h-8 w-8 mx-auto mb-2" />
//                       <p className="text-sm">{error}</p>
//                     </div>
//                   ) : (
//                     <div className="text-center text-gray-500">
//                       <Camera className="h-8 w-8 mx-auto mb-2" />
//                       <p className="text-sm">Camera not started</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="flex gap-3">
//                 {!stream && !error ? (
//                   <button onClick={startCamera} disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
//                     <Camera className="h-4 w-4" />
//                     Start Camera
//                   </button>
//                 ) : stream ? (
//                   <button onClick={capturePhoto} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
//                     <Camera className="h-4 w-4" />
//                     Capture Photo
//                   </button>
//                 ) : null}

//                 <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
//                   <Upload className="h-4 w-4" />
//                   Upload Image
//                 </button>
//               </div>

//               <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="relative">
//                 <img src={capturedImage} alt="Captured label" className="w-full h-64 object-contain rounded-lg bg-gray-900" />
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                 <p className="text-sm text-blue-800">
//                   <strong>Next:</strong> {ocrProgress || "Processing image with OCR. Please confirm."}
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button onClick={retakePhoto} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
//                   <RotateCcw className="h-4 w-4" />
//                   Retake
//                 </button>
//                 <button onClick={confirmImage} disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
//                   <Check className="h-4 w-4" />
//                   {isLoading ? ocrProgress || "Processing..." : "Use This Image"}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         <canvas ref={canvasRef} className="hidden" />
//       </div>
//     </div>
//   );
// }


import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, RotateCcw, Check } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface CameraScannerProps {
  onImageCapture: (data: {
    image: string;
    text: string;
    fields: {
      tag: string;
      po: string;
      req: string;
    };
  }) => void;
  onClose: () => void;
}

export function CameraScanner({ onImageCapture, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState<string>('');

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions or try uploading an image instead.');
      console.error('Camera access error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageData);
    stopCamera();
  }, [stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
    };
    reader.readAsDataURL(file);
  }, []);

  // 🚀 FUNCIÓN MEJORADA PARA EXTRAER CAMPOS
  const extractFields = (text: string) => {
    console.log("\n🔍 ===== INICIANDO EXTRACCIÓN DE CAMPOS =====");
    console.log("📄 TEXTO OCR COMPLETO:");
    console.log(text);
    console.log("=" .repeat(50));

    // Normalizar texto
    const textUpper = text.toUpperCase();
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log("\n📋 LÍNEAS DETECTADAS:");
    lines.forEach((line, idx) => {
      console.log(`  ${idx.toString().padStart(2, '0')}: "${line}"`);
    });

    // ==========================================
    // 1️⃣ EXTRACCIÓN DE TAG
    // ==========================================
    let tag = '';
    console.log("\n🏷️  BUSCANDO TAG...");
    
    // Estrategia 1: Buscar línea que contiene "TAG" y extraer valor en la misma línea
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/TAG/i.test(line)) {
        console.log(`   ✓ TAG encontrado en línea ${i}: "${line}"`);
        
        // Patrón 1: TAG: 5430 o TAG : 5430
        const match1 = line.match(/TAG\s*[:：.]?\s*([A-Z0-9\-]{3,10})/i);
        if (match1 && match1[1]) {
          tag = match1[1];
          console.log(`   ✅ TAG extraído (Patrón 1): "${tag}"`);
          break;
        }
        
        // Patrón 2: Si TAG está solo en la línea, buscar en la siguiente
        if (/^TAG\s*[:：.]?\s*$/i.test(line) && lines[i + 1]) {
          const nextLine = lines[i + 1];
          const match2 = nextLine.match(/^([A-Z0-9\-]{3,10})/i);
          if (match2 && match2[1]) {
            tag = match2[1];
            console.log(`   ✅ TAG extraído (Línea siguiente): "${tag}"`);
            break;
          }
        }
      }
    }
    
    // Estrategia 2: Buscar patrón TAG seguido de número en todo el texto
    if (!tag) {
      const fallbackMatch = text.match(/TAG[\s\S]{0,30}?([A-Z0-9]{4,6})/i);
      if (fallbackMatch && fallbackMatch[1] && !/\*/.test(fallbackMatch[1])) {
        tag = fallbackMatch[1];
        console.log(`   ✅ TAG extraído (Búsqueda global): "${tag}"`);
      }
    }
    
    if (!tag) console.log("   ❌ TAG no encontrado");

    // ==========================================
    // 2️⃣ EXTRACCIÓN DE OC (Orden de Compra)
    // ==========================================
    let po = '';
    console.log("\n📦 BUSCANDO OC...");
    
    // Encontrar línea con "OC"
    const ocLineIndex = lines.findIndex(line => /\bOC\b/i.test(line));
    
    if (ocLineIndex >= 0) {
      console.log(`   ✓ OC encontrado en línea ${ocLineIndex}: "${lines[ocLineIndex]}"`);
      
      // Buscar en las siguientes 4 líneas
      for (let i = ocLineIndex; i < Math.min(ocLineIndex + 5, lines.length); i++) {
        const line = lines[i];
        
        // Patrón 1: Número entre asteriscos (código de barras)
        const barcodeMatch = line.match(/\*\s*(\d[\d\s]{5,})\s*\*/);
        if (barcodeMatch) {
          po = barcodeMatch[1].replace(/\s+/g, '');
          if (po.length >= 6) {
            console.log(`   ✅ OC extraído (Código de barras en línea ${i}): "${po}"`);
            break;
          }
        }
        
        // Patrón 2: Secuencia de 6-8 dígitos
        const numberMatch = line.match(/\b(\d{6,8})\b/);
        if (numberMatch && i > ocLineIndex) {
          po = numberMatch[1];
          console.log(`   ✅ OC extraído (Número directo en línea ${i}): "${po}"`);
          break;
        }
      }
    }
    
    // Fallback: Buscar cualquier número de 6-8 dígitos después de "OC"
    if (!po) {
      const ocMatch = text.match(/\bOC\b[\s\S]{0,100}?\b(\d{6,8})\b/i);
      if (ocMatch && ocMatch[1]) {
        po = ocMatch[1];
        console.log(`   ✅ OC extraído (Búsqueda global): "${po}"`);
      }
    }
    
    if (!po) console.log("   ❌ OC no encontrado");

    // ==========================================
    // 3️⃣ EXTRACCIÓN DE REQ (Requisición)
    // ==========================================
    let req = '';
    console.log("\n📋 BUSCANDO REQ...");
    
    // Encontrar línea con "REQ"
    const reqLineIndex = lines.findIndex(line => /\bREQ\b/i.test(line));
    
    if (reqLineIndex >= 0) {
      console.log(`   ✓ REQ encontrado en línea ${reqLineIndex}: "${lines[reqLineIndex]}"`);
      
      // Buscar en las siguientes 4 líneas
      for (let i = reqLineIndex; i < Math.min(reqLineIndex + 5, lines.length); i++) {
        const line = lines[i];
        
        // Patrón 1: Número entre asteriscos (código de barras)
        const barcodeMatch = line.match(/\*\s*(\d[\d\s]{5,})\s*\*/);
        if (barcodeMatch) {
          req = barcodeMatch[1].replace(/\s+/g, '');
          if (req.length >= 6) {
            console.log(`   ✅ REQ extraído (Código de barras en línea ${i}): "${req}"`);
            break;
          }
        }
        
        // Patrón 2: Secuencia de 6-8 dígitos
        const numberMatch = line.match(/\b(\d{6,8})\b/);
        if (numberMatch && i > reqLineIndex) {
          req = numberMatch[1];
          console.log(`   ✅ REQ extraído (Número directo en línea ${i}): "${req}"`);
          break;
        }
      }
    }
    
    // Fallback: Buscar cualquier número de 6-8 dígitos después de "REQ"
    if (!req) {
      const reqMatch = text.match(/\bREQ\b[\s\S]{0,100}?\b(\d{6,8})\b/i);
      if (reqMatch && reqMatch[1]) {
        req = reqMatch[1];
        console.log(`   ✅ REQ extraído (Búsqueda global): "${req}"`);
      }
    }
    
    if (!req) console.log("   ❌ REQ no encontrado");

    // ==========================================
    // 4️⃣ VALIDACIÓN Y RESULTADOS
    // ==========================================
    console.log("\n✅ ===== RESULTADOS FINALES =====");
    console.log(`   TAG: ${tag || "❌ NO DETECTADO"}`);
    console.log(`   OC:  ${po || "❌ NO DETECTADO"}`);
    console.log(`   REQ: ${req || "❌ NO DETECTADO"}`);
    console.log("=" .repeat(50) + "\n");

    return { 
      tag: tag.trim(), 
      po: po.trim(), 
      req: req.trim() 
    };
  };

  const confirmImage = useCallback(async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setError(null);
    setOcrProgress('Iniciando OCR...');

    try {
      // 🔹 Mejorar la calidad del OCR con configuración optimizada
      const { data: { text } } = await Tesseract.recognize(
        capturedImage,
        'eng+spa', // Soporte para inglés y español
        { 
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(`Procesando: ${Math.round(m.progress * 100)}%`);
            }
            console.log(m);
          }
        }
      );

      setOcrProgress('Extrayendo información...');
      
      // Usar la función mejorada para extraer campos
      const extractedFields = extractFields(text);

      onImageCapture({
        image: capturedImage,
        text,
        fields: extractedFields
      });

    } catch (err) {
      console.error("❌ OCR error:", err);
      setError("No se pudo procesar la imagen. Intenta de nuevo con mejor iluminación.");
    } finally {
      setIsLoading(false);
      setOcrProgress('');
    }
  }, [capturedImage, onImageCapture]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setOcrProgress('');
    setError(null);
    startCamera();
  }, [startCamera]);

  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Scan Device Label</h2>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {!capturedImage ? (
            <div className="space-y-4">
              {stream ? (
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-lg bg-gray-900" />
                  <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center pointer-events-none">
                    <div className="text-white text-center bg-black/50 p-3 rounded-lg">
                      <p className="text-sm font-medium">Position device label in frame</p>
                      <p className="text-xs opacity-75 mt-1">Ensure text is clear and well-lit</p>
                      <p className="text-xs opacity-75">Hold steady for best results</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Starting camera...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center text-red-600 p-4">
                      <Camera className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">{error}</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Camera className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Camera not started</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {!stream && !error ? (
                  <button 
                    onClick={startCamera} 
                    disabled={isLoading} 
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4" />
                    Start Camera
                  </button>
                ) : stream ? (
                  <button 
                    onClick={capturePhoto} 
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    Capture Photo
                  </button>
                ) : null}

                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload Image
                </button>
              </div>

              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={capturedImage} 
                  alt="Captured label" 
                  className="w-full h-64 object-contain rounded-lg bg-gray-900" 
                />
              </div>

              {isLoading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                    <p className="text-sm text-blue-800">
                      <strong>{ocrProgress || "Processing..."}</strong>
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={retakePhoto} 
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Retake
                </button>
                <button 
                  onClick={confirmImage} 
                  disabled={isLoading} 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {isLoading ? ocrProgress || "Processing..." : "Use This Image"}
                </button>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}