/**
 * DOMFactory
 * @author Bee Hudson
 *
 * The DOMFactory class is a shorthand way to create new HTML elements on the fly.
 * Simply create an instance of the class, and then call the element you want as a function.
 * To get the most use out of it, the instance should be created as a global constant, and
 * then used as needed. This system does allow for tags outside of the current spec. This is
 * by design.
 *
 * This class makes use of the ES6 Proxy class to allow for the creation of DOM elements by
 *  any name without having to define a function for any and all use cases.
 *
 * Tags with hyphens in the name, though, must be passed through the build function.
 *
 * @example
 *
 * const factory = new DOMFactory();
 *
 * const newMenu = factory.div();
 * const unknownElement = factory.whodey(); // works!
 * // Uncaught ReferenceError: custom is not defined
 * let customElement = factory.x-custom-element();
 * // works!
 * customElement = factory.build('x-custom-element');
 *
 * @see https://stackoverflow.com/a/48813036/2708601
 */
class DOMFactory {
    constructor() {
        this.nameValidate = /^([a-z]+[a-z0-9]*)$|^(?:[a-z][a-z0-9\-]*-[a-z0-9]*)$/i;
        return this.asProxy();
    }

    asProxy() {
        const handler = {
            get: function (target, tag) {
                if (target[tag] !== undefined) { return target[tag]; }

                return function (properties = {}, classes = [], textContent = "") { return target.build(tag, properties, classes, textContent); };
            },
        };

        return new Proxy(this, handler);
    }

    /**
     * Build the HTML element
     *
     * @param {string} tag - The name of the tag
     * @param {object} [properties] - Properties to assign to the new element
     * @param {string[]} [classes] - Classes to assign to the new element
     * @param {string} [textContent] - Text to be placed in the element on initialization
     * @returns {HTMLElement}
     */
    build(tag, properties = {}, classes = [], textContent = "") {
        if (!this.nameValidate.test(tag)) {
            console.error("Invalid tag name.");
            return undefined;
        }

        const element = document.createElement(tag);

        if (!jQuery.isEmptyObject(properties)) {
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
    text(textContent = "") {
        return document.createTextNode(textContent);
    }
}