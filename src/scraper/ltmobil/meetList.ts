import * as cheerio from "cheerio";
import {superFetch} from "@/utils/superFetch";
import {meetListPostData} from "@/utils/formData/meetList";
import * as date from "@/utils/date"

export interface Meet {
    meetID:number,
    meetName:string,
    dateFrom:string,
    dateTo:string,
    location:string
}

export async function scrapeMeetList(year:number):Promise<Meet[]>{

    const webpage = await superFetch("https://ltmobil.medley.no/");
    // const webpage = await superFetch("https://ltmobil.medley.no/",
    //     {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //         },
    //         body: meetListPostData(year),
    //     }
    // );

    let meetList:Meet[] = [];

    const $ = cheerio.load(webpage);
    const ul = $("ul");
    const listItems = ul.find("li")


    for (let i = 0; i < listItems.length; i++) {

        const li = $(listItems[i]);

        const a = li.find("a");
        const meetName = a.contents()[0].data!;

        const href = a.attr("href");
        let meetId:number = 0;
        if(href){
            meetId = parseInt(href.split("=")[1]);
        }

        const small = li.find("small small").text().trim(); // 01.12.2025 (- 02.12.2025)? Any Location
        const regex = new RegExp(/^(\S+) (?:\s*-\s*(\S+))? ([\s\S]+)$/)
        const match = regex.exec(small);

        let dateFrom:string = "";
        let dateTo:string = "";
        let location:string = "";

        if (match){
            dateFrom = match[1].trim();
            dateTo = match[2] ? match[2].trim() : "0.0.0";
            location = match[3].trim();
        }


        const meet:Meet = {
            meetID: meetId,
            meetName: meetName,
            dateFrom: date.toISOString(dateFrom),
            dateTo: date.toISOString(dateTo),
            location: location,
        }
        meetList.push(meet);
    }

    return meetList;
}