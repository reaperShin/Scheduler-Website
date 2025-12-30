export interface Schedule {
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
}

// Initial empty array or default data
// This file will be updated by the API route
export const schedules: Schedule[] = [
{
  "id": "1",
  "name": "Date with my Partner",
  "date": "2025-12-31",
  "startTime": "01:50",
  "endTime": "11:33"
}
,
{
  "id": "2",
  "name": "Another Date with my Partner",
  "date": "2026-01-01",
  "startTime": "06:35",
  "endTime": "17:34"
}
,
{
  "id": "3",
  "name": "Simba with my Partner",
  "date": "2026-01-04",
  "startTime": "19:30",
  "endTime": "21:00"
}
];