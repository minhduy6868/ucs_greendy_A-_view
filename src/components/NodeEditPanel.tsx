import React, { useState } from 'react';
import { X, Target, MapPin, Trash2, Check } from 'lucide-react';
import { Node } from './InteractiveDemo';

interface NodeEditPanelProps {
  node: Node;
  onUpdateHeuristic: (nodeId: string, heuristic: number) => void;
  onSetStart: (nodeId: string) => void;
  onSetGoal: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

const NodeEditPanel: React.FC<NodeEditPanelProps> = ({
  node,
  onUpdateHeuristic,
  onSetStart,
  onSetGoal,
  onDelete,
  onClose
}) => {
  const [heuristic, setHeuristic] = useState(node.heuristic.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveHeuristic = () => {
    const value = parseFloat(heuristic);
    if (!isNaN(value) && value >= 0) {
      onUpdateHeuristic(node.id, value);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveHeuristic();
    } else if (e.key === 'Escape') {
      setHeuristic(node.heuristic.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
            node.isStart ? 'bg-blue-500' : node.isGoal ? 'bg-red-500' : 'bg-gray-500'
          }`}>
            {node.id}
          </div>
          Chỉnh sửa Node {node.id}
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Node Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Loại Node</label>
          <div className="flex gap-2">
            <button
              onClick={() => onSetStart(node.id)}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                node.isStart 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-300 text-gray-600'
              }`}
            >
              <MapPin className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs font-medium">Start</div>
            </button>
            <button
              onClick={() => onSetGoal(node.id)}
              className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                node.isGoal 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-200 hover:border-red-300 text-gray-600'
              }`}
            >
              <Target className="w-4 h-4 mx-auto mb-1" />
              <div className="text-xs font-medium">Goal</div>
            </button>
          </div>
        </div>

        {/* Heuristic Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Heuristic h({node.id})
          </label>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <input
                  type="number"
                  value={heuristic}
                  onChange={(e) => setHeuristic(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                  autoFocus
                />
                <button
                  onClick={handleSaveHeuristic}
                  className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setHeuristic(node.heuristic.toString());
                    setIsEditing(false);
                  }}
                  className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono">
                  {node.heuristic}
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
            Ước lượng khoảng cách từ node này đến goal
          </p>
        </div>

        {/* Position Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí</label>
          <div className="grid grid-cols-2 gap-2">
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500">X</div>
              <div className="font-mono">{Math.round(node.x)}</div>
            </div>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-xs text-gray-500">Y</div>
              <div className="font-mono">{Math.round(node.y)}</div>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (window.confirm(`Bạn có chắc muốn xóa node ${node.id}?`)) {
                onDelete(node.id);
              }
            }}
            className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Xóa Node
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeEditPanel;