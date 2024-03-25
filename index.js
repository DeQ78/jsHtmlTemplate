export class jsHtmlTemplate {
    constructor() {
        if (this.constructor == jsHtmlTemplate) {
            throw new Error("jsHtmlTemplate is Abstract classes and can't be instantiated.");
        }
    }

    modiffy(str, char, replacer) {
        const regex = new RegExp(char, "g")
        const replaced = str.replace(regex, replacer)
        return replaced
    }
}
