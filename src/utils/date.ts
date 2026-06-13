
export const ndate = "0000-00-00000:00:00.000Z";

export function toISOString(dateString:string):string {
    if (dateString === ndate){
        return ndate;
    }
    try {
        const a = dateString.split(".");
        const d = new Date(a[2]+"-"+a[1]+"-"+a[0])
        return d.toISOString();
    } catch {
        return ndate;
    }
}


export function fromISOString(ISOString:string):string{
    if (ISOString === ndate){
        return ndate;
    }
    try {
        const s = new Date(ISOString);
        return s.toLocaleDateString()
    } catch {
        return ndate;
    }
}