"use strict";
export default class Application {
    this_ = null;

    conf_ = {
        "componentName": '',
        "componentId": 1000000000,
        "htmlElement": null,
        "parentComponent": null,
        "attributes": null
    }

    template = '';
    virDom_ = document.createDocumentFragment();
    cloneVirDom_ = null;

    data = {};
    components = {};

    constructor(conf = {"htmlElement": null, "parentComponent": null}) {
        console.log('start', 'constructor xxxx')
        if (this.constructor == Application) {
            throw new Error("Application is abstract classes and can't be instantiated.")
        }

        // this.conf_.componentId =
        this.conf_.componentName = this.constructor.name

        if (conf.hasOwnProperty('htmlElement')) {
            this.conf_.htmlElement = document.getElementById(conf.htmlElement.slice(1));
            if (this.conf_.htmlElement == null) {
                throw new Error(`Can't find in html element ${conf.htmlElement}`)
            }
        }
        this.conf_.parentComponent = conf.hasOwnProperty('parentComponent') ? conf.parentComponent : null;
        this.conf_.attributes = conf.hasOwnProperty('attributes') ? conf.attributes : null;

        // console.log('end', 'constructor')
    }

    initiate() {
        // console.log('start', 'initiate');
        this.beforeCreate();
        this.parseTemplate();
        this.afterCreate();
        // console.log('end', 'initiate');
    }

    parseTemplate() {
        // console.log('start', 'parseTemplate');
        // console.log(this.template);

        const regexpHtmlNode = new RegExp('(<(\\/?)(:?)([^\\/>]+)(\\/?>))', 'gm');
        let match;
        let prevEnd = -1;

        let parentEl = null;
        let parentEls = [];
        let curentEl = this.virDom_;
        let nEl;
        let nElHtmlClassId = this.conf_.componentId;
        let nElComponentClassId = this.conf_.componentId;

        while ((match = regexpHtmlNode.exec(this.template)) !== null) {
            console.log('-----------------------------------------');
            // console.log(`prevEnd = ${prevEnd}`);
            console.log(`Found ${match[0]} start=${match.index} end=${regexpHtmlNode.lastIndex}`);
            console.log(match[4]);

            if (prevEnd > -1 && prevEnd < match.index) {
                // console.log('text before find', this.template.substring(prevEnd, match.index));
                nEl = document.createTextNode(this.template.substring(prevEnd, match.index));
                curentEl.appendChild(nEl);
            }

            prevEnd = regexpHtmlNode.lastIndex;

            let htmlAttr = match[4].split(' ');

            if (match[5] == '\/>' && match[3] == ':') {
                // console.log('component', '\t', htmlAttr[0])
                nEl = document.createElement('div');
                nElComponentClassId += 1000;
                htmlAttr[0] = `classId="id${nElComponentClassId}"`;
                this.nodeAddAttributes_(nEl, htmlAttr)
                nEl.className = 'component_' + htmlAttr[0];
                curentEl.appendChild(nEl);
            } else if (match[5] == '/>') {
                // console.log('selfclose tag', '\t', htmlAttr[0]);
                nEl = document.createElement(htmlAttr[0]);
                curentEl.appendChild(nEl);
            } else if (match[5] == '>' && match[2] == '/') {
                // console.log('close tag', '\t', htmlAttr[0]);
                curentEl = parentEls.pop();
                parentEl = null;
            } else if (match[5] == '>' && match[2] == '') {
                // console.log('open tag', '\t', htmlAttr[0]);
                parentEl = curentEl;
                parentEls.push(curentEl);
                curentEl = document.createElement(htmlAttr[0]);
                nElHtmlClassId += 1;
                htmlAttr[0] = `classId="id${nElHtmlClassId}"`;
                this.nodeAddAttributes_(curentEl, htmlAttr);
                parentEl.appendChild(curentEl);
            } else {
                console.log(match);
            }
        }

        console.log('-----------------------------------------');

        this.conf_.htmlElement.replaceWith(this.virDom_);

        // console.log('end', 'parseTemplate')
    }

    nodeAddAttributes_(node, attrStr) {
        console.log(node);
        console.log(attrStr);
    }

    getComponentClassId() {
        return 'id' + this.conf_.componentId;
    }
}
