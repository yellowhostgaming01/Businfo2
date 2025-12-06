var yhgquery = selector => {
  if (typeof selector === 'string') {
    if (selector[0] === "<" && selector[selector.length - 1] === ">") {
      var tagName = selector.slice(1, -1);
      return new CustomElements([document.createElement(tagName)], selector);
    } else {
      var elements = document.querySelectorAll(selector);
      return new CustomElements(elements, selector);
    }
  } else if (selector instanceof HTMLElement || selector instanceof NodeList || Array.isArray(selector)) {
    return new CustomElements(selector);
  } else {
    return new CustomElements([selector]);
  }
}

window._yhgquery = window._ = window.yhgquery = yhgquery;

class CustomElements {
  constructor(elements, selector) {
    if (!(elements instanceof NodeList) && !Array.isArray(elements)) {
      elements = [elements];
    }
    this.elements = elements;
    this.length = elements.length;
    this.selector = selector;
  }

  each(callback) {
    return yhgquery.each(this.elements, callback)
  }

  on(event, handler) {
    return yhgquery.on(this, event, handler)
  }
  
  off(event, handler) {
    this.each(element => {
      if (handler) {
        element.removeEventListener(event, handler);
      } else {
        // Remove all event listeners for that event if no handler is specified
        element.removeEventListener(event, null);
      }
    });
    return this;
  }

