import Application from "./Application.js";

export class JHTComponent extends Application {

    constructor(parentNode, parentComponent, params) {
        console.log('start', 'constructor')
        super(parentNode, parentComponent, params)

        if (this.constructor == JHTComponent) {
            throw new Error("JHTComponent is abstract classes and can't be instantiated.")
        }

        console.log('end', 'constructor')
    }

    // wrappers for methods, so that users don't have to write in their code
    beforeCreate() {}
    afterCreate() {}
}