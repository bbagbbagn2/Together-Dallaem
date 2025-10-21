'use client';

import { useModal, useModalClose } from '@/hooks/useModal';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import Badge from '../Badge';
import Chip from '../Chip';
import ClassProgressBar from '../ClassProgressBar';
import ExampleModal from '../ExampleModal';
import SelectBox from '../SelectBox';
import SortButton from '../SortButton';
import Tab from '../Tab';
import BasicButton from './BasicButton';
import BasicCheckBox from './BasicCheckBox';
import BasicDropbox from './BasicDropbox';
import BasicInput from './BasicInput';
import BasicModal from './BasicModal';
import BasicTextArea from './BasicTextArea';
import BasicTextBox from './BasicTextBox';
import Tag from '../Tag';

// 제출 완료 모달 컴포넌트(컴포넌트 파일 따로 생성하기 귀찮으면 이렇게 파일 내에 작성해도 됩니다.)
function SubmitCompleteModal() {
	const closeModal = useModalClose();

	return (
		<BasicModal onClose={closeModal}>
			<div className="mb-8 text-center">제출 완료 </div>
			<BasicButton onClick={closeModal} isLarge>
				확인
			</BasicButton>
		</BasicModal>
	);
}

export default function Home() {
	const { handleSubmit, watch, register } = useForm();
	const { openModal } = useModal();
	const [isValid, setIsValid] = useState(true);
	const [activeTab, setActiveTab] = useState('option1');

	const selectedValue = watch('selectField');
	const textareaValue = watch('textareaField');
	const inputValue = watch('inputField') ?? '';
	const checkBoxValue = watch('checkBoxField');
	const sortedValue = watch('sortField');

	const validation = useCallback(() => {
		return inputValue.trim().length > 4;
	}, [inputValue]);

	const handleFormSubmit = useCallback(() => {
		if (!validation()) {
			setIsValid(false);
			return;
		}
		setIsValid(true);
		openModal(<SubmitCompleteModal />);
	}, [inputValue, validation, openModal]);

	return (
		<div className="relative flex h-screen w-screen flex-col items-start justify-start gap-6">
			<form className="w-full" onSubmit={handleSubmit(handleFormSubmit)}>
				<SelectBox
					options={[
						{ value: 'option1', text: '옵션 1' },
						{ value: 'option2', text: '옵션 2' }
					]}
					register={register('selectField')}
					placeholder="선택"
				/>
				<SelectBox
					options={[
						{ value: 'option1', text: '전체' },
						{ value: 'option2', text: '을지로 3가' }
					]}
					register={register('selectField')}
					expanded
					placeholder="지역 선택"
				/>
				<BasicInput
					register={register('inputField')}
					placeholder="할 일의 제목을 적어주세요."
					required
					isValid={isValid}
					invalidText="5자 이상 입력해주세요"
					value={inputValue}
					id="할일"
					label="할 일"
					type="number"
				/>
				<BasicTextBox>{selectedValue}</BasicTextBox>
				<BasicTextArea register={register('textareaField')}></BasicTextArea>
				<BasicButton isActive={inputValue.length > 0} outlined>
					생성하기
				</BasicButton>
				<BasicButton
					onClick={() => {
						openModal(<ExampleModal />);
					}}
					type="button">
					모달 창 열기
				</BasicButton>
				<ClassProgressBar isConfirmed data={{ totalNumber: 20, currentNumber: 11 }} linkTo="/me" />
				<BasicCheckBox register={register('checkBoxField')} title="달램핏" content="오피스 스트레칭" isLarge={false} />
			</form>
			<SortButton
				options={[
					{ value: 'option1', text: '최신순' },
					{ value: 'option2', text: '리뷰 많은 순' },
					{ value: 'option3', text: '참여 인원 순' }
				]}
				register={register('sortField')}
				defaultValue="option1"
			/>
			선택한 필터 값:{sortedValue}
			<BasicButton
				onClick={() => {
					openModal(<ExampleModal />);
				}}>
				모달 창 열기
			</BasicButton>
			<Tag text="달램핏" />
			<Tab
				options={[
					{ value: 'option1', text: '달램핏', icon: '/icons/dalaemfit.svg' },
					{ value: 'option2', text: '워케이션', icon: '/icons/workation.svg' }
				]}
				selectedTab={activeTab}
				onTabChange={(tabId: string) => {
					setActiveTab(tabId);
				}}
			/>
			{activeTab === 'option1' && (
				<div>
					<Chip text="전체" isActive={true} />
					<Badge num={1999} />
				</div>
			)}
			<div>{activeTab}</div>
			<div className="relative">
				<BasicDropbox
					options={[
						{
							value: 'reviews',
							text: '리뷰'
						},
						{
							value: 'me',
							text: '마이페이지'
						},
						{
							value: 'signin',
							text: '로그인'
						}
					]}
					callbackOnclick={value => {
						if (value === 'reviews') {
							window.location.href = '/reviews';
						} else if (value === 'me') {
							window.location.href = '/me';
						} else if (value === 'signin') {
							window.location.href = '/signin';
						}
					}}
					selectedValue={selectedValue}
					className="top-full right-0"
				/>
			</div>
		</div>
	);
}
