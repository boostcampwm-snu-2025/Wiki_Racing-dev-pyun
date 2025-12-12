import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Trophy } from 'lucide-react';

interface NameInputModalProps {
  open: boolean;
  rank: number;
  score: number;
  onSubmit: (nickname: string) => void;
}

export function NameInputModal({ open, rank, score, onSubmit }: NameInputModalProps) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = () => {
    const trimmedName = nickname.trim();
    if (trimmedName) {
      onSubmit(trimmedName);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="w-7 h-7 text-yellow-500" />
            축하합니다!
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {rank}위에 진입하셨습니다! 리더보드에 이름을 등록하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* 점수 표시 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg text-center">
            <div className="text-gray-600 text-sm mb-1">획득 점수</div>
            <div className="text-3xl font-bold text-orange-600">{score}점</div>
          </div>

          {/* 이름 입력 */}
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="이름을 입력하세요"
              maxLength={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoFocus
            />
            <div className="text-xs text-gray-500 mt-1">
              {nickname.length}/20 자
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!nickname.trim()}
              className="flex-1"
              size="lg"
            >
              등록하기
            </Button>
            <Button
              onClick={() => onSubmit('')}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              건너뛰기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
