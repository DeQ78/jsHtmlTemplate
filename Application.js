"use strict";

export default class Application {
    this_ = null;

    conf_ = {
        "componentName": '',
        "componentId": 0,
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
        // console.log('start', 'constructor')
        if (this.constructor == Application) {
            throw new Error("Application is abstract classes and can't be instantiated.")
        }

        if (conf.hasOwnProperty('componentId')) {
            this.conf_.componentId = conf.componentId;
        } else if (conf.parentComponent == null) {
            this.conf_.componentId = 1000000000;
        }

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
        this.beforeCreate();
        this.parseTemplate();
        this.afterCreate();
    }

    parseTemplate() {
        // console.log('start', 'parseTemplate');
        // console.log(this.template);

        const regexpHtmlNode = new RegExp('(<(\\/?)(:?)([^\\/>]+)(\\/?>))', 'gm');
        let match;

        const regExpSepAttr = new RegExp('([^\\s]+)\\s?(.*)', 'gm');
        let matchTag;

        let prevEnd = -1;
        let parentEl = null;
        let parentEls = [];
        // variables for DOM
        let currentNode = this.virDom_;
        let node;
        let nodeHtmlClassId = this.conf_.componentId + 1;
        let nodeComponentClassId = this.conf_.componentId + 1000;

        // variables for read from template string
        let elTagName;
        let elTagAttr;

        while ((match = regexpHtmlNode.exec(this.template)) !== null) {
            console.log('-----------------------------------------');
            // console.log(`prevEnd = ${prevEnd}`);
            console.log(`Found ${match[0]} start=${match.index} end=${regexpHtmlNode.lastIndex}`);
            // console.log(match);

            if (prevEnd > -1 && prevEnd < match.index) {
                // text inside html node before|after {notation}
                node = document.createTextNode(this.template.substring(prevEnd, match.index));
                currentNode.appendChild(node);
            }

            prevEnd = regexpHtmlNode.lastIndex;

            // console.log('found tag content = ', match[4]);
            if (!match[4].includes(' ')) {
                elTagName = match[4];
                elTagAttr = '';
            } else {
                regExpSepAttr.lastIndex = 0;
                matchTag = regExpSepAttr.exec(match[4]);
                // console.log('matchTag = ', matchTag);

                elTagName = matchTag[1];
                elTagAttr = matchTag[2];
            }
            // console.log('elTagName = ', elTagName);
            // console.log('elTagAttr =', elTagAttr);

            if (match[5] == '\/>' && match[3] == ':') {         // component
                node = document.createElement('div');
                nodeComponentClassId += 1000;
                // elTagName = `classId="id${nodeComponentClassId}"`;
                // this.nodeSetAttributes_(node, htmlAttr)
                // node.className = 'component_' + elTagName;
                currentNode.appendChild(node);
            } else if (match[5] == '/>') {                      // selfclose tag
                node = document.createElement(elTagName);
                currentNode.appendChild(node);
            } else if (match[5] == '>' && match[2] == '/') {    // close tag
                currentNode = parentEls.pop();
                parentEl = null;
            } else if (match[5] == '>' && match[2] == '') {     // open tag
                parentEl = currentNode;
                parentEls.push(currentNode);
                currentNode = document.createElement(elTagName);
                this.nodeSetAttributes_(currentNode, elTagAttr, nodeHtmlClassId);
                nodeHtmlClassId += 1;
                parentEl.appendChild(currentNode);
            } else {
                console.log(match);
            }
        }

        console.log('-----------------------------------------');

        this.conf_.htmlElement.replaceWith(this.virDom_);

        // console.log('end', 'parseTemplate')
    }

    nodeSetAttributes_(node, attrStr, classId) {
        const regExpSplitAttr = new RegExp('((?:{@[^}]+}))|([a-zA-Z0-9]+)\\s?=\\s?("|\')([^"\']+)("|\')', 'gm');

        // console.log('node', node);
        // console.log('attrStr = ', attrStr);
        // console.log('classId = ', classId);
        let match;
        let nAttr;
        while ((match = regExpSplitAttr.exec(attrStr)) !== null) {
            if (match[2] != null && match[4] != null) {
                nAttr = document.createAttribute(match[2].toLowerCase().trim());
                nAttr.value = ((match[2].toLowerCase().trim() == 'class') ? 'id' + classId + ' ' : '') + match[4];
                node.setAttributeNode(nAttr);
            }
        }
    }
}
