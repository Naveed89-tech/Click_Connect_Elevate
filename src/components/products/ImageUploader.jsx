import { useRef } from 'react';
import { FiImage, FiUpload } from 'react-icons/fi';
import PropTypes from 'prop-types';

const ImageUploader = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
      onClick={() => fileInputRef.current.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*"
      />
      <div className="flex flex-col items-center justify-center">
        <FiImage className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
      </div>
    </div>
  );
};

ImageUploader.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

export default ImageUploader;