  map(callback) {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
      arr.push(callback.call(this.elements[i], i, this.elements));
    }
    return arr;
  }

  attr(...args) {
    if (args.length === 1 && typeof args[0] === 'object') {
      const attrs = args[0];
      this.each(element => {
        for (let name in attrs) {
          if (attrs.hasOwnProperty(name)) {
            element.setAttribute(name, attrs[name]);
          }
        }
      });
      return this;
    } else if (args.length >= 2) {
      const name = args[0];
      const value = args[1];
      this.each(element => {
        element.setAttribute(name, value);
      });
      return this;
    } else {
      const name = args[0];
      return this.elements[0].getAttribute(name);
    }
  }
  
  removeAttr(attrName){
    this.each(function(e){
      e.removeAttribute(attrName)
    })
  }

  siblings() {
    const parent = this.elements[0].parentElement;
    return new CustomElements(Array.from(parent.children).filter(child => child !== this.elements[0]));
  }

  next() {
    let nextSibling = this.elements[0].nextElementSibling;
    return new CustomElements(nextSibling ? [nextSibling] : []);
  }

  prev() {
    let prevSibling = this.elements[0].previousElementSibling;
    return new CustomElements(prevSibling ? [prevSibling] : []);
  }

  parent() {
    const parents = [];
    this.each(element => {
      if (element.parentElement) {
        parents.push(element.parentElement);
      }
    });
    return new CustomElements(parents);
  }

  Click(callback) {
    return this.on('click', callback);
  }

  toggle() {
    this.each(element => {
      if (element.style.display === 'none') {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });
    return this;
  }

  toggleClass(className) {
    this.each(element => {
      element.classList.toggle(className);
    });
    return this;
  }

  val(value) {
    if (typeof value !== 'undefined') {
      this.each(element => {
        element.value = value;
      });
      return this;
    } else {
      return this.elements[0].value;
    }
  }

  addClass(className) {
    const classes = className.split(' ')
    this.each(function(e) {
      classes.forEach(function(classname) {
        e.classList.add(classname)
      })
    })
    return this;
  }

  removeClass(value) {
    const classes = value.split(' ');
    this.each(function(element) {
      classes.forEach(className => {
        element.classList.remove(className);
      });
    });
    return this;
  }

  hasClass(className) {
    return this.elements[0].classList.contains(className);
  }

  html(html) {
    if (typeof html !== 'undefined') {
      this.each(element => {
        element.innerHTML = html;
      });
      return this;
    } else {
      return this.elements[0].innerHTML;
    }
  }

  text(text) {
    if (typeof text !== 'undefined') {
      this.each(element => {
        element.innerText = text;
      });
      return this;
    } else {
      return this.elements[0].innerText;
    }
  }

  Width(width) {
    if (this.elements[0] === window) {
      return window.innerWidth;
    }
  
    if (typeof width === 'undefined') {
      return this.elements.length > 0 ? this.elements[0].clientWidth : null;
    }
  
    this.each(element => {
      element.style.width = width;
    });
    return this;
  }

  Height(height) {
    if(this.elements[0] === window) return window.innerHeight
    if (typeof height === 'undefined') {
      return this.elements.length > 0 ? this.elements[0].clientHeight : undefined
    }
    this.each(element => {
      element.style.height = height;
    });
    return this;
  }

  hide() {
    this.each(element => {
      element.style.display = 'none';
    });
    return this;
  }

  show() {
    this.each(element => {
      element.style.display = '';
    });
    return this;
  }
  
  css(property, value) {
    if (typeof property === 'string') {
      // Get the style if only one argument is provided
      if (value === undefined) {
        return this.elements[0].style[property] || getComputedStyle(this.elements[0])[property]
      } else {
        // Set the style
        this.each(element => {
          element.style[property] = value;
        });
      }
    } else if (typeof property === 'object') {
      // Set multiple styles
      this.each(element => {
        for (let prop in property) {
          if (property.hasOwnProperty(prop)) {
            element.style[prop] = property[prop];
          }
        }
      });
    }
    return this;
  }

  append(content) {
    this.each(element => {
      if (content instanceof CustomElements) {
        content.each(child => element.appendChild(child));
      } else if (typeof content === 'string') {
        element.insertAdjacentHTML('beforeend', content);
      } else {
        element.appendChild(content);
      }
    });
    return this;
  }

  children() {
    const childrenElements = [];
    this.each(element => {
      childrenElements.push(...element.children);
    });
    return new CustomElements(childrenElements);
  }

  clone() {
    return new CustomElements(Array.from(this.elements).map(element => element.cloneNode(true)));
  }

  filter(callback) {
    return yhgquery.filter(this.elements, callback)
  }

  find(selector) {
    const foundElements = [];
    this.each(element => {
      foundElements.push(...element.querySelectorAll(selector));
    });
    return new CustomElements(foundElements, selector);
  }

  eq(index) {
    if (index < 0) {
      index = this.length - 1;
    }
    return new CustomElements([this.elements[index]]);
  }

  prop(name, value) {
    if (typeof value !== 'undefined') {
      this.each(element => {
        element[name] = value;
      });
      return this;
    } else {
      return this.elements[0][name];
    }
  }

  first() {
    return this.eq(0);
  }

  last() {
    return this.eq(-1);
  }

  removeChild(selector) {
    this.each((parent, index) => {
      var i = 0
      if (typeof selector === 'string') {
        const children = parent.querySelectorAll(selector);
        children.forEach(child => parent.removeChild(child));
      } else if (selector instanceof HTMLElement) {
        parent.removeChild(selector);
      }
    });

    if (this instanceof CustomElements && selector instanceof CustomElements && typeof selector === "object") {

      for (var i = 0; i < this.length; i++) {
        var parent = this.elements[i]
        var child = selector.elements[i]

        if (parent.nodeType === 1 && child.nodeType === 1) {
          var children = parent.childNodes
          for (var j = 0; j < children.length; j++) {
            if (children[j] === child) {
              parent.removeChild(child)
            }
          }
        }
      }

    }
    return this;
  }

  replaceWith(content) {
    this.each(element => {
      if (typeof content === 'string') {
        const tempElement = _('<div>').html(content);
        const newContent = tempElement.firstChild;
        element.parentNode.replaceChild(newContent, element);
      } else if (content instanceof CustomElements) {
        const newContent = content.elements[0];
        element.parentNode.replaceChild(newContent, element);
      } else if (content instanceof HTMLElement) {
        element.parentNode.replaceChild(content, element);
      }
    });
    return this;
  }

  replaceChild(oldChild, newChild) {
    this.each(parent => {
      parent.replaceChild(newChild.elements[0], oldChild.elements[0]);
    });
    return this;
  }

  remove() {
    this.each(function(e) {
      if (e.parentNode) {
        e.parentNode.removeChild(e)
      }
    })

    return this
  }

  ready(callback) {
    if (Array.isArray(this) || this instanceof CustomElements) {
      this.each(e => {
        if (e === document) {
          readyCheck()
        }
      })
    } else {
      if (this === document) {
        readyCheck()
      }
    }

    function readyCheck() {
      if (document.readyState !== "loading" && document.readyState === "complete") {
        callback()
      } else {
        document.addEventListener('DOMContentLoaded', callback)
      }
    }

    return this
  }
  
  click(){
    this.each(function(){
      this.click()
    })
  }
  
  is(selector) {
    return this.elements.some(element => element.matches(selector))
  }
}

