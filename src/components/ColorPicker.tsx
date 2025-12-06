import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const presetColors = [
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#8B5A3C', // Brown
  '#6B7280', // Gray
  '#000000', // Black
];

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(color);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div 
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
          색상 변경
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-gray-700">프리셋 색상</label>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => onChange(presetColor)}
                  className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: presetColor,
                    borderColor: color === presetColor ? '#000' : '#e5e7eb'
                  }}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-gray-700">사용자 정의 색상</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <Button
                onClick={() => onChange(customColor)}
                size="sm"
                className="flex-1"
              >
                적용
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
