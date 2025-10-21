import { postSignout } from '@/apis/auths/signout';
import { useUserStore } from '@/stores/user';
import { render, screen } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { usePathname, useRouter } from 'next/navigation';
import GNB from '.';

jest.mock('next/navigation', () => ({
	useRouter: jest.fn(),
	usePathname: jest.fn()
}));

jest.mock('@/stores/user', () => ({
	useUserStore: jest.fn()
}));

jest.mock('@/apis/auths/signout', () => ({
	postSignout: jest.fn()
}));

describe('GNB 테스트', () => {
	let user: UserEvent;
	const mockPush = jest.fn();
	const mockSignoutUser = jest.fn();
	const mockUser = { token: 'token', userId: 1, image: '/images/profile.svg' };

	beforeEach(() => {
		user = userEvent.setup();
		(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
		(usePathname as jest.Mock).mockReturnValue('/');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('메뉴 클릭', () => {
		beforeEach(() => {
			mockUserStore();
			render(<GNB />);
		});

		test('"모임 찾기" 메뉴를 클릭하면 "/"으로 이동한다', async () => {
			// 1. 모임 찾기 메뉴 누르기
			const link = screen.getByRole('link', { name: '모임 찾기' });
			await user.click(link);

			// 2. 홈 페이지로 이동했는지 확인하기
			expect(link).toHaveAttribute('href', '/');
		});

		test('"찜한 모임" 메뉴를 클릭하면 "/favorites"으로 이동한다', async () => {
			// 1. 찜한 모임 메뉴 누르기
			const link = screen.getByRole('link', { name: '찜한 모임' });
			await user.click(link);

			// 2. 홈 페이지로 이동했는지 확인하기
			expect(link).toHaveAttribute('href', '/favorites');
		});

		test('"모든 리뷰" 메뉴를 클릭하면 "/reviews"으로 이동한다', async () => {
			// 1. 모든 리뷰 메뉴 누르기
			const link = screen.getByRole('link', { name: '모든 리뷰' });
			await user.click(link);

			// 2. 리뷰 페이지로 이동했는지 확인하기
			expect(link).toHaveAttribute('href', '/reviews');
		});
	});

	describe('GNB 버튼 동작', () => {
		describe('미로그인 상태', () => {
			beforeEach(() => {
				mockUserStore();
				render(<GNB />);
			});

			test('비로그인 사용자가 로그인 버튼 클릭 시 "/signin"으로 이동한다', async () => {
				// 1. 로그인 링크 누르기
				const link = screen.getByRole('link', { name: '로그인' });
				await user.click(link);

				// 2. 홈 페이지로 이동했는지 확인하기
				expect(link).toHaveAttribute('href', '/signin');
			});
		});

		describe('로그인 상태', () => {
			beforeEach(() => {
				mockUserStore({ user: mockUser, signoutUser: mockSignoutUser });
				render(<GNB />);
			});

			test('로그인 사용자가 드롭다운(프로필 사진)의 마이페이지 버튼 클릭 시 "/me"로 이동한다', async () => {
				// 1. 트리거가 프로필 이미지로 표시되는지 확인
				const profileImage = screen.getByRole('img', { name: '프로필 사진' });
				expect(profileImage).toBeInTheDocument();

				// 2. 트리거 버튼 누르기
				const trigger = screen.getByRole('button', { name: 'DropdownMenu Trigger' });
				await user.click(trigger);

				// 3. 마이페이지로 이동했는지 확인하기
				const myPageButton = await screen.findByText('마이페이지');
				await user.click(myPageButton);

				// 3. 홈 페이지로 이동했는지 확인하기
				expect(mockPush).toHaveBeenCalledWith('/me');
			});

			test('로그인 사용자가 드롭다운(프로필 사진)의 로그아웃 버튼 클릭 시 로그아웃한다', async () => {
				// 1. 트리거가 프로필 이미지로 표시되는지 확인
				const profileImage = screen.getByRole('img', { name: '프로필 사진' });
				expect(profileImage).toBeInTheDocument();

				// 2. 트리거 버튼 누르기
				const trigger = screen.getByRole('button', { name: 'DropdownMenu Trigger' });
				await user.click(trigger);

				// 3. 로그아웃 메뉴 클릭하기
				const signoutButton = await screen.findByText('로그아웃');
				await user.click(signoutButton);

				// 4. 로그아웃 실행됐는지 확인하기
				expect(postSignout).toHaveBeenCalled();
				expect(mockSignoutUser).toHaveBeenCalled();
			});
		});

		describe('마이페이지에서 로그아웃할 때', () => {
			beforeEach(() => {
				(usePathname as jest.Mock).mockReturnValue('/me');
				mockUserStore({ user: mockUser, signoutUser: mockSignoutUser });
				render(<GNB />);
			});

			test('로그인 사용자가 드롭다운(프로필 사진)의 로그아웃 버튼 클릭 시 로그아웃 후 "/"으로 이동한다', async () => {
				// 1. 트리거가 프로필 이미지로 표시되는지 확인
				const profileImage = screen.getByRole('img', { name: '프로필 사진' });
				expect(profileImage).toBeInTheDocument();

				// 2. 트리거 버튼 누르기
				const trigger = screen.getByRole('button', { name: 'DropdownMenu Trigger' });
				await user.click(trigger);

				// 3. 로그아웃 메뉴 클릭하기
				const signoutButton = await screen.findByText('로그아웃');
				await user.click(signoutButton);

				// 4. 로그아웃 실행됐는지 확인하기
				expect(postSignout).toHaveBeenCalled();
				expect(mockSignoutUser).toHaveBeenCalled();
				expect(mockPush).toHaveBeenCalledWith('/');
			});
		});
	});
});

function mockUserStore(state?: Partial<ReturnType<typeof useUserStore>>) {
	(useUserStore as jest.MockedFunction<typeof useUserStore>).mockImplementation(selector =>
		selector({
			user: null,
			signinUser: jest.fn(),
			updateUser: jest.fn(),
			signoutUser: jest.fn(),
			...(state ?? {})
		})
	);
}