yhgquery.fn = CustomElements.prototype;
document.ready = yhgquery.fn.ready

yhgquery.extend = yhgquery.fn.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }

  console.log(target);
  
  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }

  // Extend yhgquery itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        copy = options[name];

        // Prevent Object.prototype pollution
        // Prevent never-ending loop
        if (name === "__proto__" || target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          src = target[name];

          // Ensure proper type for the source value
          if (copyIsArray && !Array.isArray(src)) {
            clone = [];
          } else if (!copyIsArray && !isPlainObject(src)) {
            clone = {};
          } else {
            clone = src;
          }
          copyIsArray = false;

          // Never move original objects, clone them
          target[name] = yhgquery.extend(deep, clone, copy);

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

var isWindow = function isWindow(obj) {
  return obj != null && obj === obj.window
}

function isFunction(obj) {
  return typeof obj === 'function';
}

yhgquery.extend({
  each(obj, callback) {
    var length

    if (Array.isArray(obj) || (typeof obj === "object" && 'length' in obj)) {
      length = obj.length
      for (let i = 0; i < length; i++) {
        if (callback.call(obj[i], obj[i], i, obj) === false) {
          break;
        }
      }
    } else {
      for (var i in obj) {
        if (callback.call(obj.elements[i], obj.elements[i], i, obj) === false) {
          break;
        }
      }
    }
    return obj
  },

  filter(arrOrObj, callback) {
    var result = []

    if (Array.isArray(arrOrObj) || arrOrObj instanceof NodeList || arrOrObj instanceof HTMLCollection) {
      for (var i = 0; i < arrOrObj.length; i++) {
        if (callback.call(arrOrObj[i], arrOrObj[i], i, arrOrObj)) {
          result.push(arrOrObj[i])
        }
      }
    } else if (typeof arrOrObj === "object" && arrOrObj !== null && typeof arrOrObj.length === "undefined") {
      for (var key in arrOrObj) {
        if (arrOrObj.hasOwnProperty(key) && callback.call(arrOrObj[key], arrOrObj[key], key, arrOrObj)) {
          result.push(arrOrObj[key])
        }
      }
    } else {
      throw new TypeError('unsupported type arg')
    }
    return result
  },
  
  merge(...args){
    var allArrays = args.every(arg => Array.isArray(arg))
    
    var allObjects = args.every(arg => typeof arg === "object" && !Array.isArray(arg))
    
    if (allArrays) {
      var result = []
      
      for (let array of args) {
        result.push(...array)
      }
      
      return result
    } else if (allObjects) {
      var result = {}
      
      for (let obj of args) {
        for( let key in obj){
          if (obj.hasOwnProperty(key)) {
            result[ key ] = obj[ key ]
          }
        }
      }
      
      return result
    }
  },

  on(objects, eventName, handlers) {
    if (Array.isArray(objects) || objects instanceof CustomElements) {
      objects.each(e => onlogic(e, eventName, handlers))
    } else {
      onlogic(objects, eventName, handlers)
    }

    function onlogic(element, evt, handle) {
      if (!element.customEventHandlers) {
        element.customEventHandlers = {};
      }

      if (!element.customEventHandlers[evt]) {
        element.customEventHandlers[evt] = []
      }

      element.customEventHandlers[evt].push(handle)

      if (!element['on' + evt]) {
        element['on' + evt] = function(event) {
          for (var i = 0; i < element.customEventHandlers[evt].length; i++) {
            element.customEventHandlers[evt][i].call(element, event)
          }
        }
      }
    }
    return objects
  },
  
  push(array, ...elements){
    if (!Array.isArray(array)) {
      throw new Error("First argument must be an array");
    }
    
    // Function to flatten the elements
    function flattenAndPush(arr, elems) {
      for (let elem of elems) {
        if (Array.isArray(elem)) {
          // Recursively flatten arrays
          flattenAndPush(arr, elem);
        } else {
          // Push non-array elements directly
          arr[arr.length] = elem;
        }
      }
    }
    
    // Flatten and push the provided elements
    flattenAndPush(array, elements);
    
    return array
  },
  
  ajax: function({ url, method = 'GET', headers = {}, body = null, responseType = 'json', success, error }) {
    const options = {
      method,
      headers,
      body: body && JSON.stringify(body)
    };
  
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        switch (responseType.toLowerCase()) {
          case 'json':
            return response.json();
          case 'text':
            return response.text();
          case 'blob':
            return response.blob();
          case 'arraybuffer':
            return response.arrayBuffer();
          case 'xml':
            return response.text().then(str => new window.DOMParser().parseFromString(str, 'application/xml'));
          default:
            return response.text();
        }
      })
      .then(data => {
        if (success) success(data);
      })
      .catch(err => {
        if (error) error(err);
        console.error('Error in ajax request:', err);
      });
  }
})


