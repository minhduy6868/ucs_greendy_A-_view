import React, { useState } from 'react';
import { X, Trash2, Check, ArrowRight } from 'lucide-react';
import { Edge } from './InteractiveDemo';

interface EdgeEditPanelProps {
  edge: Edge;
  onUpdateCost: (fromId: string, toId: string, cost: number) => void;
  onDelete: (fromId: string, toId: string) => void;
  onClose: () => void;
}

const EdgeEditPanel: React.FC<EdgeEditPanelProps> = ({
  edge,
  onUpdateCost,
  onDelete,
  onClose
}) => {
  const [cost, setCost] = useState(edge.cost.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveCost = () => {
    const value = parseFloat(cost);
    if (!isNaN(value) && value > 0) {
      onUpdateCost(edge.from, edge.to, value);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveCost();
    } else if (e.key === 'Escape') {
      setCost(edge.cost.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {edge.from}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {edge.to}
            </div>
          </div>
          Chỉnh sửa Edge
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Edge Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kết nối</label>
          <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="font-semibold text-blue-600">{edge.from}</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-red-600">{edge.to}</span>
          </div>
        </div>

        {/* Cost Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chi phí (Cost)
          </label>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0.1"
                  step="0.1"
                  autoFocus
                />
                <button
                  onClick={handleSaveCost}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setCost(edge.cost.toString());
                    setIsEditing(false);
                  }}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-center">
                  {edge.cost}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Sửa
                </button>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Chi phí để di chuyển từ {edge.from} đến {edge.to}
          </p>
        </div>

        {/* Quick Cost Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giá trị nhanh
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 5, 10].map(value => (
              <button
                key={value}
                onClick={() => {
                  onUpdateCost(edge.from, edge.to, value);
                  setCost(value.toString());
                }}
                className={`p-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                  edge.cost === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 text-gray-600'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {/* Delete Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (window.confirm(`Bạn có chắc muốn xóa edge ${edge.from} → ${edge.to}?`)) {
                onDelete(edge.from, edge.to);
              }
            }}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Xóa Edge
          </button>
        </div>
      </div>
    </div>
  );
};

export default EdgeEditPanel;