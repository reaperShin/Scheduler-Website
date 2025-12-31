export interface Schedule {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  color?: string;
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
,
{
  "id": "1",
  "color": "#A52A2A",
  "name": "Agenda 1",
  "date": "2026-01-01",
  "startTime": "14:50",
  "endTime": "08:51"
}
,
{
  "id": "2",
  "color": "#0000FF",
  "name": "Agenda 2",
  "date": "2026-01-09",
  "startTime": "07:45",
  "endTime": "17:45"
}
,
{
  "id": "3",
  "name": "Agenda 3",
  "date": "2026-01-07",
  "startTime": "14:51",
  "endTime": "20:46"
}
,
{
  "id": "4",
  "name": "Agenda 4",
  "date": "2025-12-01",
  "startTime": "20:46",
  "endTime": "02:47"
}
];