var elementproto = {
  on: function(evt, callback) {
    yhgquery.on(this, evt, callback)
    return this; // Allow chaining
  },

  attr: function(...args) {
    if (args.length === 1 && typeof args[0] === 'object') {
      const attrs = args[0];
      Object.keys(attrs).forEach(name => {
        this.setAttribute(name, attrs[name]);
      });
      return this; // Allow chaining
    } else if (args.length === 2) {
      const [name, value] = args;
      this.setAttribute(name, value);
      return this; // Allow chaining
    } else if (args.length === 1) {
      const name = args[0];
      return this.getAttribute(name);
    }
  },

  siblings: function() {
    var a = Array.from(this.parentElement.children).filter(child => child !== this);
    return a
  },

  next: function() {
    let nextSibling = this.nextElementSibling;
    while (nextSibling && nextSibling.nodeType !== 1) {
      nextSibling = nextSibling.nextElementSibling;
    }
    return nextSibling;
  },

  prev: function() {
    let prevSibling = this.previousElementSibling;
    while (prevSibling && prevSibling.nodeType !== 1) {
      prevSibling = prevSibling.previousElementSibling;
    }
    return prevSibling;
  },

  parent: function() {
    return this.parentElement;
  },

  Click: function(callback) {
    this.on('click', callback);
    return this; // Allow chaining
  },

  toggle: function() {
    if (this.style.display === 'none') {
      this.style.display = '';
    } else {
      this.style.display = 'none';
    }
    return this; // Allow chaining
  },

  toggleClass: function(className) {
    this.classList.toggle(className);
    return this; // Allow chaining
  },

  val: function(value) {
    if (typeof value !== 'undefined') {
      this.value = value;
      return this; // Allow chaining
    } else {
      return this.value;
    }
  },

  css: function(styles) {
    Object.assign(this.style, styles);
    return this; // Allow chaining
  },

  addClass: function(className) {
    this.classList.add(className);
    return this; // Allow chaining
  },

  hasClass: function(className) {
    return this.classList.contains(className);
  },

  html: function(html) {
    if (typeof html !== 'undefined') {
      this.innerHTML = html;
      return this; // Allow chaining
    } else {
      return this.innerHTML;
    }
  },

  text: function(text) {
    if (typeof text !== 'undefined') {
      this.innerText = text;
      return this; // Allow chaining
    } else {
      return this.innerText;
    }
  },

  Width: function(width) {
    this.style.width = width;
    return this; // Allow chaining
  },

  Height: function(height) {
    this.style.height = height;
    return this; // Allow chaining
  },

  hide: function() {
    this.css({ 'display': 'none' })
  },

  show: function() {
    this.css({ 'display': '' })
  },

  append: function(el) {
    var a = this
    if ((el instanceof NodeList || el instanceof Array || el instanceof Object) && el.length > 1) {
      el.each(function(y) {
        this.appendChild(y)
      })
    } else if (typeof el === "string") {
      this.appendChild(document.createTextNode(el))
    }
    else {
      this.appendChild(el)
    }

    return this
  },

  find(qsa) {
    var el = document.querySelectorAll(qsa)
    return el
  },

  prop(name, value) {
    if (typeof value !== 'undefined') {
      this[name] = value;
      return this;
    } else {
      return this[name];
    }
  },
};

