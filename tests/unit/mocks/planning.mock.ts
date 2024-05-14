import type { Tables } from "@/types";

export const trips: Tables<'trips'>[] = [
  {
    "id":2,
    "name":"My first trip!",
    "slug":"9ad03979-990f-4551-af13-e8e825f43f54",
    "created_at":"2024-03-02T23:43:33.212812+00:00",
    "profile_id":"61b66be5-d199-48d5-898a-c521dd6b59cc",
    "updated_at":"2024-03-02T23:43:33.212812+00:00",
    "description":"This is my first trip to plan.",
    "ending_date":null,
    "ending_point":"Ending point",
    "starting_date":null,
    "starting_point":"Starting point",
  },
  {
    "id":3,
    "name":"Appalachian Trail",
    "slug":"affccee2-bbfe-49ce-acb7-2ae563d513f3",
    "created_at":"2024-04-11T20:34:30.637297+00:00",
    "profile_id":"61b66be5-d199-48d5-898a-c521dd6b59cc",
    "updated_at":"2024-04-11T20:34:30.637297+00:00",
    "description":"2200 miles long",
    "ending_date":"2024-09-05T20:34:00+00:00",
    "ending_point":"Mount Katahdin",
    "starting_date":"2024-04-01T20:34:00+00:00",
    "starting_point":"Springer Mountain",
  },
];