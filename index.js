export class jsHtmlTemplate {
    constructor() {}

    modiffy(str, char, replacer) {
        const regex = new RegExp(char, "g")
        const replaced = str.replace(regex, replacer)
        return replaced
    }
}
