import * as cheerio from "cheerio";
import {superFetch} from "@/utils/superFetch";
import * as date from "@/utils/date"

export interface MeetDetails {
    data?:Data,
    documents?:Document[]
}
export interface Data {
    meetName:string,
    poolName:string,
    meetType:string,
    registerDeadline:string
}
export interface Document {
    name:string,
    url:string
}

//stevnenavn Bassengnavn, Stevnetype, Dokumenter, påmeldingsfrist, 

export async function scrapeMeetDetails(meetId:number):Promise<MeetDetails> {
    const webpage = await superFetch("https://www.medley.no/stevne.aspx?stevneid=" + meetId);
    const $ = cheerio.load(webpage);

    const meetTable = $("div[id='rpStevne_CRC']").find("div");
    const dataTable = $("div[id='rpStevneData_CRC']").find("div");
    const registerTable = $("div[id='rpPamelding_CRC']").find("div");
    const documentTable = $("div[id='rpDokumenter_CRC']").find("a");
    
    const data:Data = {
        meetName: $($(meetTable[1]).find("div")[1]).text().trim(),
        poolName: $($(meetTable[19]).find("div")[1]).text().trim(),
        meetType: $($(dataTable[10]).find("div")[1]).text().trim(),
        registerDeadline: date.toISOString($($(registerTable[1]).find("div")[1]).text().trim())
    }
    let documents:Document[] = [];
    
    documentTable.each((i, x) => {
        documents.push({
            name: $(x).text().trim(),
            url: $(x).attr("href")!
        });
    });
    
    return {
        data: data,
        documents: documents
    }
}