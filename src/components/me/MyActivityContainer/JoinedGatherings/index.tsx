import { useEffect, useState } from 'react';
import { getJoinedGathering } from '@/apis/gatherings/joined';
import { leaveGathering } from '@/apis/gatherings/[id]';
import { postReviews } from '@/apis/reviews/reviews';
import { JoinedGathering } from '@/types/response/gatherings';
import GatheringCard from './GatheringCard';

/**
 * JoinedGatherings 컴포넌트
 *
 * 사용자가 참여한 모임 목록을 카드 리스트로 렌더링합니다. 이 컴포넌트는
 * - 로컬 모킹 데이터로 초기화되어 있으며(개발 편의), 실제 API와 연결할 경우 주석 처리된 useEffect를 활성화하면 됩니다.
 * - 각 카드에서 리뷰 작성 또는 모임 취소가 발생하면 목록 상태를 로컬에서 업데이트합니다.
 *
 * @component
 * @returns {JSX.Element} 참여한 모임 목록을 렌더링하는 React 컴포넌트
 * @example
 * <JoinedGatherings />
 */
export default function JoinedGatherings() {
	const [gatherings, setGatherings] = useState<JoinedGathering[]>([]);

	useEffect(() => {
		const fetchGatherings = async () => {
			try {
				const data = await getJoinedGathering({ sortBy: 'dateTime', sortOrder: 'asc' });

				setGatherings(data);
			} catch (err) {
				console.error(err);
			}
		};
		fetchGatherings();
	}, []);

	/**
	 * 리뷰 작성 성공 콜백
	 *
	 * 해당 모임의 isReviewed 플래그를 true로 설정하여 UI를 갱신합니다.
	 * 이 함수는 부모 컴포넌트에서 자식 카드(GatheringCard)가 리뷰 성공 시 호출합니다.
	 *
	 * @param {number} id - 리뷰가 작성된 모임의 ID
	 * @returns {void}
	 */
	const handleReviewSuccess = async (gatheringId: number, score: number, comment: string): Promise<void> => {
		try {
			await postReviews({ gatheringId, score, comment });
			setGatherings(prev => prev.map(g => (g.id === gatheringId ? { ...g, isReviewed: true } : g)));
		} catch (err) {
			console.error(err);
		}
	};

	/**
	 * 취소(모임 탈퇴/삭제) 성공 콜백
	 *
	 * 목록에서 해당 모임을 제거합니다. 자식 컴포넌트에서 탈퇴 성공 시 호출됩니다.
	 *
	 * @param {number} id - 취소된 모임의 ID
	 * @returns {void}
	 */
	const handleCancelSuccess = async (id: number) => {
		try {
			await leaveGathering(id);
			setGatherings(prev => prev.filter(g => g.id !== id));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			{gatherings.map(gathering => (
				<GatheringCard
					key={gathering.id}
					gathering={gathering}
					onReviewSuccess={(score, comment) => handleReviewSuccess(gathering.id, score, comment)}
					onCancelSuccess={() => handleCancelSuccess(gathering.id)}
				/>
			))}
		</div>
	);
}
