
export function meetListPostData(year:number){

    const viewState:string = "/wEPDwUKMTE0OTE0NDU4MA9kFgICAw9kFgICAQ8QZA8WEWYCAQICAgMCBAIFAgYCBwIIAgkCCgILAgwCDQIOAg8CEBYREAUEMjAyNgUEMjAyNmcQBQQyMDI1BQQyMDI1ZxAFBDIwMjQFBDIwMjRnEAUEMjAyMwUEMjAyM2cQBQQyMDIyBQQyMDIyZxAFBDIwMjEFBDIwMjFnEAUEMjAyMAUEMjAyMGcQBQQyMDE5BQQyMDE5ZxAFBDIwMTgFBDIwMThnEAUEMjAxNwUEMjAxN2cQBQQyMDE2BQQyMDE2ZxAFBDIwMTUFBDIwMTVnEAUEMjAxNAUEMjAxNGcQBQQyMDEzBQQyMDEzZxAFBDIwMTIFBDIwMTJnEAUEMjAxMQUEMjAxMWcQBQQyMDEwBQQyMDEwZxYBAgJkZGjnti/Xo9tg0D50KTJSCGF03bn6OG/K9l5SejGjf/d3";
    const viewStateGenerator:string = "CA0B0334";
    const eventValidation:string = "/wEdABO3MkBef0bG9G3lTUPtDZWBNnKv/szt3IhFf9Nw12Vq/1ZQC3q000dcNQLsOmVv4Y295Dn+6jthkPUgM+qYYHc6h7/33SrB5OrRTOk4qLRZBOgvjOG8w2NYTWEyK9DZgeEj4x0dryKIR7unwZ9cwum0+lX7xxx1wf/+r1xkGAK5jnbhocIVkk6Fqf8GfyVb3l+oxC/+6UxF6ONXendnRZJQkNnOUkIB5vHt/bjmnoTm4N/5kdY9PGWPiem5fp3YeAP94d6GYA0HXRNOXdinlMdFn09nnCUy72Lc0pHB7x9Ft3eeZUPlgHnzLRGEXW84tI9lDJSCAneHwDfMO7FPYeL0R4caE2rhjwdlxI1mU2YzIE+F+mYouBWqhCDUHCrFfiDbPHmATFURAkX/igddK+sZyorM+L9by/LPrYDlozvf6BcaPSs2mqK9sRceJSOfPyM=";

    const formData = new URLSearchParams();
    formData.append("__EVENTTARGET", "ddlAar");
    formData.append("__EVENTARGUMENT", "");
    formData.append("__LASTFOCUS", "");
    formData.append("__VIEWSTATE", viewState.toString());
    formData.append("__VIEWSTATEGENERATOR", viewStateGenerator.toString());
    formData.append("__EVENTVALIDATION", eventValidation.toString());
    formData.append("ddlAar", year.toString());
    return formData.toString();
}