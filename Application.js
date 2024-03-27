export default class Application {
    parentNode = null
    parentComponent = null

    template = ``
    tpl_ = document.createDocumentFragment()
    shared = {}
    data = {}

    constructor(parentNode, parentComponent) {
        console.log('start', 'constructor')

        if (this.constructor == Application) {
            throw new Error("Application is abstract classes and can't be instantiated.")
        }

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
        console.log('end', 'createComponent')
    }
}