type Properties = { [key: string]: any }

type Tail<T extends [...any]> = T extends [infer _, ...infer Rest] ? Rest : [];

export class DOMFactory {
    private readonly validator = /^([a-z]+[a-z0-9]*)$|^(?:[a-z][a-z0-9\-]*-[a-z0-9]*)$/i;

    static create() {
        return new Proxy(new DOMFactory(), {
            get(target, tag) {
                if (tag in target) {
                    return target[tag as keyof typeof target];
                }

                return function (properties: Properties = {}, classes: string[] = [], textContent: string = "") {
                    return target.build(tag, properties, classes, textContent);
                };
            },
        }) as DOMFactory & { [key: string]: (...args: Tail<Parameters<DOMFactory["build"]>>) => ReturnType<DOMFactory["build"]>};
    }

    /**
     * Build the HTML element
     * 
     * @param {string|symbol} tag The name of the HTML element
     * @param {Properties} [properties={}] The properties of the element
     * @param {string[]} [classes=[]] The css classes to apply to the element
     * @param {string} [textContent=""] The initial text of the element
     * @returns {Node}
     */
    build(tag: string | symbol, properties: Properties = {}, classes: string[] = [], textContent: string = ""): Node {
        if (typeof tag === "symbol" || !this.validator.test(tag)) {
            throw new TypeError("Invalid tag name.");
        }

        const element = document.createElement(tag) as HTMLElement & {[key: string]: any};

        if (!this.isEmptyObject(properties)) {
            const keys = Object.keys(properties);
            for (const key of keys) {
                if (typeof properties[key] == "object") {
                    // Some properties, such as dataset, have to be set one key at a time
                    for (const subKey of Object.keys(properties[key])) {
                        element[key][subKey] = properties[key][subKey];
                    }
                }
                else {
                    try {
                        if (key == "innerHTML" && textContent !== "") {
                            console.warn("DOMFactory: innerHTML and text content are being set. The innerHTML will be OVERRIDDEN by the text content.");
                        }
                        element[key] = properties[key];
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
            }
        }

        if (classes.length != 0) {
            element.classList.add(...classes);
        }

        if (textContent !== "") {
            element.innerText = textContent;
        }

        return element;
    }

    /**
     * Build a Node just for text
     *
     * A convenient wrapper for `document.createTextNode`.
     *
     * @param {string} textContent The content of the text node
     * @returns {Text}
     */
    text(textContent: string = ""): Text {
        return document.createTextNode(textContent);
    }

    private isEmptyObject(obj: any): boolean {
        for (const name in obj) { return false; }
        return true;
    }
}