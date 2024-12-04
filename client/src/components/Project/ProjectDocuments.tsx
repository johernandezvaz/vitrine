import React, { useState, useRef } from 'react';

interface ProjectDocumentsProps {
  projectId: string;
  onDocumentsUploaded: () => void;
}

const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ projectId, onDocumentsUploaded }) => {
    const token = localStorage.getItem('authToken');
  

    if (!token) {
        throw new Error("Respuesta inesperada del servidor");
      }
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const contractInputRef = useRef<HTMLInputElement>(null);
  const paymentInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'contract' | 'payment') => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'contract') {
        setContractFile(file);
      } else {
        setPaymentFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractFile || !paymentFile) {
      setError('Por favor, selecciona ambos archivos');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('contract', contractFile);
      formData.append('payment', paymentFile);



      const response = await fetch(`http://localhost:5000/api/projects/${projectId}/upload-documents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir los documentos');
      }

      // Reset form
      setContractFile(null);
      setPaymentFile(null);
      if (contractInputRef.current) contractInputRef.current.value = '';
      if (paymentInputRef.current) paymentInputRef.current.value = '';
      
      onDocumentsUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir los documentos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Subir Documentos del Proyecto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contrato Firmado
          </label>
          <input
            ref={contractInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'contract')}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
          {contractFile && (
            <p className="mt-1 text-sm text-gray-500">
              Archivo seleccionado: {contractFile.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Comprobante de Pago
          </label>
          <input
            ref={paymentInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'payment')}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
          {paymentFile && (
            <p className="mt-1 text-sm text-gray-500">
              Archivo seleccionado: {paymentFile.name}
            </p>
          )}
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !contractFile || !paymentFile}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Subiendo...' : 'Subir Documentos'}
        </button>
      </form>
    </div>
  );
};

export default ProjectDocuments;