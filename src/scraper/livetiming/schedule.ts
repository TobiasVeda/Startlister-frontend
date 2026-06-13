import * as cheerio from "cheerio";
import {superFetch} from "@/utils/superFetch";
import {schedulePostData} from "@/utils/formData/schedule";

// export interface Schedule{
//     disciplines:Discipline[];
// }
export interface Discipline {
    name:string,
    date:string,
    time:string
    heats:Heat[]
}
export interface Heat {
    number:number,
    time:string
}

export async function scrapeSchedule(meetId:number):Promise<Discipline[]> {
    const webpage = await superFetch("https://livetiming.medley.no/tidsskjema.aspx?stevnenr=" + meetId,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: schedulePostData,
        }
    );
    
    const $ = cheerio.load(webpage);
    const table = $("table[id='ctl00_MainContent_grdResGrid_DXMainTable']");

    let schedule:Discipline[] = [];
    let currentDate:string;
    let currentDisciplineStartTime:string;

    table.find("tr").each((i, x)=>{
        const cells = $(x).find("td");
        const cell0 = $(cells[0]).text().trim();
        const cell1 = $(cells[1]).text().trim();
        const cell2 = $(cells[2]).text().trim();
        
        if (i === 0) {
            return; // continue;
        }
        if (cell1 === "" && cell2 === "") {
            currentDate = cell0;
            return; // continue;
        }
        if (cell1 === "1") {
            currentDisciplineStartTime = cell2;
            schedule.push({
                name: cell0,
                date: currentDate,
                time: currentDisciplineStartTime,
                heats: [],
            });
        }
        
        schedule.at(-1)!.heats.push({
            number: parseInt(cell1),
            time: cell2
        });
        
    });
    return schedule;
}