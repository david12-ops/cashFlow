// 'use client';

// import React, { useCallback, useState, useMemo } from 'react';
// import { Card, CardBody, Flex, Text, Stack, Box, Separator } from '@chakra-ui/react';
// import { useTranslations } from 'next-intl';
// import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
// import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
// import { TZDate } from '@date-fns/tz';
// import Holidays from 'date-holidays';
// import { useGetMonthlySpends } from '@shared/client-api';
// import {
// 	dateToFormatFullNum,
// 	dateToFormatShort,
// 	formatNumberToCurrency,
// 	toThousandsWithKOrMillionWithMil,
// 	getShortCzechDayName,
// } from '@/utils/number';
// import RangeDatePicker from '@/components/dashboard/RangeDatePicker/RangeDatePicker';

// type CustomTickProps = {
// 	x?: number;
// 	y?: number;
// 	payload?: {
// 		value: string;
// 	};
// };

// const CustomTick = React.memo((props: CustomTickProps) => {
// 	const { x = 0, y = 0, payload } = props;
// 	const holidays = useMemo(() => new Holidays('CZ'), []);
// 	const isSpecialDay = (dateStr: string) => {
// 		if (!dateStr) return false;
// 		// vikendy
// 		const isWeekend = ['So', 'Ne'].includes(getShortCzechDayName(dateStr));
// 		const isHoliday = holidays.isHoliday(new Date(dateStr));
// 		return isWeekend || isHoliday;
// 	};

// 	const textColor =
// 		payload?.value && isSpecialDay(payload.value)
// 			? 'var(--chakra-colors-fg-red-text)'
// 			: 'var(--chakra-colors-fg-medium-contrast)';

// 	return (
// 		<g transform={`translate(${x},${y})`}>
// 			<text x={0} y={-4} dy={0} textAnchor="middle" fill={textColor} style={{ fontSize: '12px' }}>
// 				{payload?.value ? dateToFormatShort(payload.value) : ''}
// 			</text>
// 			<text x={0} y={14} textAnchor="middle" fill={textColor} style={{ fontSize: '12px' }}>
// 				{payload?.value ? getShortCzechDayName(payload.value) : ''}
// 			</text>
// 		</g>
// 	);
// });

// CustomTick.displayName = 'CustomTick';

// const renderCustomTick = (props: any) => <CustomTick {...props} />;

// interface LegendItem {
// 	color: string;
// 	label: string;
// }

// const LEGEND_ITEMS: LegendItem[] = [
// 	{
// 		color: 'green.solid',
// 		label: 'employees',
// 	},
// ];

// function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>) {
// 	const t = useTranslations('Dashboard');

// 	const sortPayload = payload?.sort((a, b) => (a.value as number) - (b.value as number));
// 	if (active) {
// 		return (
// 			<Flex
// 				flexDirection="column"
// 				gap={1}
// 				background="bg.card"
// 				px={4}
// 				py={3}
// 				borderRadius="lg"
// 				shadow="md"
// 				textAlign="center"
// 			>
// 				<Text textStyle="xs">
// 					{label && (
// 						<>
// 							{getShortCzechDayName(label)} {dateToFormatFullNum(label)}
// 						</>
// 					)}
// 				</Text>
// 				{sortPayload?.map((item) => (
// 					<Text
// 						key={item.name}
// 						color="fg.normalContrast"
// 						fontWeight="bold"
// 						fontVariantNumeric="tabular-nums"
// 						textStyle="sm"
// 					>
// 						{formatNumberToCurrency(item.value as number, t('cards.monthlySpends.currency'))}
// 					</Text>
// 				))}
// 			</Flex>
// 		);
// 	}

// 	return null;
// }

// export default function MonthlySpendsChart({ ownerId }: { ownerId: string }) {
// 	const today = new Date();
// 	const getStartDate = new TZDate(today.getFullYear(), today.getMonth(), 1, 'UTC');
// 	const getEndDate = new TZDate(today.getFullYear(), today.getMonth() + 1, 0, 'UTC');
// 	const t = useTranslations('Dashboard');

// 	const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date }>({
// 		start: getStartDate,
// 		end: getEndDate,
// 	});

// 	const handleResetToCurrentMonth = useCallback(() => {
// 		setSelectedDates({
// 			start: getStartDate,
// 			end: getEndDate,
// 		});
// 	}, []);

// 	const { data: dailyEarningsWithTotal } = useGetMonthlySpends(ownerId, {
// 		startDate: selectedDates.start,
// 		endDate: selectedDates.end,
// 	});

