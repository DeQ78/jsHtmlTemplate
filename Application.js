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

        // ${msg}                       - static text from variable
        // ${:cntSw1}                   - dynamic text from variable
        // {@keydown="toggleSw1"}>      - event => function
        // {@keydown="toggleSw2(2)"}    - event => function with arguments
        // <:baner cntSw1="{:cntSw1}" cntSw2="{:cntSw2}" msg="${msg}" />  - component with attributes

        const regexp = new RegExp('((?=\\${|{@).+?(?=})})|((?=<:[^\\s]+)<:([^\\s]+)(.+?)(?=\\/>)\\/>)', 'mg');

        let match;

        while ((match = regexp.exec(this.template)) !== null) {
            console.log(
                `Found ${match[0]} start=${match.index} end=${regexp.lastIndex}`
            )
        }

        console.log('end', 'createComponent')
    }
}