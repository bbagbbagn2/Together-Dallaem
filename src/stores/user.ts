import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface UserData {
	/** 유저 고유 ID */
	userId: number;
	/** 인증 토큰 */
	token: string;
	/** 이메일 (선택) */
	email?: string;
	/** 이름 (선택) */
	name?: string;
	/** 회사 이름 (선택) */
	companyName?: string;
	/** 프로필 이미지 URL (선택) */
	image?: string;
}

interface UserState {
	/** 현재 로그인한 유저 정보 */
	user: UserData | null;
}

interface UserActions {
	/**
	 * 유저 로그인 (userId와 token만 설정)
	 * @param userId 유저 고유 ID
	 * @param token 인증 토큰
	 */
	signinUser: ({ userId, token }: Pick<UserData, 'userId' | 'token'>) => void;

	/**
	 * 유저 로그아웃 (스토어 초기화)
	 */
	signoutUser: () => void;

	/**
	 * 유저 정보 업데이트 (Partial로 부분 업데이트)
	 * @param user 업데이트할 유저 데이터 일부
	 */
	updateUser: (user: Partial<UserData>) => void;
}

/** User 스토어 전체 타입 */
export type UserStore = UserState & UserActions;

const initialState: UserState = { user: null };

/**
 * 사용자 상태 및 인증 관련 zustand 스토어
 * - devtools: Redux DevTools 연동
 * - persist: localStorage에 유저 상태 영속화
 */
export const useUserStore = create<UserStore>()(
	devtools(
		persist(
			set => {
				return {
					...initialState,
					signinUser: ({ userId, token }: Pick<UserData, 'userId' | 'token'>) =>
						set(
							state => ({
								user: {
									...(state.user ?? {}),
									userId,
									token
								}
							}),
							false,
							'signinUser'
						),
					signoutUser: () => set(initialState, false, 'signoutUser'),
					updateUser: (user: Partial<UserData>) =>
						set(
							state => ({
								user: {
									...(state.user as UserData),
									...user
								}
							}),
							false,
							'updateUser'
						)
				};
			},
			{
				name: 'user-store-persist'
			}
		),
		{
			name: 'user-store'
		}
	)
);
