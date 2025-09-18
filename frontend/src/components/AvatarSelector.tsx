'use client';

import React, { useState } from 'react';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onAvatarSelect: (avatar: string) => void;
  availableAvatars?: string[];
}

const defaultAvatars = [
  '🐻', '🐱', '🐶', '🐺', '🦊', '🐨', '🐼', '🐸', 
  '🐱', '🦁', '🐯', '🐮', '🐷', '🐵', '🐰', '🐹',
  '🦄', '🐴', '🐗', '🐭', '🐳', '🐙', '🦀', '🐢',
  '🦅', '🐧', '🐔', '🦆', '🦉', '🦇', '🦋', '🐝'
];

export default function AvatarSelector({ selectedAvatar, onAvatarSelect, availableAvatars = defaultAvatars }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Escolha seu avatar:
      </label>
      
      {/* Avatar selecionado */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 text-3xl bg-white border-2 border-gray-300 rounded-full hover:border-blue-500 focus:outline-none focus:border-blue-500 transition-colors duration-200 flex items-center justify-center"
      >
        {selectedAvatar || '🐻'}
      </button>

      {/* Lista de avatars */}
      {isOpen && (
        <div className="absolute top-20 left-0 z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-4 grid grid-cols-8 gap-2 max-w-sm">
          {availableAvatars.map((avatar, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onAvatarSelect(avatar);
                setIsOpen(false);
              }}
              className={`w-10 h-10 text-2xl rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                selectedAvatar === avatar ? 'bg-blue-100 ring-2 ring-blue-500' : ''
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      )}

      {/* Overlay para fechar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
