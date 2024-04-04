export default class Application {
    parentNode = null
    parentComponent = null
    config = {
        "componentName": ''
    }

    template = ''
    // nodeIdentity = 1;
    // template_str = ''
    // tpl_ = document.createDocumentFragment()
    // shared = {}
    data = {}

    constructor(parentNode, parentComponent) {
        console.log('start', 'constructor')
        if (this.constructor == Application) {
            throw new Error("Application is abstract classes and can't be instantiated.")
        }
        this.config.componentName = this.constructor.name

        this.htmlNode = parentNode
        this.parentComponent = parentComponent

        console.log('end', 'constructor')
    }

    run() {
        console.log('start', 'run');
        this.beforeCreate();
        this.createComponent();
        this.afterCreate();
        console.log('end', 'run');
    }

    createComponent() {
        console.log('start', 'createComponent')
        console.log('this.template', this.template);

        // (?=(<:))([^\s]+)(.+)(?=\/>)\/>
        // (?={(\$)((:)?))([^}]+)(?=})}
        // (?=({))({)((.+)\((.*)\))(?=})}
        // (?={(@))([^=]+)="([^"]+)"(?=})}

        const regexpTpl = [
            '(?=(<:))([^\\s]+)(.+)(?=\\/>)\\/>', // component
            '(?={(\\$)((:)?))([^}]+)(?=})}', // variable (static or observed value)
            '(?=({))({)((.+)\\((.*)\\))(?=})}', // call component method
            '(?={(@))([^=]+)="([^"]+)"(?=})}' // event of html element
        ]

        const regexp = new RegExp(regexpTpl.join('|'), 'g');

        let match;

        while ((match = regexp.exec(this.template)) !== null) {
            console.log(
                `Found ${match[0]} start=${match.index} end=${regexp.lastIndex}`
            )
        }

        console.log('end', 'createComponent')
    }
}
