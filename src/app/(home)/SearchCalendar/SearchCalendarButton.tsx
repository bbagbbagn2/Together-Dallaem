'use client';

/**
 * SearchInCalendarButton 컴포넌트
 * - 달력에서 날짜를 선택하고 '적용' 버튼을 눌러 선택 완료
 * - 선택된 날짜는 부모 컴포넌트로 전달
 * - '초기화' 버튼을 눌러 선택된 날짜를 초기화
 * - 선택된 날짜가 없으면 버튼 비활성화
 * @props date: Date | undefined - 선택된 날짜
 * @props setDate: (date: Date | undefined) => void - 날짜 설정 함수
 * @props setIsOpen: (open: boolean) => void - 팝오버 열림 상태 설정 함수
 * @returns
 *
 */

import { cn } from '@/utils/cn';

interface CalendarButtonProps {
	date?: Date;
	setDate: (date?: Date) => void;
	setIsOpen: (open: boolean) => void;
	onChange?: (date?: Date) => void;
}

// TODO: 기존 컴포넌트로 교체
export default function SearchCalendarButton({ date, setDate, setIsOpen, onChange }: CalendarButtonProps) {
	const handleApply = () => {
		if (!date) return;
		setDate(date);
		setIsOpen(false);
	};

	// 버튼 스타일 개선
	const buttonStyles = {
		reset: {
			active: 'cursor-pointer border border-orange-400 text-orange-400',
			disabled: 'cursor-not-allowed border border-gray-300 text-gray-300'
		},
		apply: {
			active: 'cursor-pointer bg-orange-600 text-white',
			disabled: 'cursor-not-allowed bg-gray-400 text-white'
		}
	};

	return (
		<div className="mt-2 flex w-full gap-3">
			<button
				className={cn('flex-1 rounded-lg p-2', date ? buttonStyles.reset.active : buttonStyles.reset.disabled)}
				onClick={() => {
					setDate(undefined);
					onChange?.(undefined);
				}}
				disabled={!date}>
				초기화
			</button>
			<button
				className={cn('flex-1 rounded-lg p-2', date ? buttonStyles.apply.active : buttonStyles.apply.disabled)}
				onClick={handleApply}
				disabled={!date}>
				적용
			</button>
		</div>
	);
}
