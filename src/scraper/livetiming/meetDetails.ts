import * as cheerio from "cheerio";
import {superFetch} from "@/utils/superFetch";
import * as date from "@/utils/date"

export interface MeetDetails {
    data?:Data,
    lists?:Lists,
    documents?:Document[]
}
export interface Data {
    location:string,
    hostClub:string,
    from:string,
    to:string,
    numberOfLanes:string,
    poolLength:string
}
export interface Lists {
    hasStartlist:boolean,
    hasHeatlist:boolean,
    hasResults:boolean,
    hasFinals:boolean,
    hasSchedule:boolean
}
export interface Document {
    name:string,
    url:string
}

export async function scrapeMeetDetails(meetId:number):Promise<MeetDetails> {
    const webpage = await superFetch("https://livetiming.medley.no/stevnedetaljer.aspx?stevnenr=" + meetId);
    const $ = cheerio.load(webpage);
    
    const title = $("title").text().trim()
    if (title === "Stevner" || title === "Runtime Error") {
        return {};
    }
    
    const table = $("tr[class='even']").first();
    
    const td = table.find("td");
    
    const dataElement = $("div[id='MainContent_panStevnedata']").contents().filter((i, x) => x.type === "text");
    const listsElement = $(td[1]).find("li").text();
    const documentsElement = $(td[2]).find("a");
    const teamsElement = $(td[2]).find("a");    
    
    const data:Data = {
        location: $(dataElement[1]).text().trim(),
        hostClub: $(dataElement[2]).text().trim(),
        from: date.toISOString($(dataElement[3]).text().trim()),
        to: date.toISOString($(dataElement[4]).text().trim()),
        numberOfLanes: $(dataElement[5]).text().trim(),
        poolLength: $(dataElement[6]).text().trim()
    };
    
    const lists = {
        hasStartlist: listsElement.includes("Startlister"),
        hasHeatlist: listsElement.includes("Heatlister"),
        hasResults: listsElement.includes("Resultater"),
        hasFinals: listsElement.includes("Finalelister"),
        hasSchedule: listsElement.includes("Tidsskjema")
    }
    
    let documents:Document[] = [];
    
    documentsElement.each((i, x) => {
        const a = $(x);
       documents.push({
          name: $(x).text().trim(),
          url: $(x).attr("href")! 
       });
    });
    teamsElement.each((i, x) => {
        documents.push({
            name: $(x).text().trim(),
            url: $(x).attr("href")!
        });
    });
    
    return {
        data: data,
        lists: lists,
        documents: documents
    }
}