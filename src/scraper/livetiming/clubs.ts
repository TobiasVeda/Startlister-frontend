import * as cheerio from "cheerio";
import {superFetch} from "@/utils/superFetch";

export async function scrapeClubs(meetId:number) {
    const webpage = await superFetch("https://livetiming.medley.no/eksport.aspx?stevnenr=" + meetId);
    const $ = cheerio.load(webpage);
    
    const options = $("select[id='MainContent_ddlKlubb']").find("option");
    let clubs:string[] = [];
    
    options.each((i, x) => {
        const option = $(x);
        if (option.attr("value") === "0") {
            return; // continue;
        }
        clubs.push(option.text().trim());
    });
    console.log(clubs);
    return clubs;
}