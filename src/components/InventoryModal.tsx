import React, { useState, useEffect } from 'react';
import { X, Package, Trash2, Calendar, Camera, Monitor, Laptop, Server, Printer, Router, Smartphone, Tablet, Tv } from 'lucide-react';
import { InventoryDevice, InventoryFormData } from '../hooks/useInventory';
import { CameraScanner } from './CameraScanner';

interface InventoryModalProps {
  device?: InventoryDevice;
  onClose: () => void;
  onSave: (data: InventoryFormData) => Promise<void>;
  onDelete?: () => void;
}

// Definición de tipos de dispositivos con sus campos específicos
const DEVICE_TYPES = [
  { 
    id: 'Computer', 
    name: 'Desktop/Computer', 
    icon: Monitor,
    fields: ['cpu', 'ram', 'ssd', 'os_series'],
    description: 'Desktop computers and workstations'
  },
  { 
    id: 'Laptop', 
    name: 'Laptop', 
    icon: Laptop,
    fields: ['cpu', 'ram', 'ssd', 'os_series'],
    description: 'Portable computers'
  },
  { 
    id: 'Server', 
    name: 'Server', 
    icon: Server,
    fields: ['cpu', 'ram', 'ssd', 'os_series'],
    description: 'Server hardware'
  },
  { 
    id: 'Monitor', 
    name: 'Monitor', 
    icon: Tv,
    fields: ['model'], // Solo modelo (que incluirá specs)
    description: 'Display screens'
  },
  { 
    id: 'Printer', 
    name: 'Printer', 
    icon: Printer,
    fields: [],
    description: 'Printing devices'
  },
  { 
    id: 'Scanner', 
    name: 'Scanner', 
    icon: Package,
    fields: [],
    description: 'Document scanners'
  },
  { 
    id: 'Tablet', 
    name: 'Tablet', 
    icon: Tablet,
    fields: ['os_series'],
    description: 'Tablet devices'
  },
  { 
    id: 'Phone', 
    name: 'Phone', 
    icon: Smartphone,
    fields: ['os_series'],
    description: 'Mobile phones'
  },
  { 
    id: 'Router', 
    name: 'Router', 
    icon: Router,
    fields: [],
    description: 'Network routers'
  },
  { 
    id: 'Switch', 
    name: 'Switch', 
    icon: Router,
    fields: [],
    description: 'Network switches'
  },
  { 
    id: 'TV', 
    name: 'TV', 
    icon: Tv,
    fields: [],
    description: 'Television displays'
  },
  { 
    id: 'Other', 
    name: 'Other', 
    icon: Package,
    fields: [],
    description: 'Other devices'
  }
];

const OS_OPTIONS = ['Windows 11', 'Windows 10', 'macOS', 'Linux', 'Ubuntu', 'Android', 'iOS', 'Other'];
const STATUS_OPTIONS = ['Active', 'Inactive', 'Maintenance', 'Retired', 'Lost', 'Damaged'];

