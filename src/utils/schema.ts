import { CREATE_GATHERING_ERRORS, SIGNIN_ERRORS } from '@/constants/error';
import type { GatheringLocation, GatheringType } from '@/types/response/gatherings';

import * as z from 'zod';

export const signinSchema = z.object({
	email: z.email({ error: SIGNIN_ERRORS.INVALID_EMAIL }),
	password: z.string().min(8, { error: SIGNIN_ERRORS.TOO_SHORT_PASSWORD })
});

// TODO: SignupValidator 정리 후 signupSchema 해당 파일로 이동

/** 모임 생성 스키마 */
export const CreateGatheringSchema = z
	.object({
		name: z
			.string()
			.nonempty({ error: CREATE_GATHERING_ERRORS.EMPTY.NAME })
			.min(2, { error: CREATE_GATHERING_ERRORS.LIMIT.MIN.NAME })
			.max(20, { error: CREATE_GATHERING_ERRORS.LIMIT.MAX.NAME })
			.regex(/^(?!\s)[ㄱ-ㅎ가-힣a-zA-Z0-9\s]{2,20}(?<!\s)$/, CREATE_GATHERING_ERRORS.FORMAT.NAME),

		location: z.custom<GatheringLocation>(val => typeof val === 'string' && val.length > 0, {
			error: CREATE_GATHERING_ERRORS.EMPTY.LOCATION
		}),

		type: z
			.custom<GatheringType>(val => typeof val === 'string' && val.length > 0, {
				error: CREATE_GATHERING_ERRORS.EMPTY.TYPE
			})
			.nullable(),

		dateTime: z.string().nonempty({ message: CREATE_GATHERING_ERRORS.EMPTY.DATE_TIME }),

		registrationEnd: z.string().nonempty({ message: CREATE_GATHERING_ERRORS.EMPTY.REGISTRATION_END }),

		capacity: z
			.number({ error: CREATE_GATHERING_ERRORS.EMPTY.CAPACITY })
			.min(5, { error: CREATE_GATHERING_ERRORS.LIMIT.MIN.CAPACITY })
			.max(20, { error: CREATE_GATHERING_ERRORS.LIMIT.MAX.CAPACITY }),

		image: z
			.instanceof(File, { error: CREATE_GATHERING_ERRORS.EMPTY.IMAGE })
			.refine(file => file.size > 0, { error: CREATE_GATHERING_ERRORS.EMPTY.IMAGE }),

		imageFileName: z.string().optional()
	})
	.superRefine((data, ctx) => {
		const now = new Date(); // 현재 시간
		const selectedDateTime = new Date(data.dateTime); // 사용자가 선택한 모임 날짜
		const registrationEndDate = new Date(data.registrationEnd); // 사용자가 선택한 마감 날짜

		if (selectedDateTime <= now) {
			ctx.addIssue({
				code: 'custom',
				message: CREATE_GATHERING_ERRORS.INVALID_VALUES.DATE_TIME,
				path: ['dateTime']
			});
		}

		if (registrationEndDate >= selectedDateTime) {
			ctx.addIssue({
				code: 'custom',
				message: CREATE_GATHERING_ERRORS.INVALID_VALUES.REGISTRATION_END,
				path: ['registrationEnd']
			});
		}
	});

export const profileEditSchema = z.object({
	companyName: z.string().min(2, { error: '회사명을 입력해주세요.' })
});

export type GatheringSchemaType = z.infer<typeof CreateGatheringSchema>;
export type ProfileEditSchemaType = z.infer<typeof profileEditSchema>;
