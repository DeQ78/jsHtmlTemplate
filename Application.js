export default class Application {
    componentId = 0;

    parentHtmlEl = null;
    parentComponent = null;

    config = {
        "componentName": ''
    };

    template = '';
    _virTpl = document.createDocumentFragment();

    data = {};
    components = {};
    attributes = {};

    constructor(parentHtmlEl, parentComponent) {
        console.log('start', 'constructor')
        if (this.constructor == Application) {
            throw new Error("Application is abstract classes and can't be instantiated.")
        }
        this.config.componentName = this.constructor.name

        this.parentHtmlEl = parentHtmlEl
        this.parentComponent = parentComponent

        console.log('end', 'constructor')
    }

    initiate() {
        console.log('start', 'initiate');
        this.beforeCreate();
        this.createComponent();
        this.afterCreate();
        console.log('end', 'initiate');
    }

    createComponent() {
        console.log('start', 'createComponent');
        console.log(this.template);

        const regexpTpl = [
            '(?=(<:))([^\\s]+)(.+?)(?=\\/>)\\/>',       // component
            '(?={(\\$)((:)?))([^}]+)(?=})}',            // variable (static or observed value)
            '(?={(@))([^=]+)="([^"]+)"(?=})}',          // event of html element
            '(?=({))({)((.+?)\\((.*?)\\))(?=})}',       // call component method
        ];

        const regexpHtmlNode = new RegExp('(<(\\/?)(:?)([^\\/>]+)(\\/?>))', 'gm');
        let match;

        let prevEnd = -1;

        let parentEl = null;
        let parentEls = [];
        let curentEl = this._virTpl;
        let nTxtEl;


        // nodes.push(curentEl);
        while ((match = regexpHtmlNode.exec(this.template)) !== null) {
            console.log('-----------------------------------------');
            console.log(`prevEnd = ${prevEnd}`);
            console.log(`Found ${match[0]} start=${match.index} end=${regexpHtmlNode.lastIndex}`);

            if (prevEnd > -1 && prevEnd < match.index) {
                console.log('text before find', this.template.substring(prevEnd, match.index));
                nTxtEl = document.createTextNode(this.template.substring(prevEnd, match.index));
                curentEl.appendChild(nTxtEl);
            }

            prevEnd = regexpHtmlNode.lastIndex;

            let nodeName = match[4].split(' ');
            if (match[5] == '/>' && match[3] == ':') {
                console.log('component', '\t', nodeName[0])
            } else if (match[5] == '/>') {
                console.log('selfclose tag', '\t', nodeName[0])
            } else if (match[5] == '>' && match[2] == '/') {
                console.log('close tag', '\t', nodeName[0]);
                curentEl = parentEls.pop();
                parentEl = null;
            } else if (match[5] == '>' && match[2] == '') {
                console.log('open tag', '\t', nodeName[0]);
                parentEl = curentEl;
                parentEls.push(curentEl);
                curentEl = document.createElement(nodeName[0]);
                parentEl.appendChild(curentEl);
            } else {
                console.log(match);
            }
        }

        console.log('-----------------------------------------');
        console.log(this._virTpl);



        /*
        '<div class="appContainer">'             '<div class="appContainer">'               ""      ""      'div class="appContainer"'              ">"
        "<div>"                                  "<div>"                                    ""      ""      "div"                                   ">"
        '<div class="msgBox">'                   '<div class="msgBox">'                     ""      ""      'div class="msgBox"'                    ">"
        "</div>"                                 "</div>"                                   "/"     ""      "div"                                   ">"
        '<div class="msgBox">'                   '<div class="msgBox">'                     ""      ""      'div class="msgBox"'                    ">"
        "</div>"                                 "</div>"                                   "/"     ""      "div"                                   ">"
        "</div>"                                 "</div>"                                   "/"     ""      "div"                                   ">"
        '<span class="spacer"/>'                 '<span class="spacer"/>'                   ""      ""      'span class="spacer"'                   "/>"
        '<:baner msg="{$msg}"/>'                 '<:baner msg="{$msg}"/>'                   ""      ":"     'baner msg="{$msg}"'                    "/>"
        "<br/>"                                  "<br/>"                                    ""      ""      "br"                                    "/>"
        "<br />"                                 "<br />"                                   ""      ""      "br "                                   "/>"
        "<div>"                                  "<div>"                                    ""      ""      "div"                                   ">"
        '<button {@keydown="counterIncres()"}>'  '<button {@keydown="counterIncres()"}>'    ""      ""      'button {@keydown="counterIncres()"}'   ">"
        "</button>"                              "</button>"                                "/"     ""      "button"                                ">"
        '<button {@keydown="counterDecres(2)"}>' '<button {@keydown="counterDecres(2)"}>'   ""      ""      'button {@keydown="counterDecres(2)"}'  ">"
        "</button>"                              "</button>"                                "/"     ""      "button"                                ">"
        '<div class="box">'                      '<div class="box">'                        ""      ""      'div class="box"'                       ">"
        "</div>"                                 "</div>"                                   "/"     ""      "div"                                   ">"
        '<div class="box">'                      '<div class="box">'                        ""      ""      'div class="box"'                       ">"
        "</div>"                                 "</div>"                                   "/"     ""      "div"                                   ">"
        */

        console.log('end', 'createComponent')
    }
}