// 	return (
// 		<Card.Root width="100%" height="100%" display="flex" flexDirection="column">
// 			<CardBody px={0} py={0} flex="1" minHeight={0} minWidth={0} display="flex" flexDirection="column">
// 				<Stack px={5} py={4} flex="0 0 auto" width="100%" minWidth={0}>
// 					<Flex
// 						flexDirection={{ base: 'column', xl: 'row' }}
// 						columnGap="5"
// 						rowGap="4"
// 						justifyContent="space-between"
// 						alignItems={{ base: 'left', xl: 'center' }}
// 						width="100%"
// 						minWidth={0}
// 					>
// 						<Text textStyle="xl" color="fg.normalContrast">
// 							{t('cards.monthlySpends.title')}
// 						</Text>

// 						<Flex
// 							flexDirection={{ base: 'column', md: 'row' }}
// 							justifyContent={{ base: 'space-between', xl: 'none' }}
// 							alignItems={{ base: 'left', md: 'center' }}
// 							columnGap={12}
// 							rowGap="3"
// 						>
// 							<Flex
// 								direction={{ base: 'column', sm: 'row' }}
// 								alignItems={{ base: 'left', sm: 'center' }}
// 								columnGap={6}
// 								rowGap={2}
// 								mr={4}
// 							>
// 								{LEGEND_ITEMS.length > 1 &&
// 									LEGEND_ITEMS.map((item) => (
// 										<Flex key={item.label} alignItems="center" gap={2}>
// 											<Box w={3} h={1} bg={item.color} borderRadius="full" />
// 											<Text textTransform="lowercase">
// 												{t(`cards.monthlySpendsHours.${item.label}`)}
// 											</Text>
// 										</Flex>
// 									))}
// 							</Flex>
// 						</Flex>
// 						<Flex justify="space-between" align="center">
// 							<Box mr={4}>
// 								{dailyEarningsWithTotal && (
// 									<Text textStyle="xl" color="fg.normalContrast" fontVariantNumeric="tabular-nums">
// 										{formatNumberToCurrency(
// 											dailyEarningsWithTotal?.totalEarnings,
// 											t('cards.monthlySpends.currency'),
// 										)}
// 									</Text>
// 								)}
// 							</Box>
// 							<Flex
// 								alignItems="center"
// 								flexDirection={{ base: 'column', lg: 'row' }}
// 								flexWrap={{ base: 'wrap', lg: 'nowrap' }}
// 								rowGap={3}
// 							>
// 								<RangeDatePicker
// 									onChange={setSelectedDates}
// 									handleReset={handleResetToCurrentMonth}
// 									selectedDates={selectedDates}
// 								/>
// 							</Flex>
// 						</Flex>
// 					</Flex>
// 				</Stack>
// 				<Separator />
// 				<Stack px={5} py={6} flex="1" minHeight={0} minWidth={0} position="relative" width="100%">
// 					<style>
// 						{`
//       .recharts-wrapper .recharts-cartesian-grid-horizontal line:nth-last-child(2),
//       .recharts-wrapper .recharts-cartesian-grid-horizontal line:last-child,
//       .recharts-wrapper .recharts-cartesian-grid-vertical line:nth-last-child(2),
//       .recharts-wrapper .recharts-cartesian-grid-vertical line:last-child {
//         stroke-opacity: 0;
//       }
//     `}
// 					</style>
// 					<ResponsiveContainer width="100%" height="100%">
// 						<LineChart
// 							data={dailyEarningsWithTotal?.dailyEarnings}
// 							margin={{ top: 5, right: 16, left: 16, bottom: 5 }}
// 						>
// 							<CartesianGrid stroke="var(--chakra-colors-border)" />
// 							<XAxis
// 								dataKey="name"
// 								tick={renderCustomTick}
// 								axisLine={false}
// 								tickLine={false}
// 								tickMargin={16}
// 								height={32}
// 								minTickGap={16}
// 								interval="preserveStartEnd"
// 								padding={{
// 									left: 23.5,
// 									right: 37,
// 								}}
// 							/>
// 							<YAxis
// 								tickFormatter={toThousandsWithKOrMillionWithMil}
// 								tick={{ fill: 'var(--chakra-colors-fg-medium-contrast)' }}
// 								axisLine={false}
// 								tickLine={false}
// 								tickMargin={16}
// 								padding={{
// 									top: 10,
// 									bottom: 18,
// 								}}
// 								style={{ fontSize: '12px' }}
// 							/>
// 							<Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--chakra-colors-border)' }} />

// 							<Line
// 								type="linear"
// 								name={t('cards.monthlySpends.employees')}
// 								dataKey="sum"
// 								stroke="var(--chakra-colors-green-solid)"
// 								activeDot={{ r: 8, stroke: 'var(--chakra-colors-bg-panel)', strokeWidth: 4 }}
// 								strokeWidth={2}
// 								fill="var(--chakra-colors-bg-panel)"
// 								dot={false}
// 							/>
// 						</LineChart>
// 					</ResponsiveContainer>
// 				</Stack>
// 			</CardBody>
// 		</Card.Root>
// 	);
// }

export function ChartComp({ text }: { text: string }) {
  return <div>{text}</div>;
}