export function InventoryModal({ device, onClose, onSave, onDelete }: InventoryModalProps) {
  // Si es edición, saltar la selección de tipo
  const [step, setStep] = useState<'selectType' | 'form'>(device ? 'form' : 'selectType');
  const [selectedType, setSelectedType] = useState<string | null>(device?.type || null);
  
  const [formData, setFormData] = useState<InventoryFormData>({
    tag: device?.tag || '',
    employee_number: device?.employee_number || '',
    user_name: device?.user_name || '',
    hostname: device?.hostname || '',
    type: device?.type || 'Computer',
    brand: device?.brand || '',
    model: device?.model || '',
    os_series: device?.os_series || '',
    cpu: device?.cpu || '',
    ram: device?.ram || '',
    ssd: device?.ssd || '',
    req_no: device?.req_no || '',
    supplier: device?.supplier || '',
    plant_use: device?.plant_use || '',
    business_unit: device?.business_unit || '',
    department: device?.department || '',
    area: device?.area || '',
    status: device?.status || 'Active',
    comments: device?.comments || '',
    registration_date: device?.registration_date || new Date().toISOString().split('T')[0]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  // Obtener configuración del tipo seleccionado
  const deviceTypeConfig = DEVICE_TYPES.find(t => t.id === selectedType);
  const shouldShowField = (field: string) => {
    if (!deviceTypeConfig) return false;
    return deviceTypeConfig.fields.includes(field);
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setFormData(prev => ({ ...prev, type: typeId }));
    setStep('form');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof InventoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageCapture = async (data: {
    image: string;
    text: string;
    fields: {
      tag: string;
      po: string;
      req: string;
    };
  }) => {
    setReferenceImage(data.image);
    setShowScanner(false);

    try {
      const originalText = data.text;
      const textUpper = originalText.toUpperCase();
      const textLines = originalText.split('\n').map(line => line.trim()).filter(line => line);
      
      console.log("📸 ===== TEXTO OCR RECIBIDO =====");
      console.log(originalText);
      console.log("================================\n");

      // Extracción de TAG
      let detectedTag = '';
      const tagPattern1 = originalText.match(/TAG\s*[:：]\s*([A-Z0-9\-]{3,10})/i);
      for (let i = 0; i < textLines.length; i++) {
        if (/^TAG\s*[:：]?\s*$/i.test(textLines[i])) {
          if (textLines[i + 1]) {
            const nextLineNumber = textLines[i + 1].match(/^([A-Z0-9\-]{3,10})/i);
            if (nextLineNumber) {
              detectedTag = nextLineNumber[1];
              break;
            }
          }
        } else if (/TAG\s*[:：]\s*([A-Z0-9\-]{3,10})/i.test(textLines[i])) {
          const match = textLines[i].match(/TAG\s*[:：]\s*([A-Z0-9\-]{3,10})/i);
          if (match) {
            detectedTag = match[1];
            break;
          }
        }
      }
      if (!detectedTag) {
        const tagContext = originalText.match(/TAG[\s\S]{0,30}?(\d{4,6})/i);
        if (tagContext) detectedTag = tagContext[1];
      }
      if (!detectedTag && data.fields.tag) {
        detectedTag = data.fields.tag;
      }
      console.log("🏷️  TAG detectado:", detectedTag || "❌ NO DETECTADO");

      // Extracción de REQ
      let detectedReq = '';
      const reqPattern1 = originalText.match(/REQ[\s\S]{0,50}?\*\s*(\d{6,8})\s*\*/i);
      for (let i = 0; i < textLines.length; i++) {
        if (/^REQ\s*$/i.test(textLines[i])) {
          for (let j = i + 1; j < Math.min(i + 4, textLines.length); j++) {
            const numberMatch = textLines[j].match(/\*?\s*(\d{6,8})\s*\*/);
            if (numberMatch) {
              detectedReq = numberMatch[1];
              break;
            }
          }
          if (detectedReq) break;
        }
      }
      if (!detectedReq) {
        const reqPattern2 = originalText.match(/REQ[\s\S]{0,100}?(\d{6,8})/i);
        if (reqPattern2) detectedReq = reqPattern2[1];
      }
      if (!detectedReq && data.fields.req) {
        detectedReq = data.fields.req;
      }
      console.log("📋 REQ detectado:", detectedReq || "❌ NO DETECTADO");

      // Detección de tipo de dispositivo
      let deviceType = formData.type; // Mantener el tipo seleccionado
      const typePatterns = [
        { pattern: /\bMONITOR\b/i, type: 'Monitor' },
        { pattern: /\bLAPTOP\b|\bPORTÁTIL\b|\bNOTEBOOK\b/i, type: 'Laptop' },
        { pattern: /\bPC\b.*\bDELL\b|\bDESKTOP\b|\bESCRITORIO\b|\bOPTIPLEX\b|\bPRECISION\b/i, type: 'Computer' },
        { pattern: /\bIMPRESORA\b|\bPRINTER\b|\bLASERJET\b|\bOFFICEJET\b/i, type: 'Printer' },
        { pattern: /\bTABLET\b|\bIPAD\b/i, type: 'Tablet' },
        { pattern: /\bROUTER\b|\bACCESS\s+POINT\b/i, type: 'Router' },
        { pattern: /\bSWITCH\b/i, type: 'Switch' },
        { pattern: /\bTV\b|\bTELEVISOR\b|\bTELEVISION\b/i, type: 'TV' },
        { pattern: /\bPHONE\b|\bTELÉFONO\b|\bIPHONE\b|\bGALAXY\b/i, type: 'Phone' },
        { pattern: /\bSCANNER\b|\bESCÁNER\b/i, type: 'Scanner' },
        { pattern: /\bSERVER\b|\bSERVIDOR\b/i, type: 'Server' }
      ];
      
      for (const { pattern, type } of typePatterns) {
        if (pattern.test(textUpper)) {
          deviceType = type;
          break;
        }
      }
      console.log("💻 Tipo detectado:", deviceType);

      // Extracción de marca
      let detectedBrand = '';
      const brandPatterns = [
        { pattern: /\bDELL\b/i, name: 'Dell' },
        { pattern: /\bHP\b|\bHEWLETT\b/i, name: 'HP' },
        { pattern: /\bLENOVO\b/i, name: 'Lenovo' },
        { pattern: /\bASUS\b/i, name: 'ASUS' },
        { pattern: /\bSAMSUNG\b/i, name: 'Samsung' },
        { pattern: /\bLG\b/i, name: 'LG' },
        { pattern: /\bAPPLE\b/i, name: 'Apple' },
        { pattern: /\bACER\b/i, name: 'Acer' },
        { pattern: /\bTOSHIBA\b/i, name: 'Toshiba' },
        { pattern: /\bSONY\b/i, name: 'Sony' }
      ];
      
      for (const { pattern, name } of brandPatterns) {
        if (pattern.test(textUpper)) {
          detectedBrand = name;
          break;
        }
      }
      console.log("🏢 Marca detectada:", detectedBrand || "❌ NO DETECTADO");

      // Extracción de modelo
      let detectedModel = '';
      const modelPatterns = [
        /\b[A-Z]{2}\d{2}[A-Z]{2,6}\b/i,
        /\b(?:OPTIPLEX|PRECISION|LATITUDE|INSPIRON|VOSTRO)\s+\d{4}\b/i,
        /\b(?:ELITEBOOK|PROBOOK|PAVILION|ENVY|ELITEDESK|PRODESK)\s+\d{3,4}[A-Z]?\b/i,
        /\b(?:THINKPAD|IDEAPAD|THINKCENTRE)\s+[A-Z]?\d{3,4}\b/i,
        /\b[A-Z]+\d{3,5}[A-Z]{0,3}\b/i
      ];
      
      for (const pattern of modelPatterns) {
        const match = originalText.match(pattern);
        if (match) {
          detectedModel = match[0].trim();
          if (!/(MONITOR|LAPTOP|DESKTOP|PRINTER|TABLET|PHONE|ROUTER|SWITCH)/i.test(detectedModel)) {
            break;
          }
        }
      }
      console.log("📱 Modelo detectado:", detectedModel || "❌ NO DETECTADO");

      // Especificaciones de Monitor
      const screenSize = originalText.match(/(\d{2,3}(?:\.\d)?)\s*(?:PULGADAS|"|INCH|'')/i);
      const resolution = originalText.match(/\b(1080P|4K|2K|FULL\s*HD|FHD|HD|UHD|QHD)\b/i);
      const refreshRate = originalText.match(/(\d{2,3})\s*HZ\b/i);
      const panelType = originalText.match(/\b(IPS|TN|VA|OLED|LED)\b/i);
      
      let modelDescription = detectedModel;
      if (deviceType === 'Monitor') {
        let specs = [];
        if (screenSize) specs.push(`${screenSize[1]}"`);
        if (resolution) specs.push(resolution[1]);
        if (panelType) specs.push(panelType[1]);
        if (refreshRate) specs.push(`${refreshRate[1]}Hz`);
        
        if (specs.length > 0) {
          modelDescription = detectedModel ? 
            `${detectedModel} (${specs.join(', ')})` : 
            specs.join(', ');
        }
      }
      console.log("📺 Descripción del modelo:", modelDescription);

      // Extracción de usuario
      let detectedUser = '';
      const userPattern1 = originalText.match(/\((?:CALIDAD\s+)?(?:PL\d+\s*[\/\-]\s*)?([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)\)/i);
      const userPattern2 = originalText.match(/(?:USUARIO|USER|ASIGNADO|ASSIGNED)\s*[:：]\s*([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+)/i);
      const userPattern3 = originalText.match(/\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)\b/);
      
      if (userPattern1) {
        detectedUser = userPattern1[1].trim();
      } else if (userPattern2) {
        detectedUser = userPattern2[1].trim();
      } else if (userPattern3) {
        const possibleName = userPattern3[1];
        if (!/FULL|CABLE|SIST|DESK|SERVICE/i.test(possibleName)) {
          detectedUser = possibleName;
        }
      }
      console.log("👤 Usuario detectado:", detectedUser || "❌ NO DETECTADO");

      // Especificaciones técnicas (solo para PC/Laptop/Server)
      const ramMatch = originalText.match(/(\d+)\s*GB\s*(?:RAM|DDR\d?|MEMORIA)/i);
      const ssdMatch = originalText.match(/(\d+)\s*(TB|GB)\s*(?:SSD|HDD|STORAGE|DISCO)/i);
      const processorMatch = originalText.match(/(?:INTEL\s+(?:CORE\s+)?I[3579](?:-\d+[A-Z]*)?|AMD\s+RYZEN\s+[3579]\s+\d+|XEON[\s\w\-\d]+)/i);
      
      console.log("🧠 CPU detectado:", processorMatch ? processorMatch[0] : "❌ NO DETECTADO");
      console.log("💾 RAM detectada:", ramMatch ? `${ramMatch[1]}GB` : "❌ NO DETECTADO");
      console.log("💿 SSD detectado:", ssdMatch ? `${ssdMatch[1]}${ssdMatch[2]}` : "❌ NO DETECTADO");

      // Actualizar formulario
      console.log("\n📝 ===== ACTUALIZANDO FORMULARIO =====");
      
      setFormData(prev => {
        const updates: Partial<InventoryFormData> = {};
        
        if (deviceType && deviceType !== 'Other') {
          updates.type = deviceType;
          // Actualizar el tipo seleccionado
          setSelectedType(deviceType);
          console.log("✅ Tipo actualizado:", deviceType);
        }
        
        if (detectedTag && detectedTag.length >= 3) {
          updates.tag = detectedTag;
          console.log("✅ TAG actualizado:", detectedTag);
        }
        
        if (detectedReq && detectedReq.length >= 6) {
          updates.req_no = detectedReq;
          console.log("✅ REQ actualizado:", detectedReq);
        }
        
        if (detectedBrand) {
          updates.brand = detectedBrand;
          console.log("✅ Marca actualizada:", detectedBrand);
        }
        
        if (modelDescription) {
          updates.model = modelDescription;
          console.log("✅ Modelo actualizado:", modelDescription);
        }
        
        if (detectedUser) {
          updates.user_name = detectedUser;
          console.log("✅ Usuario actualizado:", detectedUser);
        }
        
        // Solo agregar specs si el tipo de dispositivo las soporta
        const newType = deviceType || prev.type;
        const newTypeConfig = DEVICE_TYPES.find(t => t.id === newType);
        
        if (newTypeConfig && newTypeConfig.fields.includes('cpu') && processorMatch) {
          updates.cpu = processorMatch[0].trim();
          console.log("✅ CPU actualizado:", processorMatch[0].trim());
        }
        
        if (newTypeConfig && newTypeConfig.fields.includes('ram') && ramMatch) {
          updates.ram = `${ramMatch[1]}GB DDR4`;
          console.log("✅ RAM actualizado:", `${ramMatch[1]}GB DDR4`);
        }
        
        if (newTypeConfig && newTypeConfig.fields.includes('ssd') && ssdMatch) {
          updates.ssd = `${ssdMatch[1]}${ssdMatch[2]} SSD`;
          console.log("✅ SSD actualizado:", `${ssdMatch[1]}${ssdMatch[2]} SSD`);
        }
        
        const scanNote = `[Scanned from IT Service Desk Ticket - ${new Date().toLocaleDateString()}]`;
        updates.comments = prev.comments ? 
          `${prev.comments}\n\n${scanNote}` : 
          scanNote;
        
        console.log("====================================\n");
        
        return { ...prev, ...updates };
      });

    } catch (err) {
      console.error("❌ OCR Error:", err);
      alert("Error al procesar la imagen. Por favor, intenta nuevamente o ingresa los datos manualmente.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Renderizar selector de tipo
  if (step === 'selectType') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Device Type</h2>
              <p className="text-sm text-gray-500 mt-1">Choose the type of device you want to register</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Device Type Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {DEVICE_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Icon className="h-8 w-8 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 text-sm">{type.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar formulario
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {deviceTypeConfig && <deviceTypeConfig.icon className="h-5 w-5 text-blue-600" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {device ? 'Edit Device' : `Register New ${deviceTypeConfig?.name}`}
              </h2>
              {!device && (
                <button
                  onClick={() => setStep('selectType')}
                  className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                >
                  Change device type
                </button>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Reference Image */}
        {referenceImage && (
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img
                  src={referenceImage}
                  alt="Device label reference"
                  className="w-32 h-24 object-cover rounded-lg border border-gray-300"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Reference Image</h3>
                <p className="text-xs text-gray-600 mb-2">Use this image to fill in the device information below</p>
                <button
                  onClick={() => setReferenceImage(null)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Scan Button */}
          {!referenceImage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Scan Device Label</h3>
                  <p className="text-xs text-blue-700 mt-1">Take a photo or upload an image of the device label for reference</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Camera className="h-4 w-4" />
                  Scan Label
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Information - SIEMPRE SE MUESTRA */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => handleChange('tag', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., PC-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee #
                </label>
                <input
                  type="text"
                  value={formData.employee_number}
                  onChange={(e) => handleChange('employee_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., EMP001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User
                </label>
                <input
                  type="text"
                  value={formData.user_name}
                  onChange={(e) => handleChange('user_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hostname
                </label>
                <input
                  type="text"
                  value={formData.hostname}
                  onChange={(e) => handleChange('hostname', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., DESKTOP-ABC123"
                />
              </div>
            </div>

            {/* Device Specifications - CAMPOS DINÁMICOS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Device Specifications</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  value={formData.type}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Dell, HP, Apple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., OptiPlex 7090"
                />
              </div>

              {/* OS Series - Solo para Computer, Laptop, Server, Tablet, Phone */}
              {shouldShowField('os_series') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OS Series
                  </label>
                  <select
                    value={formData.os_series}
                    onChange={(e) => handleChange('os_series', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select OS</option>
                    {OS_OPTIONS.map(os => (
                      <option key={os} value={os}>{os}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* CPU - Solo para Computer, Laptop, Server */}
              {shouldShowField('cpu') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPU
                  </label>
                  <input
                    type="text"
                    value={formData.cpu}
                    onChange={(e) => handleChange('cpu', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., Intel i7-11700"
                  />
                </div>
              )}

              {/* RAM - Solo para Computer, Laptop, Server */}
              {shouldShowField('ram') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RAM
                  </label>
                  <input
                    type="text"
                    value={formData.ram}
                    onChange={(e) => handleChange('ram', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., 16GB DDR4"
                  />
                </div>
              )}

              {/* SSD - Solo para Computer, Laptop, Server */}
              {shouldShowField('ssd') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSD/Storage
                  </label>
                  <input
                    type="text"
                    value={formData.ssd}
                    onChange={(e) => handleChange('ssd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="e.g., 512GB SSD"
                  />
                </div>
              )}
            </div>

            {/* Administrative Information - SIEMPRE SE MUESTRA */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Administrative</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Req. No.
                </label>
                <input
                  type="text"
                  value={formData.req_no}
                  onChange={(e) => handleChange('req_no', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., REQ-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => handleChange('supplier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Tech Solutions Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plant Use
                </label>
                <input
                  type="text"
                  value={formData.plant_use}
                  onChange={(e) => handleChange('plant_use', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Production, Office"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Unit
                </label>
                <input
                  type="text"
                  value={formData.business_unit}
                  onChange={(e) => handleChange('business_unit', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., IT, HR, Finance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Information Technology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area
                </label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Building A, Floor 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={formData.registration_date}
                    onChange={(e) => handleChange('registration_date', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comments - Full Width */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Additional notes or comments about this device..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
            {device && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Device
              </button>
            ) : (
              <div />
            )}
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !formData.tag.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                {isSaving ? 'Saving...' : device ? 'Save Changes' : 'Register Device'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Camera Scanner Modal */}
      {showScanner && (
        <CameraScanner
          onImageCapture={handleImageCapture}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}