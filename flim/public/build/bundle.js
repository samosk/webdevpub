
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.5' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* eslint-disable no-param-reassign */

    /**
     * Options for customizing ripples
     */
    const defaults = {
      color: 'currentColor',
      class: '',
      opacity: 0.1,
      centered: false,
      spreadingDuration: '.4s',
      spreadingDelay: '0s',
      spreadingTimingFunction: 'linear',
      clearingDuration: '1s',
      clearingDelay: '0s',
      clearingTimingFunction: 'ease-in-out',
    };

    /**
     * Creates a ripple element but does not destroy it (use RippleStop for that)
     *
     * @param {Event} e
     * @param {*} options
     * @returns Ripple element
     */
    function RippleStart(e, options = {}) {
      e.stopImmediatePropagation();
      const opts = { ...defaults, ...options };

      const isTouchEvent = e.touches ? !!e.touches[0] : false;
      // Parent element
      const target = isTouchEvent ? e.touches[0].currentTarget : e.currentTarget;

      // Create ripple
      const ripple = document.createElement('div');
      const rippleStyle = ripple.style;

      // Adding default stuff
      ripple.className = `material-ripple ${opts.class}`;
      rippleStyle.position = 'absolute';
      rippleStyle.color = 'inherit';
      rippleStyle.borderRadius = '50%';
      rippleStyle.pointerEvents = 'none';
      rippleStyle.width = '100px';
      rippleStyle.height = '100px';
      rippleStyle.marginTop = '-50px';
      rippleStyle.marginLeft = '-50px';
      target.appendChild(ripple);
      rippleStyle.opacity = opts.opacity;
      rippleStyle.transition = `transform ${opts.spreadingDuration} ${opts.spreadingTimingFunction} ${opts.spreadingDelay},opacity ${opts.clearingDuration} ${opts.clearingTimingFunction} ${opts.clearingDelay}`;
      rippleStyle.transform = 'scale(0) translate(0,0)';
      rippleStyle.background = opts.color;

      // Positioning ripple
      const targetRect = target.getBoundingClientRect();
      if (opts.centered) {
        rippleStyle.top = `${targetRect.height / 2}px`;
        rippleStyle.left = `${targetRect.width / 2}px`;
      } else {
        const distY = isTouchEvent ? e.touches[0].clientY : e.clientY;
        const distX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        rippleStyle.top = `${distY - targetRect.top}px`;
        rippleStyle.left = `${distX - targetRect.left}px`;
      }

      // Enlarge ripple
      rippleStyle.transform = `scale(${
    Math.max(targetRect.width, targetRect.height) * 0.02
  }) translate(0,0)`;
      return ripple;
    }

    /**
     * Destroys the ripple, slowly fading it out.
     *
     * @param {Element} ripple
     */
    function RippleStop(ripple) {
      if (ripple) {
        ripple.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'opacity') ripple.remove();
        });
        ripple.style.opacity = 0;
      }
    }

    /**
     * @param node {Element}
     */
    var Ripple = (node, _options = {}) => {
      let options = _options;
      let destroyed = false;
      let ripple;
      let keyboardActive = false;
      const handleStart = (e) => {
        ripple = RippleStart(e, options);
      };
      const handleStop = () => RippleStop(ripple);
      const handleKeyboardStart = (e) => {
        if (!keyboardActive && (e.keyCode === 13 || e.keyCode === 32)) {
          ripple = RippleStart(e, { ...options, centered: true });
          keyboardActive = true;
        }
      };
      const handleKeyboardStop = () => {
        keyboardActive = false;
        handleStop();
      };

      function setup() {
        node.classList.add('s-ripple-container');
        node.addEventListener('pointerdown', handleStart);
        node.addEventListener('pointerup', handleStop);
        node.addEventListener('pointerleave', handleStop);
        node.addEventListener('keydown', handleKeyboardStart);
        node.addEventListener('keyup', handleKeyboardStop);
        destroyed = false;
      }

      function destroy() {
        node.classList.remove('s-ripple-container');
        node.removeEventListener('pointerdown', handleStart);
        node.removeEventListener('pointerup', handleStop);
        node.removeEventListener('pointerleave', handleStop);
        node.removeEventListener('keydown', handleKeyboardStart);
        node.removeEventListener('keyup', handleKeyboardStop);
        destroyed = true;
      }

      if (options) setup();

      return {
        update(newOptions) {
          options = newOptions;
          if (options && destroyed) setup();
          else if (!(options || destroyed)) destroy();
        },
        destroy,
      };
    };

    const filter = (classes) => classes.filter((x) => !!x);
    const format$1 = (classes) => classes.split(' ').filter((x) => !!x);

    /**
     * @param node {Element}
     * @param classes {Array<string>}
     */
    var Class = (node, _classes) => {
      let classes = _classes;
      node.classList.add(...format$1(filter(classes).join(' ')));
      return {
        update(_newClasses) {
          const newClasses = _newClasses;
          newClasses.forEach((klass, i) => {
            if (klass) node.classList.add(...format$1(klass));
            else if (classes[i]) node.classList.remove(...format$1(classes[i]));
          });
          classes = newClasses;
        },
      };
    };

    /* node_modules\svelte-materialify\dist\components\Button\Button.svelte generated by Svelte v3.46.5 */
    const file$7 = "node_modules\\svelte-materialify\\dist\\components\\Button\\Button.svelte";

    function create_fragment$7(ctx) {
    	let button_1;
    	let span;
    	let button_1_class_value;
    	let Class_action;
    	let Ripple_action;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	let button_1_levels = [
    		{
    			class: button_1_class_value = "s-btn size-" + /*size*/ ctx[5] + " " + /*klass*/ ctx[1]
    		},
    		{ type: /*type*/ ctx[14] },
    		{ style: /*style*/ ctx[16] },
    		{ disabled: /*disabled*/ ctx[11] },
    		{ "aria-disabled": /*disabled*/ ctx[11] },
    		/*$$restProps*/ ctx[17]
    	];

    	let button_1_data = {};

    	for (let i = 0; i < button_1_levels.length; i += 1) {
    		button_1_data = assign(button_1_data, button_1_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button_1 = element("button");
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "s-btn__content");
    			add_location(span, file$7, 46, 2, 5233);
    			set_attributes(button_1, button_1_data);
    			toggle_class(button_1, "s-btn--fab", /*fab*/ ctx[2]);
    			toggle_class(button_1, "icon", /*icon*/ ctx[3]);
    			toggle_class(button_1, "block", /*block*/ ctx[4]);
    			toggle_class(button_1, "tile", /*tile*/ ctx[6]);
    			toggle_class(button_1, "text", /*text*/ ctx[7] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "depressed", /*depressed*/ ctx[8] || /*text*/ ctx[7] || /*disabled*/ ctx[11] || /*outlined*/ ctx[9] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "outlined", /*outlined*/ ctx[9]);
    			toggle_class(button_1, "rounded", /*rounded*/ ctx[10]);
    			toggle_class(button_1, "disabled", /*disabled*/ ctx[11]);
    			add_location(button_1, file$7, 26, 0, 4783);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button_1, anchor);
    			append_dev(button_1, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			if (button_1.autofocus) button_1.focus();
    			/*button_1_binding*/ ctx[21](button_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Class_action = Class.call(null, button_1, [/*active*/ ctx[12] && /*activeClass*/ ctx[13]])),
    					action_destroyer(Ripple_action = Ripple.call(null, button_1, /*ripple*/ ctx[15])),
    					listen_dev(button_1, "click", /*click_handler*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button_1, button_1_data = get_spread_update(button_1_levels, [
    				(!current || dirty & /*size, klass*/ 34 && button_1_class_value !== (button_1_class_value = "s-btn size-" + /*size*/ ctx[5] + " " + /*klass*/ ctx[1])) && { class: button_1_class_value },
    				(!current || dirty & /*type*/ 16384) && { type: /*type*/ ctx[14] },
    				(!current || dirty & /*style*/ 65536) && { style: /*style*/ ctx[16] },
    				(!current || dirty & /*disabled*/ 2048) && { disabled: /*disabled*/ ctx[11] },
    				(!current || dirty & /*disabled*/ 2048) && { "aria-disabled": /*disabled*/ ctx[11] },
    				dirty & /*$$restProps*/ 131072 && /*$$restProps*/ ctx[17]
    			]));

    			if (Class_action && is_function(Class_action.update) && dirty & /*active, activeClass*/ 12288) Class_action.update.call(null, [/*active*/ ctx[12] && /*activeClass*/ ctx[13]]);
    			if (Ripple_action && is_function(Ripple_action.update) && dirty & /*ripple*/ 32768) Ripple_action.update.call(null, /*ripple*/ ctx[15]);
    			toggle_class(button_1, "s-btn--fab", /*fab*/ ctx[2]);
    			toggle_class(button_1, "icon", /*icon*/ ctx[3]);
    			toggle_class(button_1, "block", /*block*/ ctx[4]);
    			toggle_class(button_1, "tile", /*tile*/ ctx[6]);
    			toggle_class(button_1, "text", /*text*/ ctx[7] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "depressed", /*depressed*/ ctx[8] || /*text*/ ctx[7] || /*disabled*/ ctx[11] || /*outlined*/ ctx[9] || /*icon*/ ctx[3]);
    			toggle_class(button_1, "outlined", /*outlined*/ ctx[9]);
    			toggle_class(button_1, "rounded", /*rounded*/ ctx[10]);
    			toggle_class(button_1, "disabled", /*disabled*/ ctx[11]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button_1);
    			if (default_slot) default_slot.d(detaching);
    			/*button_1_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"class","fab","icon","block","size","tile","text","depressed","outlined","rounded","disabled","active","activeClass","type","ripple","style","button"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { fab = false } = $$props;
    	let { icon = false } = $$props;
    	let { block = false } = $$props;
    	let { size = 'default' } = $$props;
    	let { tile = false } = $$props;
    	let { text = false } = $$props;
    	let { depressed = false } = $$props;
    	let { outlined = false } = $$props;
    	let { rounded = false } = $$props;
    	let { disabled = null } = $$props;
    	let { active = false } = $$props;
    	let { activeClass = 'active' } = $$props;
    	let { type = 'button' } = $$props;
    	let { ripple = {} } = $$props;
    	let { style = null } = $$props;
    	let { button = null } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			button = $$value;
    			$$invalidate(0, button);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, klass = $$new_props.class);
    		if ('fab' in $$new_props) $$invalidate(2, fab = $$new_props.fab);
    		if ('icon' in $$new_props) $$invalidate(3, icon = $$new_props.icon);
    		if ('block' in $$new_props) $$invalidate(4, block = $$new_props.block);
    		if ('size' in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ('tile' in $$new_props) $$invalidate(6, tile = $$new_props.tile);
    		if ('text' in $$new_props) $$invalidate(7, text = $$new_props.text);
    		if ('depressed' in $$new_props) $$invalidate(8, depressed = $$new_props.depressed);
    		if ('outlined' in $$new_props) $$invalidate(9, outlined = $$new_props.outlined);
    		if ('rounded' in $$new_props) $$invalidate(10, rounded = $$new_props.rounded);
    		if ('disabled' in $$new_props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('active' in $$new_props) $$invalidate(12, active = $$new_props.active);
    		if ('activeClass' in $$new_props) $$invalidate(13, activeClass = $$new_props.activeClass);
    		if ('type' in $$new_props) $$invalidate(14, type = $$new_props.type);
    		if ('ripple' in $$new_props) $$invalidate(15, ripple = $$new_props.ripple);
    		if ('style' in $$new_props) $$invalidate(16, style = $$new_props.style);
    		if ('button' in $$new_props) $$invalidate(0, button = $$new_props.button);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Ripple,
    		Class,
    		klass,
    		fab,
    		icon,
    		block,
    		size,
    		tile,
    		text,
    		depressed,
    		outlined,
    		rounded,
    		disabled,
    		active,
    		activeClass,
    		type,
    		ripple,
    		style,
    		button
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('klass' in $$props) $$invalidate(1, klass = $$new_props.klass);
    		if ('fab' in $$props) $$invalidate(2, fab = $$new_props.fab);
    		if ('icon' in $$props) $$invalidate(3, icon = $$new_props.icon);
    		if ('block' in $$props) $$invalidate(4, block = $$new_props.block);
    		if ('size' in $$props) $$invalidate(5, size = $$new_props.size);
    		if ('tile' in $$props) $$invalidate(6, tile = $$new_props.tile);
    		if ('text' in $$props) $$invalidate(7, text = $$new_props.text);
    		if ('depressed' in $$props) $$invalidate(8, depressed = $$new_props.depressed);
    		if ('outlined' in $$props) $$invalidate(9, outlined = $$new_props.outlined);
    		if ('rounded' in $$props) $$invalidate(10, rounded = $$new_props.rounded);
    		if ('disabled' in $$props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('active' in $$props) $$invalidate(12, active = $$new_props.active);
    		if ('activeClass' in $$props) $$invalidate(13, activeClass = $$new_props.activeClass);
    		if ('type' in $$props) $$invalidate(14, type = $$new_props.type);
    		if ('ripple' in $$props) $$invalidate(15, ripple = $$new_props.ripple);
    		if ('style' in $$props) $$invalidate(16, style = $$new_props.style);
    		if ('button' in $$props) $$invalidate(0, button = $$new_props.button);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		button,
    		klass,
    		fab,
    		icon,
    		block,
    		size,
    		tile,
    		text,
    		depressed,
    		outlined,
    		rounded,
    		disabled,
    		active,
    		activeClass,
    		type,
    		ripple,
    		style,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		button_1_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			class: 1,
    			fab: 2,
    			icon: 3,
    			block: 4,
    			size: 5,
    			tile: 6,
    			text: 7,
    			depressed: 8,
    			outlined: 9,
    			rounded: 10,
    			disabled: 11,
    			active: 12,
    			activeClass: 13,
    			type: 14,
    			ripple: 15,
    			style: 16,
    			button: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fab() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fab(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tile() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tile(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get depressed() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set depressed(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rounded() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rounded(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ripple() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ripple(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get button() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set button(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* eslint-disable */
    // Shamefully ripped from https://github.com/lukeed/uid
    let IDX = 36;
    let HEX = '';
    while (IDX--) HEX += IDX.toString(36);

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* eslint-disable no-param-reassign */

    const themeColors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];

    /**
     * @param {string} klass
     */
    function formatClass(klass) {
      return klass.split(' ').map((i) => {
        if (themeColors.includes(i)) return `${i}-color`;
        return i;
      });
    }

    function setBackgroundColor(node, text) {
      if (/^(#|rgb|hsl|currentColor)/.test(text)) {
        // This is a CSS hex.
        node.style.backgroundColor = text;
        return false;
      }

      if (text.startsWith('--')) {
        // This is a CSS variable.
        node.style.backgroundColor = `var(${text})`;
        return false;
      }

      const klass = formatClass(text);
      node.classList.add(...klass);
      return klass;
    }

    /**
     * @param node {Element}
     * @param text {string|boolean}
     */
    var BackgroundColor = (node, text) => {
      let klass;
      if (typeof text === 'string') {
        klass = setBackgroundColor(node, text);
      }

      return {
        update(newText) {
          if (klass) {
            node.classList.remove(...klass);
          } else {
            node.style.backgroundColor = null;
          }

          if (typeof newText === 'string') {
            klass = setBackgroundColor(node, newText);
          }
        },
      };
    };

    /* node_modules\svelte-materialify\dist\components\Overlay\Overlay.svelte generated by Svelte v3.46.5 */
    const file$6 = "node_modules\\svelte-materialify\\dist\\components\\Overlay\\Overlay.svelte";

    // (20:0) {#if active}
    function create_if_block$1(ctx) {
    	let div2;
    	let div0;
    	let BackgroundColor_action;
    	let t;
    	let div1;
    	let div2_class_value;
    	let div2_style_value;
    	let div2_intro;
    	let div2_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "s-overlay__scrim svelte-zop6hb");
    			set_style(div0, "opacity", /*opacity*/ ctx[5]);
    			add_location(div0, file$6, 27, 4, 1076);
    			attr_dev(div1, "class", "s-overlay__content svelte-zop6hb");
    			add_location(div1, file$6, 28, 4, 1167);
    			attr_dev(div2, "class", div2_class_value = "s-overlay " + /*klass*/ ctx[0] + " svelte-zop6hb");
    			attr_dev(div2, "style", div2_style_value = "z-index:" + /*index*/ ctx[7] + ";" + /*style*/ ctx[9]);
    			toggle_class(div2, "absolute", /*absolute*/ ctx[8]);
    			add_location(div2, file$6, 20, 2, 912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div0, /*color*/ ctx[6])),
    					listen_dev(div2, "click", /*click_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*opacity*/ 32) {
    				set_style(div0, "opacity", /*opacity*/ ctx[5]);
    			}

    			if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & /*color*/ 64) BackgroundColor_action.update.call(null, /*color*/ ctx[6]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div2_class_value !== (div2_class_value = "s-overlay " + /*klass*/ ctx[0] + " svelte-zop6hb")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty & /*index, style*/ 640 && div2_style_value !== (div2_style_value = "z-index:" + /*index*/ ctx[7] + ";" + /*style*/ ctx[9])) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (dirty & /*klass, absolute*/ 257) {
    				toggle_class(div2, "absolute", /*absolute*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);
    				div2_intro = create_in_transition(div2, /*transition*/ ctx[1], /*inOpts*/ ctx[2]);
    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div2_intro) div2_intro.invalidate();
    			div2_outro = create_out_transition(div2, /*transition*/ ctx[1], /*outOpts*/ ctx[3]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div2_outro) div2_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(20:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*active*/ ctx[4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*active*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*active*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Overlay', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { transition = fade } = $$props;
    	let { inOpts = { duration: 250 } } = $$props;
    	let { outOpts = { duration: 250 } } = $$props;
    	let { active = true } = $$props;
    	let { opacity = 0.46 } = $$props;
    	let { color = 'rgb(33, 33, 33)' } = $$props;
    	let { index = 5 } = $$props;
    	let { absolute = false } = $$props;
    	let { style = '' } = $$props;

    	const writable_props = [
    		'class',
    		'transition',
    		'inOpts',
    		'outOpts',
    		'active',
    		'opacity',
    		'color',
    		'index',
    		'absolute',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Overlay> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('transition' in $$props) $$invalidate(1, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(2, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(3, outOpts = $$props.outOpts);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    		if ('opacity' in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ('color' in $$props) $$invalidate(6, color = $$props.color);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('absolute' in $$props) $$invalidate(8, absolute = $$props.absolute);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		BackgroundColor,
    		klass,
    		transition,
    		inOpts,
    		outOpts,
    		active,
    		opacity,
    		color,
    		index,
    		absolute,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('transition' in $$props) $$invalidate(1, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(2, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(3, outOpts = $$props.outOpts);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    		if ('opacity' in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ('color' in $$props) $$invalidate(6, color = $$props.color);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('absolute' in $$props) $$invalidate(8, absolute = $$props.absolute);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		klass,
    		transition,
    		inOpts,
    		outOpts,
    		active,
    		opacity,
    		color,
    		index,
    		absolute,
    		style,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Overlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			class: 0,
    			transition: 1,
    			inOpts: 2,
    			outOpts: 3,
    			active: 4,
    			opacity: 5,
    			color: 6,
    			index: 7,
    			absolute: 8,
    			style: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overlay",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inOpts() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inOpts(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outOpts() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outOpts(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get absolute() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set absolute(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Player.svelte generated by Svelte v3.46.5 */

    const { isNaN: isNaN_1 } = globals;
    const file$5 = "src\\Player.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let video;
    	let track;
    	let video_src_value;
    	let video_updating = false;
    	let video_animationframe;
    	let video_is_paused = true;
    	let t0;
    	let div1;
    	let div0;
    	let span0;
    	let t1_value = format(/*time*/ ctx[2]) + "";
    	let t1;
    	let t2;
    	let span2;
    	let span1;
    	let t3_value = format(/*duration*/ ctx[3]) + "";
    	let t3;
    	let t4;
    	let progress;
    	let progress_value_value;
    	let mounted;
    	let dispose;

    	function video_timeupdate_handler() {
    		cancelAnimationFrame(video_animationframe);

    		if (!video.paused) {
    			video_animationframe = raf(video_timeupdate_handler);
    			video_updating = true;
    		}

    		/*video_timeupdate_handler*/ ctx[10].call(video);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			video = element("video");
    			track = element("track");
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			span2 = element("span");
    			span1 = element("span");
    			t3 = text(t3_value);
    			t4 = space();
    			progress = element("progress");
    			attr_dev(track, "kind", "captions");
    			add_location(track, file$5, 80, 2, 2078);
    			attr_dev(video, "id", "vid");
    			attr_dev(video, "poster", /*video_pic*/ ctx[1]);
    			if (!src_url_equal(video.src, video_src_value = /*video_vid*/ ctx[0])) attr_dev(video, "src", video_src_value);
    			attr_dev(video, "class", "svelte-l3mufg");
    			if (/*duration*/ ctx[3] === void 0) add_render_callback(() => /*video_durationchange_handler*/ ctx[11].call(video));
    			add_location(video, file$5, 70, 1, 1826);
    			attr_dev(span0, "class", "time svelte-l3mufg");
    			add_location(span0, file$5, 92, 3, 2467);
    			attr_dev(span1, "class", "time svelte-l3mufg");
    			add_location(span1, file$5, 94, 4, 2524);
    			attr_dev(span2, "class", "svelte-l3mufg");
    			add_location(span2, file$5, 93, 3, 2512);
    			attr_dev(div0, "class", "info svelte-l3mufg");
    			add_location(div0, file$5, 91, 2, 2444);
    			progress.value = progress_value_value = /*time*/ ctx[2] / /*duration*/ ctx[3] || 0;
    			attr_dev(progress, "class", "svelte-l3mufg");
    			add_location(progress, file$5, 97, 2, 2594);
    			attr_dev(div1, "class", "controls svelte-l3mufg");
    			set_style(div1, "opacity", /*duration*/ ctx[3] && /*showControls*/ ctx[5] ? 1 : 0);
    			add_location(div1, file$5, 83, 1, 2119);
    			attr_dev(div2, "id", "container");
    			attr_dev(div2, "class", "svelte-l3mufg");
    			add_location(div2, file$5, 69, 0, 1803);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, video);
    			append_dev(video, track);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, span2);
    			append_dev(span2, span1);
    			append_dev(span1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, progress);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", prevent_default(/*handleKeyDown*/ ctx[9]), false, true, false),
    					listen_dev(video, "mousedown", stop_propagation(prevent_default(/*handleMousedown*/ ctx[7])), false, true, true),
    					listen_dev(video, "mouseup", stop_propagation(prevent_default(/*handleMouseup*/ ctx[8])), false, true, true),
    					listen_dev(video, "timeupdate", video_timeupdate_handler),
    					listen_dev(video, "durationchange", /*video_durationchange_handler*/ ctx[11]),
    					listen_dev(video, "play", /*video_play_pause_handler*/ ctx[12]),
    					listen_dev(video, "pause", /*video_play_pause_handler*/ ctx[12]),
    					listen_dev(div1, "mousemove", stop_propagation(prevent_default(/*handleMove*/ ctx[6])), false, true, true),
    					listen_dev(div1, "touchmove", stop_propagation(prevent_default(/*handleMove*/ ctx[6])), false, true, true),
    					listen_dev(div1, "mousedown", stop_propagation(prevent_default(/*handleMove*/ ctx[6])), false, true, true),
    					listen_dev(div1, "mouseup", stop_propagation(prevent_default(/*handleMove*/ ctx[6])), false, true, true)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*video_pic*/ 2) {
    				attr_dev(video, "poster", /*video_pic*/ ctx[1]);
    			}

    			if (dirty & /*video_vid*/ 1 && !src_url_equal(video.src, video_src_value = /*video_vid*/ ctx[0])) {
    				attr_dev(video, "src", video_src_value);
    			}

    			if (!video_updating && dirty & /*time*/ 4 && !isNaN_1(/*time*/ ctx[2])) {
    				video.currentTime = /*time*/ ctx[2];
    			}

    			video_updating = false;

    			if (dirty & /*paused*/ 16 && video_is_paused !== (video_is_paused = /*paused*/ ctx[4])) {
    				video[video_is_paused ? "pause" : "play"]();
    			}

    			if (dirty & /*time*/ 4 && t1_value !== (t1_value = format(/*time*/ ctx[2]) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*duration*/ 8 && t3_value !== (t3_value = format(/*duration*/ ctx[3]) + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*time, duration*/ 12 && progress_value_value !== (progress_value_value = /*time*/ ctx[2] / /*duration*/ ctx[3] || 0)) {
    				prop_dev(progress, "value", progress_value_value);
    			}

    			if (dirty & /*duration, showControls*/ 40) {
    				set_style(div1, "opacity", /*duration*/ ctx[3] && /*showControls*/ ctx[5] ? 1 : 0);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function format(seconds) {
    	if (isNaN(seconds)) return "...";
    	const minutes = Math.floor(seconds / 60);
    	seconds = Math.floor(seconds % 60);
    	if (seconds < 10) seconds = "0" + seconds;
    	return `${minutes}:${seconds}`;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Player', slots, []);
    	let { video_vid } = $$props;
    	let { video_pic } = $$props;

    	// These values are bound to properties of the video
    	let time = 0;

    	let duration;
    	let paused = true;
    	let showControls = true;
    	let showControlsTimeout;

    	// Used to track time of last mouse down event
    	let lastMouseDown;

    	function handleMove(e) {
    		// Make the controls visible, but fade out after
    		// 2.5 seconds of inactivity
    		clearTimeout(showControlsTimeout);

    		showControlsTimeout = setTimeout(() => $$invalidate(5, showControls = false), 2500);
    		$$invalidate(5, showControls = true);
    		if (!duration) return; // video not loaded yet
    		if (e.type !== "touchmove" && !(e.buttons & 1)) return; // mouse not down

    		const clientX = e.type === "touchmove"
    		? e.touches[0].clientX
    		: e.clientX;

    		const { left, right } = this.getBoundingClientRect();
    		$$invalidate(2, time = duration * (clientX - left) / (right - left));
    	}

    	// we can't rely on the built-in click event, because it fires
    	// after a drag — we have to listen for clicks ourselves
    	function handleMousedown(e) {
    		lastMouseDown = new Date();
    	}

    	function handleMouseup(e) {
    		if (new Date() - lastMouseDown < 300) {
    			if (paused) e.target.play(); else e.target.pause();
    		}
    	}

    	function handleKeyDown(e) {
    		let video = document.getElementById("vid");

    		if (e && e.key == " ") {
    			if (paused) video.play(); else video.pause();
    		}
    	}

    	const writable_props = ['video_vid', 'video_pic'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Player> was created with unknown prop '${key}'`);
    	});

    	function video_timeupdate_handler() {
    		time = this.currentTime;
    		$$invalidate(2, time);
    	}

    	function video_durationchange_handler() {
    		duration = this.duration;
    		$$invalidate(3, duration);
    	}

    	function video_play_pause_handler() {
    		paused = this.paused;
    		$$invalidate(4, paused);
    	}

    	$$self.$$set = $$props => {
    		if ('video_vid' in $$props) $$invalidate(0, video_vid = $$props.video_vid);
    		if ('video_pic' in $$props) $$invalidate(1, video_pic = $$props.video_pic);
    	};

    	$$self.$capture_state = () => ({
    		video_vid,
    		video_pic,
    		time,
    		duration,
    		paused,
    		showControls,
    		showControlsTimeout,
    		lastMouseDown,
    		handleMove,
    		handleMousedown,
    		handleMouseup,
    		handleKeyDown,
    		format
    	});

    	$$self.$inject_state = $$props => {
    		if ('video_vid' in $$props) $$invalidate(0, video_vid = $$props.video_vid);
    		if ('video_pic' in $$props) $$invalidate(1, video_pic = $$props.video_pic);
    		if ('time' in $$props) $$invalidate(2, time = $$props.time);
    		if ('duration' in $$props) $$invalidate(3, duration = $$props.duration);
    		if ('paused' in $$props) $$invalidate(4, paused = $$props.paused);
    		if ('showControls' in $$props) $$invalidate(5, showControls = $$props.showControls);
    		if ('showControlsTimeout' in $$props) showControlsTimeout = $$props.showControlsTimeout;
    		if ('lastMouseDown' in $$props) lastMouseDown = $$props.lastMouseDown;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		video_vid,
    		video_pic,
    		time,
    		duration,
    		paused,
    		showControls,
    		handleMove,
    		handleMousedown,
    		handleMouseup,
    		handleKeyDown,
    		video_timeupdate_handler,
    		video_durationchange_handler,
    		video_play_pause_handler
    	];
    }

    class Player extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { video_vid: 0, video_pic: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Player",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*video_vid*/ ctx[0] === undefined && !('video_vid' in props)) {
    			console.warn("<Player> was created without expected prop 'video_vid'");
    		}

    		if (/*video_pic*/ ctx[1] === undefined && !('video_pic' in props)) {
    			console.warn("<Player> was created without expected prop 'video_pic'");
    		}
    	}

    	get video_vid() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set video_vid(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get video_pic() {
    		throw new Error("<Player>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set video_pic(value) {
    		throw new Error("<Player>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\VideoContainer.svelte generated by Svelte v3.46.5 */
    const file$4 = "src\\VideoContainer.svelte";

    // (65:16) <Button                      class="error-color"                      size="small"                      on:click={() => {                          video_player_is_active = false;                      }}                  >
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(65:16) <Button                      class=\\\"error-color\\\"                      size=\\\"small\\\"                      on:click={() => {                          video_player_is_active = false;                      }}                  >",
    		ctx
    	});

    	return block;
    }

    // (76:16) <Button                      size="small"                      class="primary-color"                      on:click={() => {                          is_fullscreen = !is_fullscreen;                          // do not focus the fullscreenbutton if clicked                          // this is because otherwise clicking space will cause                          // the video player to maximize/minimize instead of pause/play                          // when space is clicked                          if (document.activeElement != document.body)                              document.activeElement.blur();                      }}                  >
    function create_default_slot_2(ctx) {
    	let t_value = (/*is_fullscreen*/ ctx[4] ? "Minimize" : "Theatre Mode") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*is_fullscreen*/ 16 && t_value !== (t_value = (/*is_fullscreen*/ ctx[4] ? "Minimize" : "Theatre Mode") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(76:16) <Button                      size=\\\"small\\\"                      class=\\\"primary-color\\\"                      on:click={() => {                          is_fullscreen = !is_fullscreen;                          // do not focus the fullscreenbutton if clicked                          // this is because otherwise clicking space will cause                          // the video player to maximize/minimize instead of pause/play                          // when space is clicked                          if (document.activeElement != document.body)                              document.activeElement.blur();                      }}                  >",
    		ctx
    	});

    	return block;
    }

    // (93:12) {#if is_fullscreen && video_vid.endsWith("mp4")}
    function create_if_block_1(ctx) {
    	let div;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				size: "small",
    				class: "secondary-color",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_3*/ ctx[8]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(div, "id", "gigascreen");
    			attr_dev(div, "class", "svelte-1psj3nw");
    			add_location(div, file$4, 93, 16, 3305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(93:12) {#if is_fullscreen && video_vid.endsWith(\\\"mp4\\\")}",
    		ctx
    	});

    	return block;
    }

    // (95:20) <Button                          size="small"                          class="secondary-color"                          on:click={() => {                              // do not focus the fullscreenbutton if clicked                              // this is because otherwise clicking space will cause                              // the video player to maximize/minimize instead of pause/play                              // when space is clicked                              if (document.activeElement != document.body)                                  document.activeElement.blur();                                let div = document.getElementById("vid");                              if (div.requestFullscreen) div.requestFullscreen();                              else if (div.webkitRequestFullscreen)                                  div.webkitRequestFullscreen();                              else if (div.msRequestFullScreen)                                  div.msRequestFullScreen();                          }}                      >
    function create_default_slot_1(ctx) {
    	let t_value = "Gigascreen" + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(95:20) <Button                          size=\\\"small\\\"                          class=\\\"secondary-color\\\"                          on:click={() => {                              // do not focus the fullscreenbutton if clicked                              // this is because otherwise clicking space will cause                              // the video player to maximize/minimize instead of pause/play                              // when space is clicked                              if (document.activeElement != document.body)                                  document.activeElement.blur();                                let div = document.getElementById(\\\"vid\\\");                              if (div.requestFullscreen) div.requestFullscreen();                              else if (div.webkitRequestFullscreen)                                  div.webkitRequestFullscreen();                              else if (div.msRequestFullScreen)                                  div.msRequestFullScreen();                          }}                      >",
    		ctx
    	});

    	return block;
    }

    // (120:12) {:else}
    function create_else_block(ctx) {
    	let iframe;
    	let iframe_src_value;

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			attr_dev(iframe, "width", "100%");
    			attr_dev(iframe, "height", "100%");
    			if (!src_url_equal(iframe.src, iframe_src_value = /*video_vid*/ ctx[0])) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", "");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$4, 120, 16, 4639);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*video_vid*/ 1 && !src_url_equal(iframe.src, iframe_src_value = /*video_vid*/ ctx[0])) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(120:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (118:12) {#if video_vid.endsWith("mp4")}
    function create_if_block(ctx) {
    	let player;
    	let current;

    	player = new Player({
    			props: {
    				video_vid: /*video_vid*/ ctx[0],
    				video_pic: /*video_pic*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(player.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(player, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const player_changes = {};
    			if (dirty & /*video_vid*/ 1) player_changes.video_vid = /*video_vid*/ ctx[0];
    			if (dirty & /*video_pic*/ 2) player_changes.video_pic = /*video_pic*/ ctx[1];
    			player.$set(player_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(player.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(player.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(player, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(118:12) {#if video_vid.endsWith(\\\"mp4\\\")}",
    		ctx
    	});

    	return block;
    }

    // (49:4) <Overlay          opacity={is_fullscreen ? 1 : 0.7}          color="black"          active={video_player_is_active}          on:click={() => {              video_player_is_active = false;          }}      >
    function create_default_slot(ctx) {
    	let div2;
    	let div0;
    	let button0;
    	let t0;
    	let div1;
    	let button1;
    	let t1;
    	let show_if_1 = /*is_fullscreen*/ ctx[4] && /*video_vid*/ ctx[0].endsWith("mp4");
    	let t2;
    	let show_if;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				class: "error-color",
    				size: "small",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler_1*/ ctx[6]);

    	button1 = new Button({
    			props: {
    				size: "small",
    				class: "primary-color",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_2*/ ctx[7]);
    	let if_block0 = show_if_1 && create_if_block_1(ctx);
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*video_vid*/ 1) show_if = null;
    		if (show_if == null) show_if = !!/*video_vid*/ ctx[0].endsWith("mp4");
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(button1.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if_block1.c();
    			attr_dev(div0, "id", "close");
    			attr_dev(div0, "class", "svelte-1psj3nw");
    			add_location(div0, file$4, 63, 12, 2083);
    			attr_dev(div1, "id", "fullscreen");
    			attr_dev(div1, "class", "svelte-1psj3nw");
    			add_location(div1, file$4, 74, 12, 2426);
    			attr_dev(div2, "id", "video");
    			attr_dev(div2, "class", "svelte-1psj3nw");
    			toggle_class(div2, "fullscreen", /*is_fullscreen*/ ctx[4] == true);
    			add_location(div2, file$4, 56, 8, 1890);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(button0, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(button1, div1, null);
    			append_dev(div2, t1);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t2);
    			if_blocks[current_block_type_index].m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler_4, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope, is_fullscreen*/ 1040) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			if (dirty & /*is_fullscreen, video_vid*/ 17) show_if_1 = /*is_fullscreen*/ ctx[4] && /*video_vid*/ ctx[0].endsWith("mp4");

    			if (show_if_1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*is_fullscreen, video_vid*/ 17) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div2, null);
    			}

    			if (dirty & /*is_fullscreen*/ 16) {
    				toggle_class(div2, "fullscreen", /*is_fullscreen*/ ctx[4] == true);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(49:4) <Overlay          opacity={is_fullscreen ? 1 : 0.7}          color=\\\"black\\\"          active={video_player_is_active}          on:click={() => {              video_player_is_active = false;          }}      >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let div7;
    	let section;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div6;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let div5;
    	let div2;
    	let t2;
    	let div2_src_value;
    	let t3;
    	let div3;
    	let t5;
    	let div4;
    	let span0;
    	let t7;
    	let span1;
    	let t9;
    	let overlay;
    	let current;
    	let mounted;
    	let dispose;

    	overlay = new Overlay({
    			props: {
    				opacity: /*is_fullscreen*/ ctx[4] ? 1 : 0.7,
    				color: "black",
    				active: /*video_player_is_active*/ ctx[3],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	overlay.$on("click", /*click_handler_5*/ ctx[9]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div7 = element("div");
    			section = element("section");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div6 = element("div");
    			div1 = element("div");
    			img1 = element("img");
    			t1 = space();
    			div5 = element("div");
    			div2 = element("div");
    			t2 = text(/*title*/ ctx[2]);
    			t3 = space();
    			div3 = element("div");
    			div3.textContent = "Channel Name";
    			t5 = space();
    			div4 = element("div");
    			span0 = element("span");
    			span0.textContent = "12K views";
    			t7 = text("\r\n                        •\r\n                        ");
    			span1 = element("span");
    			span1.textContent = "1 week ago";
    			t9 = space();
    			create_component(overlay.$$.fragment);
    			attr_dev(img0, "class", "thumbnail-image svelte-1psj3nw");
    			if (!src_url_equal(img0.src, img0_src_value = /*video_pic*/ ctx[1] ?? "http://unsplash.it/250/150?gravity=center")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$4, 20, 16, 567);
    			attr_dev(div0, "class", "thumbnail svelte-1psj3nw");
    			attr_dev(div0, "data-duration", "13:37");
    			add_location(div0, file$4, 13, 12, 349);
    			attr_dev(img1, "class", "channel-icon svelte-1psj3nw");
    			if (!src_url_equal(img1.src, img1_src_value = "https://i1.wp.com/globalgrind.com/wp-content/uploads/sites/16/2014/10/screen-shot-2014-10-17-at-3-46-07-pm.png?quality=80&strip=all&ssl=1")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$4, 29, 20, 886);
    			add_location(div1, file$4, 28, 16, 859);
    			attr_dev(div2, "class", "video-title svelte-1psj3nw");
    			attr_dev(div2, "alt", "");
    			if (!src_url_equal(div2.src, div2_src_value = /*title*/ ctx[2])) attr_dev(div2, "src", div2_src_value);
    			add_location(div2, file$4, 36, 20, 1252);
    			attr_dev(div3, "class", "video-channel-name svelte-1psj3nw");
    			attr_dev(div3, "alt", "");
    			add_location(div3, file$4, 37, 20, 1331);
    			add_location(span0, file$4, 39, 24, 1464);
    			add_location(span1, file$4, 41, 24, 1539);
    			attr_dev(div4, "class", "video-metadata");
    			add_location(div4, file$4, 38, 20, 1410);
    			attr_dev(div5, "class", "video-details svelte-1psj3nw");
    			add_location(div5, file$4, 35, 16, 1203);
    			attr_dev(div6, "class", "video-bottom-section svelte-1psj3nw");
    			add_location(div6, file$4, 27, 12, 807);
    			add_location(section, file$4, 12, 8, 326);
    			attr_dev(div7, "class", "video-container svelte-1psj3nw");
    			add_location(div7, file$4, 11, 4, 287);
    			add_location(main, file$4, 10, 0, 275);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div7);
    			append_dev(div7, section);
    			append_dev(section, div0);
    			append_dev(div0, img0);
    			append_dev(section, t0);
    			append_dev(section, div6);
    			append_dev(div6, div1);
    			append_dev(div1, img1);
    			append_dev(div6, t1);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, t2);
    			append_dev(div5, t3);
    			append_dev(div5, div3);
    			append_dev(div5, t5);
    			append_dev(div5, div4);
    			append_dev(div4, span0);
    			append_dev(div4, t7);
    			append_dev(div4, span1);
    			append_dev(main, t9);
    			mount_component(overlay, main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*video_pic*/ 2 && !src_url_equal(img0.src, img0_src_value = /*video_pic*/ ctx[1] ?? "http://unsplash.it/250/150?gravity=center")) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (!current || dirty & /*title*/ 4) set_data_dev(t2, /*title*/ ctx[2]);

    			if (!current || dirty & /*title*/ 4 && !src_url_equal(div2.src, div2_src_value = /*title*/ ctx[2])) {
    				attr_dev(div2, "src", div2_src_value);
    			}

    			const overlay_changes = {};
    			if (dirty & /*is_fullscreen*/ 16) overlay_changes.opacity = /*is_fullscreen*/ ctx[4] ? 1 : 0.7;
    			if (dirty & /*video_player_is_active*/ 8) overlay_changes.active = /*video_player_is_active*/ ctx[3];

    			if (dirty & /*$$scope, is_fullscreen, video_vid, video_pic, video_player_is_active*/ 1051) {
    				overlay_changes.$$scope = { dirty, ctx };
    			}

    			overlay.$set(overlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(overlay);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler_4 = e => {
    	e.stopPropagation();
    };

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VideoContainer', slots, []);
    	let video_player_is_active = false;
    	let is_fullscreen = false;
    	let { video_vid } = $$props;
    	let { video_pic } = $$props;
    	let { title } = $$props;
    	const writable_props = ['video_vid', 'video_pic', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VideoContainer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(3, video_player_is_active = true);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(3, video_player_is_active = false);
    	};

    	const click_handler_2 = () => {
    		$$invalidate(4, is_fullscreen = !is_fullscreen);

    		// do not focus the fullscreenbutton if clicked
    		// this is because otherwise clicking space will cause
    		// the video player to maximize/minimize instead of pause/play
    		// when space is clicked
    		if (document.activeElement != document.body) document.activeElement.blur();
    	};

    	const click_handler_3 = () => {
    		// do not focus the fullscreenbutton if clicked
    		// this is because otherwise clicking space will cause
    		// the video player to maximize/minimize instead of pause/play
    		// when space is clicked
    		if (document.activeElement != document.body) document.activeElement.blur();

    		let div = document.getElementById("vid");
    		if (div.requestFullscreen) div.requestFullscreen(); else if (div.webkitRequestFullscreen) div.webkitRequestFullscreen(); else if (div.msRequestFullScreen) div.msRequestFullScreen();
    	};

    	const click_handler_5 = () => {
    		$$invalidate(3, video_player_is_active = false);
    	};

    	$$self.$$set = $$props => {
    		if ('video_vid' in $$props) $$invalidate(0, video_vid = $$props.video_vid);
    		if ('video_pic' in $$props) $$invalidate(1, video_pic = $$props.video_pic);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Overlay,
    		Player,
    		video_player_is_active,
    		is_fullscreen,
    		video_vid,
    		video_pic,
    		title
    	});

    	$$self.$inject_state = $$props => {
    		if ('video_player_is_active' in $$props) $$invalidate(3, video_player_is_active = $$props.video_player_is_active);
    		if ('is_fullscreen' in $$props) $$invalidate(4, is_fullscreen = $$props.is_fullscreen);
    		if ('video_vid' in $$props) $$invalidate(0, video_vid = $$props.video_vid);
    		if ('video_pic' in $$props) $$invalidate(1, video_pic = $$props.video_pic);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		video_vid,
    		video_pic,
    		title,
    		video_player_is_active,
    		is_fullscreen,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_5
    	];
    }

    class VideoContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { video_vid: 0, video_pic: 1, title: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VideoContainer",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*video_vid*/ ctx[0] === undefined && !('video_vid' in props)) {
    			console.warn("<VideoContainer> was created without expected prop 'video_vid'");
    		}

    		if (/*video_pic*/ ctx[1] === undefined && !('video_pic' in props)) {
    			console.warn("<VideoContainer> was created without expected prop 'video_pic'");
    		}

    		if (/*title*/ ctx[2] === undefined && !('title' in props)) {
    			console.warn("<VideoContainer> was created without expected prop 'title'");
    		}
    	}

    	get video_vid() {
    		throw new Error("<VideoContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set video_vid(value) {
    		throw new Error("<VideoContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get video_pic() {
    		throw new Error("<VideoContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set video_pic(value) {
    		throw new Error("<VideoContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<VideoContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<VideoContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const info = {
        "ElbenPing":[
            {
                "video_pic": "https://i.ytimg.com/vi/bsmk2VMxS4Q/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/bsmk2VMxS4Q",
                "title": "Elden Lean"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/VjhuL9J006I/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/VjhuL9J006I",
                "title": "Sanic Elden Ring Build"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/t-dNrVNdsFs/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/t-dNrVNdsFs",
                "title": "Elden Ring: Discovering a Dog"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/DYDs_Inzkz4/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/DYDs_Inzkz4",
                "title": "Elden Ring Lore"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/uqcWLx1H_9M/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/uqcWLx1H_9M",
                "title": "Speed Run"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/RYnfiqfYg_A/maxresdefault.jpg",
                "video_vid": "ugly.mp4",
                "title": "Character building"
            }
        ],
        "RickRoll":[
            {
                "video_pic": "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/dQw4w9WgXcQ",
                "title": "Rick Roll"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/pvJ5umdWWoI/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/pvJ5umdWWoI",
                "title": "Minecraft Rick Roll"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/Wia5YZOIG8A/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/Wia5YZOIG8A",
                "title": "Forre Rick Roll"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/D919h2Cri74/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/D919h2Cri74",
                "title": "Always Gonna Give You Up"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/IbFnJFGQpLE/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/IbFnJFGQpLE",
                "title": "rIcK rOlL"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/IsYAOGTHj8Y/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/IsYAOGTHj8Y",
                "title": "Sans Rick Roll"
            }
        ],
        "EarRape":[
            {
                "video_pic": "https://i.ytimg.com/vi/ZpDoyaPvpe0/mqdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/ZpDoyaPvpe0",
                "title": "Un Un Un"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/EMjYgK4j5z4/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/EMjYgK4j5z4",
                "title": "Buzz Lightyear"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/p9RtcklL0as/hqdefault.jpg?sqp=-oaymwEWCKgBEF5IWvKriqkDCQgBFQAAiEIYAQ==&rs=AOn4CLC0lWWsls3hMRNOGh1HErjbeqC6hQ",
                "video_vid": "https://www.youtube.com/embed/p9RtcklL0as",
                "title": "VästKenya"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/j2f6B8e2m0U/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/KvMoU38_zy0",
                "title": "Polish Cow"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/3mfTB5wLTtg/maxresdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/3mfTB5wLTtg",
                "title": "SUIIIIII"
            },
            {
                "video_pic": "https://i.ytimg.com/vi/SZB-Iw6cwQg/mqdefault.jpg",
                "video_vid": "https://www.youtube.com/embed/SZB-Iw6cwQg",
                "title": "Wanna Sprite Cranberry"
            }
        ]
    };

    /* src\ElbenPing.svelte generated by Svelte v3.46.5 */
    const file$3 = "src\\ElbenPing.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let h2;
    	let t1;
    	let videocontainer0;
    	let t2;
    	let videocontainer1;
    	let t3;
    	let videocontainer2;
    	let t4;
    	let videocontainer3;
    	let t5;
    	let videocontainer4;
    	let t6;
    	let videocontainer5;
    	let current;

    	videocontainer0 = new VideoContainer({
    			props: {
    				video_pic: info.ElbenPing[0].video_pic,
    				video_vid: info.ElbenPing[0].video_vid,
    				title: info.ElbenPing[0].title
    			},
    			$$inline: true
    		});

    	videocontainer1 = new VideoContainer({
    			props: {
    				video_pic: info.ElbenPing[1].video_pic,
    				video_vid: info.ElbenPing[1].video_vid,
    				title: info.ElbenPing[1].title
    			},
    			$$inline: true
    		});

    	videocontainer2 = new VideoContainer({
    			props: {
    				video_pic: info.ElbenPing[2].video_pic,
    				video_vid: info.ElbenPing[2].video_vid,
    				title: info.ElbenPing[2].title
    			},
    			$$inline: true
    		});

    	videocontainer3 = new VideoContainer({
    			props: {
    				video_pic: info.ElbenPing[3].video_pic,
    				video_vid: info.ElbenPing[3].video_vid,
    				title: info.ElbenPing[3].title
    			},
    			$$inline: true
    		});

    	videocontainer4 = new VideoContainer({
    			props: {
    				video_pic: info.ElbenPing[4].video_pic,
    				video_vid: info.ElbenPing[4].video_vid,
    				title: info.ElbenPing[4].title
    			},
    			$$inline: true
    		});

    	videocontainer5 = new VideoContainer({
    			props: {
    				video_pic: info.ElbenPing[5].video_pic,
    				video_vid: info.ElbenPing[5].video_vid,
    				title: info.ElbenPing[5].title
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Elben Ping";
    			t1 = space();
    			create_component(videocontainer0.$$.fragment);
    			t2 = space();
    			create_component(videocontainer1.$$.fragment);
    			t3 = space();
    			create_component(videocontainer2.$$.fragment);
    			t4 = space();
    			create_component(videocontainer3.$$.fragment);
    			t5 = space();
    			create_component(videocontainer4.$$.fragment);
    			t6 = space();
    			create_component(videocontainer5.$$.fragment);
    			attr_dev(h2, "class", "video-section-title svelte-ze7thb");
    			add_location(h2, file$3, 6, 2, 152);
    			attr_dev(section, "class", "video-section svelte-ze7thb");
    			add_location(section, file$3, 5, 0, 117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(section, t1);
    			mount_component(videocontainer0, section, null);
    			append_dev(section, t2);
    			mount_component(videocontainer1, section, null);
    			append_dev(section, t3);
    			mount_component(videocontainer2, section, null);
    			append_dev(section, t4);
    			mount_component(videocontainer3, section, null);
    			append_dev(section, t5);
    			mount_component(videocontainer4, section, null);
    			append_dev(section, t6);
    			mount_component(videocontainer5, section, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(videocontainer0.$$.fragment, local);
    			transition_in(videocontainer1.$$.fragment, local);
    			transition_in(videocontainer2.$$.fragment, local);
    			transition_in(videocontainer3.$$.fragment, local);
    			transition_in(videocontainer4.$$.fragment, local);
    			transition_in(videocontainer5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(videocontainer0.$$.fragment, local);
    			transition_out(videocontainer1.$$.fragment, local);
    			transition_out(videocontainer2.$$.fragment, local);
    			transition_out(videocontainer3.$$.fragment, local);
    			transition_out(videocontainer4.$$.fragment, local);
    			transition_out(videocontainer5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(videocontainer0);
    			destroy_component(videocontainer1);
    			destroy_component(videocontainer2);
    			destroy_component(videocontainer3);
    			destroy_component(videocontainer4);
    			destroy_component(videocontainer5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ElbenPing', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ElbenPing> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ VideoContainer, vidinf: info });
    	return [];
    }

    class ElbenPing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ElbenPing",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\RickRoll.svelte generated by Svelte v3.46.5 */
    const file$2 = "src\\RickRoll.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let h2;
    	let t1;
    	let videocontainer0;
    	let t2;
    	let videocontainer1;
    	let t3;
    	let videocontainer2;
    	let t4;
    	let videocontainer3;
    	let t5;
    	let videocontainer4;
    	let t6;
    	let videocontainer5;
    	let current;

    	videocontainer0 = new VideoContainer({
    			props: {
    				video_pic: info.RickRoll[0].video_pic,
    				video_vid: info.RickRoll[0].video_vid,
    				title: info.RickRoll[0].title
    			},
    			$$inline: true
    		});

    	videocontainer1 = new VideoContainer({
    			props: {
    				video_pic: info.RickRoll[1].video_pic,
    				video_vid: info.RickRoll[1].video_vid,
    				title: info.RickRoll[1].title
    			},
    			$$inline: true
    		});

    	videocontainer2 = new VideoContainer({
    			props: {
    				video_pic: info.RickRoll[2].video_pic,
    				video_vid: info.RickRoll[2].video_vid,
    				title: info.RickRoll[2].title
    			},
    			$$inline: true
    		});

    	videocontainer3 = new VideoContainer({
    			props: {
    				video_pic: info.RickRoll[3].video_pic,
    				video_vid: info.RickRoll[3].video_vid,
    				title: info.RickRoll[3].title
    			},
    			$$inline: true
    		});

    	videocontainer4 = new VideoContainer({
    			props: {
    				video_pic: info.RickRoll[4].video_pic,
    				video_vid: info.RickRoll[4].video_vid,
    				title: info.RickRoll[4].title
    			},
    			$$inline: true
    		});

    	videocontainer5 = new VideoContainer({
    			props: {
    				video_pic: info.RickRoll[5].video_pic,
    				video_vid: info.RickRoll[5].video_vid,
    				title: info.RickRoll[5].title
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Rick Roll";
    			t1 = space();
    			create_component(videocontainer0.$$.fragment);
    			t2 = space();
    			create_component(videocontainer1.$$.fragment);
    			t3 = space();
    			create_component(videocontainer2.$$.fragment);
    			t4 = space();
    			create_component(videocontainer3.$$.fragment);
    			t5 = space();
    			create_component(videocontainer4.$$.fragment);
    			t6 = space();
    			create_component(videocontainer5.$$.fragment);
    			attr_dev(h2, "class", "video-section-title svelte-ze7thb");
    			add_location(h2, file$2, 6, 2, 152);
    			attr_dev(section, "class", "video-section svelte-ze7thb");
    			add_location(section, file$2, 5, 0, 117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(section, t1);
    			mount_component(videocontainer0, section, null);
    			append_dev(section, t2);
    			mount_component(videocontainer1, section, null);
    			append_dev(section, t3);
    			mount_component(videocontainer2, section, null);
    			append_dev(section, t4);
    			mount_component(videocontainer3, section, null);
    			append_dev(section, t5);
    			mount_component(videocontainer4, section, null);
    			append_dev(section, t6);
    			mount_component(videocontainer5, section, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(videocontainer0.$$.fragment, local);
    			transition_in(videocontainer1.$$.fragment, local);
    			transition_in(videocontainer2.$$.fragment, local);
    			transition_in(videocontainer3.$$.fragment, local);
    			transition_in(videocontainer4.$$.fragment, local);
    			transition_in(videocontainer5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(videocontainer0.$$.fragment, local);
    			transition_out(videocontainer1.$$.fragment, local);
    			transition_out(videocontainer2.$$.fragment, local);
    			transition_out(videocontainer3.$$.fragment, local);
    			transition_out(videocontainer4.$$.fragment, local);
    			transition_out(videocontainer5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(videocontainer0);
    			destroy_component(videocontainer1);
    			destroy_component(videocontainer2);
    			destroy_component(videocontainer3);
    			destroy_component(videocontainer4);
    			destroy_component(videocontainer5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RickRoll', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RickRoll> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ VideoContainer, vidinf: info });
    	return [];
    }

    class RickRoll extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RickRoll",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\LoudFunny.svelte generated by Svelte v3.46.5 */
    const file$1 = "src\\LoudFunny.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let h2;
    	let t1;
    	let videocontainer0;
    	let t2;
    	let videocontainer1;
    	let t3;
    	let videocontainer2;
    	let t4;
    	let videocontainer3;
    	let t5;
    	let videocontainer4;
    	let t6;
    	let videocontainer5;
    	let current;

    	videocontainer0 = new VideoContainer({
    			props: {
    				video_pic: info.EarRape[0].video_pic,
    				video_vid: info.EarRape[0].video_vid,
    				title: info.EarRape[0].title
    			},
    			$$inline: true
    		});

    	videocontainer1 = new VideoContainer({
    			props: {
    				video_pic: info.EarRape[1].video_pic,
    				video_vid: info.EarRape[1].video_vid,
    				title: info.EarRape[1].title
    			},
    			$$inline: true
    		});

    	videocontainer2 = new VideoContainer({
    			props: {
    				video_pic: info.EarRape[2].video_pic,
    				video_vid: info.EarRape[2].video_vid,
    				title: info.EarRape[2].title
    			},
    			$$inline: true
    		});

    	videocontainer3 = new VideoContainer({
    			props: {
    				video_pic: info.EarRape[3].video_pic,
    				video_vid: info.EarRape[3].video_vid,
    				title: info.EarRape[3].title
    			},
    			$$inline: true
    		});

    	videocontainer4 = new VideoContainer({
    			props: {
    				video_pic: info.EarRape[4].video_pic,
    				video_vid: info.EarRape[4].video_vid,
    				title: info.EarRape[4].title
    			},
    			$$inline: true
    		});

    	videocontainer5 = new VideoContainer({
    			props: {
    				video_pic: info.EarRape[5].video_pic,
    				video_vid: info.EarRape[5].video_vid,
    				title: info.EarRape[5].title
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Loud and Funny";
    			t1 = space();
    			create_component(videocontainer0.$$.fragment);
    			t2 = space();
    			create_component(videocontainer1.$$.fragment);
    			t3 = space();
    			create_component(videocontainer2.$$.fragment);
    			t4 = space();
    			create_component(videocontainer3.$$.fragment);
    			t5 = space();
    			create_component(videocontainer4.$$.fragment);
    			t6 = space();
    			create_component(videocontainer5.$$.fragment);
    			attr_dev(h2, "class", "video-section-title svelte-ze7thb");
    			add_location(h2, file$1, 6, 2, 152);
    			attr_dev(section, "class", "video-section svelte-ze7thb");
    			add_location(section, file$1, 5, 0, 117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(section, t1);
    			mount_component(videocontainer0, section, null);
    			append_dev(section, t2);
    			mount_component(videocontainer1, section, null);
    			append_dev(section, t3);
    			mount_component(videocontainer2, section, null);
    			append_dev(section, t4);
    			mount_component(videocontainer3, section, null);
    			append_dev(section, t5);
    			mount_component(videocontainer4, section, null);
    			append_dev(section, t6);
    			mount_component(videocontainer5, section, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(videocontainer0.$$.fragment, local);
    			transition_in(videocontainer1.$$.fragment, local);
    			transition_in(videocontainer2.$$.fragment, local);
    			transition_in(videocontainer3.$$.fragment, local);
    			transition_in(videocontainer4.$$.fragment, local);
    			transition_in(videocontainer5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(videocontainer0.$$.fragment, local);
    			transition_out(videocontainer1.$$.fragment, local);
    			transition_out(videocontainer2.$$.fragment, local);
    			transition_out(videocontainer3.$$.fragment, local);
    			transition_out(videocontainer4.$$.fragment, local);
    			transition_out(videocontainer5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(videocontainer0);
    			destroy_component(videocontainer1);
    			destroy_component(videocontainer2);
    			destroy_component(videocontainer3);
    			destroy_component(videocontainer4);
    			destroy_component(videocontainer5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoudFunny', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoudFunny> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ VideoContainer, vidinf: info });
    	return [];
    }

    class LoudFunny extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoudFunny",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.5 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let ul;
    	let li0;
    	let t1;
    	let li1;
    	let t2;
    	let li2;
    	let t3;
    	let li3;
    	let t4;
    	let li4;
    	let t5;
    	let li5;
    	let t6;
    	let li6;
    	let t7;
    	let li7;
    	let t8;
    	let li8;
    	let t9;
    	let li9;
    	let t10;
    	let div1;
    	let elbenping;
    	let t11;
    	let rickroll;
    	let t12;
    	let loudfunny;
    	let current;
    	elbenping = new ElbenPing({ $$inline: true });
    	rickroll = new RickRoll({ $$inline: true });
    	loudfunny = new LoudFunny({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			t1 = space();
    			li1 = element("li");
    			t2 = space();
    			li2 = element("li");
    			t3 = space();
    			li3 = element("li");
    			t4 = space();
    			li4 = element("li");
    			t5 = space();
    			li5 = element("li");
    			t6 = space();
    			li6 = element("li");
    			t7 = space();
    			li7 = element("li");
    			t8 = space();
    			li8 = element("li");
    			t9 = space();
    			li9 = element("li");
    			t10 = space();
    			div1 = element("div");
    			create_component(elbenping.$$.fragment);
    			t11 = space();
    			create_component(rickroll.$$.fragment);
    			t12 = space();
    			create_component(loudfunny.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "YouTube Logo");
    			attr_dev(img, "class", "youtube-logo svelte-tlkyfw");
    			add_location(img, file, 8, 2, 187);
    			attr_dev(header, "class", "header svelte-tlkyfw");
    			add_location(header, file, 7, 1, 161);
    			attr_dev(li0, "class", "svelte-tlkyfw");
    			add_location(li0, file, 13, 3, 308);
    			attr_dev(li1, "class", "svelte-tlkyfw");
    			add_location(li1, file, 14, 3, 318);
    			attr_dev(li2, "class", "svelte-tlkyfw");
    			add_location(li2, file, 15, 3, 328);
    			attr_dev(li3, "class", "svelte-tlkyfw");
    			add_location(li3, file, 16, 3, 338);
    			attr_dev(li4, "class", "svelte-tlkyfw");
    			add_location(li4, file, 17, 3, 348);
    			attr_dev(li5, "class", "svelte-tlkyfw");
    			add_location(li5, file, 18, 3, 358);
    			attr_dev(li6, "class", "svelte-tlkyfw");
    			add_location(li6, file, 19, 3, 368);
    			attr_dev(li7, "class", "svelte-tlkyfw");
    			add_location(li7, file, 20, 3, 378);
    			attr_dev(li8, "class", "svelte-tlkyfw");
    			add_location(li8, file, 21, 3, 388);
    			attr_dev(li9, "class", "svelte-tlkyfw");
    			add_location(li9, file, 22, 3, 398);
    			attr_dev(ul, "class", "circles svelte-tlkyfw");
    			add_location(ul, file, 12, 2, 284);
    			attr_dev(div0, "class", "area svelte-tlkyfw");
    			add_location(div0, file, 11, 1, 263);
    			attr_dev(div1, "class", "videos svelte-tlkyfw");
    			add_location(div1, file, 25, 1, 422);
    			attr_dev(main, "class", "svelte-tlkyfw");
    			add_location(main, file, 6, 0, 153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, img);
    			append_dev(main, t0);
    			append_dev(main, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(ul, t2);
    			append_dev(ul, li2);
    			append_dev(ul, t3);
    			append_dev(ul, li3);
    			append_dev(ul, t4);
    			append_dev(ul, li4);
    			append_dev(ul, t5);
    			append_dev(ul, li5);
    			append_dev(ul, t6);
    			append_dev(ul, li6);
    			append_dev(ul, t7);
    			append_dev(ul, li7);
    			append_dev(ul, t8);
    			append_dev(ul, li8);
    			append_dev(ul, t9);
    			append_dev(ul, li9);
    			append_dev(main, t10);
    			append_dev(main, div1);
    			mount_component(elbenping, div1, null);
    			append_dev(div1, t11);
    			mount_component(rickroll, div1, null);
    			append_dev(div1, t12);
    			mount_component(loudfunny, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(elbenping.$$.fragment, local);
    			transition_in(rickroll.$$.fragment, local);
    			transition_in(loudfunny.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(elbenping.$$.fragment, local);
    			transition_out(rickroll.$$.fragment, local);
    			transition_out(loudfunny.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(elbenping);
    			destroy_component(rickroll);
    			destroy_component(loudfunny);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ElbenPing, RickRoll, LoudFunny });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
