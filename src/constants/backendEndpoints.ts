
const baseUrl:string = process.env.EXPO_PUBLIC_API_URL ?? "";

export const apiMeetList = baseUrl + "meetList";
export const apiMeetDetails = baseUrl + "meetdetails";
export const apiSchedule = baseUrl + "schedule";
export const apiFinals = baseUrl + "finals";
export const apiClubs = baseUrl + "clubs";
export const apiSwimmers = baseUrl + "swimmers";
export const apiResults = baseUrl + "results";
export const apiStartlists = baseUrl + "startlists";
export const apiHeatlists = baseUrl + "heatlists";
export const apiClubLogos = baseUrl + "clubLogos";