Object.assign(Element.prototype, elementproto)


/*for all elements*/
var nodeListproto = {
  each(callback) {
    for (var i = 0; i < this.length; i++) {
      callback.call(this[i], this[i], i, this)
    }
    return
  },

  Each(callback) {
    for (let i = 0; i < this.length; i++) {
      callback(this[i], i, this)
    }
  },

  on(evt, callback) {
    this.Each(element => {
      element.addEventListener(evt, callback);
    });
    return this;
  },

  attr(...args) {
    if (args.length === 1 && typeof args[0] === 'object') {
      const attrs = args[0];
      this.Each(element => {
        for (let name in attrs) {
          if (attrs.hasOwnProperty(name)) {
            element.setAttribute(name, attrs[name]);
          }
        }
      });
      return this;
    } else if (args.length >= 2) {
      const name = args[0];
      const value = args[1];
      this.Each(element => {
        element.setAttribute(name, value);
      });
      return this;
    } else {
      const name = args[0];
      return this.elements[0].getAttribute(name);
    }
  },

  siblings() {
    const parent = this[0].parentElement;
    const siblingsArray = Array.from(parent.children).filter(child => child !== this[0]);
    return siblingsArray;
  },

  next() {
    let nextSibling = this[0].nextElementSibling;
    while (nextSibling && nextSibling.nodeType !== 1) {
      nextSibling = nextSibling.nextElementSibling;
    }
    return nextSibling;
  },

  prev() {
    let prevSibling = this[0].previousElementSibling;
    while (prevSibling && prevSibling.nodeType !== 1) {
      prevSibling = prevSibling.previousElementSibling;
    }
    return prevSibling;
  },

  parent() {
    return this[0].parentElement;
  },

  children() {
    return this[0].children;
  },

  toggle() {
    this.Each(element => {
      if (element.style.display === 'none') {
        element.style.display = '';
      } else {
        element.style.display = 'none';
      }
    });
    return this;
  },

  toggleClass(className) {
    this.Each(element => {
      element.classList.toggle(className);
    });
    return this;
  },

  val(value) {
    if (typeof value !== 'undefined') {
      this.Each(element => {
        element.value = value;
      });
      return this;
    } else {
      return this[0].value;
    }
  },

  css(styles) {
    this.Each(element => {
      Object.assign(element.style, styles);
    });
    return this;
  },

  addClass(className) {
    this.Each(element => {
      element.classList.add(className);
    });
    return this;
  },

  hasClass(className) {
    return this[0].classList.contains(className);
  },

  html(html) {
    if (typeof html !== 'undefined') {
      this.Each(element => {
        element.innerHTML = html;
      });
      return this;
    } else {
      return this[0].innerHTML;
    }
  },

  text(text) {
    if (typeof text !== 'undefined') {
      this.Each(element => {
        element.innerText = text;
      });
      return this;
    } else {
      return this[0].innerText;
    }
  },

  Width(width) {
    this.Each(element => {
      element.style.width = width;
    });
    return this;
  },

  Height(height) {
    this.Each(element => {
      element.style.height = height;
    });
    return this;
  },

  hide() {
    this.Each(element => {
      element.style.display = 'none';
    });
    return this;
  },

  show() {
    this.Each(element => {
      element.style.display = '';
    });
    return this;
  },

  append(abc) {
    this.Each(yhg => {
      yhg.appendChild(abc)
    })
    return this
  },

  children() {
    const childrenArray = [];
    this.each(function() {
      childrenArray.push(...this.children);
    });
    return childrenArray
  },

  clone() {
    var arr = []
    this.each(function() {
      arr.push(this.cloneNode(true))
    })
    return arr
  },

  prop(name, value) {
    if (typeof value !== 'undefined') {
      this.Each(element => {
        element[name] = value;
      });
      return this;
    } else {
      return this[0][name];
    }
  }

  /*filter, find,eq are  already exist*/
}
Object.assign(NodeList.prototype, nodeListproto)