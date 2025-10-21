'use client';

import { postSignout } from '@/apis/auths/signout';

import type { OptionType } from '@/components/commons/basic/BasicDropbox';
import { DropdownMenu } from '@/components/commons/GNB/DropdownMenu';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/stores/user';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/**
 * GNB(Global Navigation Bar)
 * - 로그인 상태에 따라 다른 UI를 렌더링함
 * - 마이페이지, 로그아웃, 로그인 등 주요 내비게이션 기능 포함
 */
export default function GNB() {
	const router = useRouter();
	const pathname = usePathname();
	const user = useUserStore(state => state.user);
	const signoutUser = useUserStore(state => state.signoutUser);
	const { isAuthenticated } = useAuth();

	const DROPDOWN_MENU_OPTIONS: OptionType[] = [
		{ value: 'myPage', text: '마이페이지' },
		{ value: 'signout', text: '로그아웃' }
	];

	const NAVBAR_MENU_LINKS = [
		{ href: '/', label: '모임 찾기' },
		{ href: '/favorites', label: '찜한 모임' },
		{ href: '/reviews', label: '모든 리뷰' }
	];

	/**
	 * 드롭다운 메뉴 클릭 시 실행되는 함수
	 * @param value - 선택된 메뉴 옵션의 value
	 */
	const handleDropdownMenuClick = async (value: string | number) => {
		if (value === DROPDOWN_MENU_OPTIONS[0].value) {
			router.push('/me');
			return;
		}

		await postSignout();
		signoutUser();
		if (pathname === '/me') {
			router.push('/');
		}
	};

	/**
	 * 로그인 버튼 클릭 시 실행되는 함수
	 * 현재 경로(pathname)를 쿼리 파라미터로 전달하여 로그인 후 리다이렉트 가능하게 함
	 */
	const handleSigninClick = () => {
		if (pathname === '/signin') return;
		const path = pathname !== '/' ? '/signin?next=' + encodeURIComponent(pathname) : '/signin';
		router.push(path);
	};

	return (
		<header className="tb:h-15 tb:px-6 pc:px-[360px] flex h-14 w-full items-center justify-between border-b-2 border-gray-900 bg-orange-600 px-4">
			<div className="tb:gap-4 flex items-center gap-3">
				<h1 className="flex items-center text-lg leading-none font-extrabold text-white">
					<Link href="/" className="align-middle">
						같이 달램
					</Link>
				</h1>
				<nav className="tb:text-base tb:gap-6 flex items-center gap-3 text-sm leading-none font-semibold">
					{NAVBAR_MENU_LINKS.map(({ href, label }) => (
						<Link
							key={href}
							href={href}
							className={cn(
								'align-middle transition-colors hover:text-gray-800',
								pathname === href ? 'text-gray-900' : 'text-orange-50'
							)}>
							{label}
						</Link>
					))}
				</nav>
			</div>

			{isAuthenticated ? (
				<DropdownMenu>
					<DropdownMenu.Trigger>
						<div className="relative size-[40px] overflow-hidden rounded-full">
							<Image
								priority
								src={user?.image || '/images/profile.svg'}
								alt="프로필 사진"
								fill
								className="object-cover"
							/>
						</div>
					</DropdownMenu.Trigger>
					<DropdownMenu.Items options={DROPDOWN_MENU_OPTIONS} onClick={handleDropdownMenuClick} />
				</DropdownMenu>
			) : (
				// TODO: 너무 마음에 안듭니다... 나중에 수정할게요...
				<div
					role="button"
					tabIndex={0}
					onClick={handleSigninClick}
					className="leading-sm tb:leading-base tb:text-base cursor-pointer text-sm font-semibold text-white">
					로그인
				</div>
			)}
		</header>
	);
}
