
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
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
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
        return style_element;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
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
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
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
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    class Clock{
        
        constructor(hour, minute){
            (hour >= 0 && hour < 24) ? this._hour = hour : console.log("Fuckery at hourmark, value must be between 0 and 24");
            (minute >= 0 && minute < 60) ? this._minute = minute : console.log("Fuckery at minutemark, value must be between 0 and 60");
            this.alarmIsActive = true;
            this.alarmIsTrigger = false;
            this.setAlarm(14, 0);
        }
      
        setAlarm(hour, minute){
            this._hourAlarm = hour;
            this._minuteAlarm = minute;
        }
        set setAlarmFromString(string){
            this._hourAlarm = string.split(":")[0]; //takes the first value of the total time value, 13:56, takes "13"
            this._minuteAlarm = string.split(":")[1]; //takes the second value of the total time value, 13:56, takes "56"
            this.alarmIsTrigger = false;
            
        }
        get setAlarmFromString(){
            return this.alarmTime;
        }
        activateAlarm(){
            this.alarmIsActive = true;
        }

        deactivateAlarm(){
            this.alarmIsActive = false;
        }

        toggleAlarm(){
            this.alarmIsTrigger = false;
        }

        get time(){
            return {"hour": this._hour.toString().padStart(2, '0'),
            "minute": this._minute.toString().padStart(2, '0')
            }
        }

        get alarmTime(){
            return this._hourAlarm.toString().padStart(2, '0') + ':' + this._minuteAlarm.toString().padStart(2, '0');
        }

        tick(){
            this._minute += 1;

            if(this._minute >= 60){
                this._minute = 0;
                this._hour += 1;
            }

            if(this._hour >= 24){
                this._hour = 0;
            }

            let hourPrefix = (this._hour < 10) ? "0"+this._hour : this._hour;
            let minutePrefix = (this._minute < 10) ? "0"+this._minute : this._minute;
            console.log(hourPrefix + ":" + minutePrefix); //writes time without fuckery;

            if(this.alarmIsActive && this._hour == this._hourAlarm && this._minute == this._minuteAlarm){
                console.log("Alarm!!!");
                this.alarmIsTrigger = true;
            }
        }
        

    }

    /* src\fill-clock.svelte generated by Svelte v3.44.1 */

    const file$1 = "src\\fill-clock.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div2;
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "text svelte-1ebfbax");
    			add_location(div0, file$1, 6, 10, 94);
    			attr_dev(div1, "class", "bg svelte-1ebfbax");
    			add_location(div1, file$1, 5, 8, 66);
    			attr_dev(div2, "class", "wrapper");
    			add_location(div2, file$1, 4, 4, 35);
    			add_location(main, file$1, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
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

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Fill_clock', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Fill_clock> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Fill_clock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fill_clock",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        let len = node.getTotalLength();
        const style = getComputedStyle(node);
        if (style.strokeLinecap !== 'butt') {
            len += parseInt(style.strokeWidth);
        }
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\App.svelte generated by Svelte v3.44.1 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (37:2) {:else}
    function create_else_block_2(ctx) {
    	let t0;
    	let t1_value = /*clock*/ ctx[0].alarmTime + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Alarm: ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*clock*/ 1 && t1_value !== (t1_value = /*clock*/ ctx[0].alarmTime + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(37:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:2) {#if clock.alarmIsTrigger == true}
    function create_if_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("WAKE UP!!");
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
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(35:2) {#if clock.alarmIsTrigger == true}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#key clock.time.hour}
    function create_key_block_1(ctx) {
    	let span;
    	let t_value = /*clock*/ ctx[0].time.hour + "";
    	let t;
    	let span_intro;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-o8tujw");
    			add_location(span, file, 42, 12, 1139);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*clock*/ 1 && t_value !== (t_value = /*clock*/ ctx[0].time.hour + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (!span_intro) {
    				add_render_callback(() => {
    					span_intro = create_in_transition(span, fly, { y: -20 });
    					span_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block_1.name,
    		type: "key",
    		source: "(42:8) {#key clock.time.hour}",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#key clock.time.minute}
    function create_key_block(ctx) {
    	let span;
    	let t_value = /*clock*/ ctx[0].time.minute + "";
    	let t;
    	let span_intro;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-o8tujw");
    			add_location(span, file, 48, 12, 1303);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*clock*/ 1 && t_value !== (t_value = /*clock*/ ctx[0].time.minute + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (!span_intro) {
    				add_render_callback(() => {
    					span_intro = create_in_transition(span, fly, { y: -20 });
    					span_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(48:8) {#key clock.time.minute}",
    		ctx
    	});

    	return block;
    }

    // (64:3) {:else}
    function create_else_block_1(ctx) {
    	let t0;
    	let t1_value = /*clock*/ ctx[0].alarmTime + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Alarm: ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*clock*/ 1 && t1_value !== (t1_value = /*clock*/ ctx[0].alarmTime + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(64:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (62:3) {#if clock.alarmIsTrigger == true}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("WAKE UP!!");
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(62:3) {#if clock.alarmIsTrigger == true}",
    		ctx
    	});

    	return block;
    }

    // (73:5) {#each [1, 2, 3, 4] as offset}
    function create_each_block_1(ctx) {
    	let line;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "minor svelte-o8tujw");
    			attr_dev(line, "y1", "42");
    			attr_dev(line, "y2", "45");
    			attr_dev(line, "transform", "rotate(" + 6 * (/*minute*/ ctx[13] + /*offset*/ ctx[16]) + ")");
    			add_location(line, file, 73, 6, 2078);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(73:5) {#each [1, 2, 3, 4] as offset}",
    		ctx
    	});

    	return block;
    }

    // (71:4) {#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}
    function create_each_block(ctx) {
    	let line;
    	let each_1_anchor;
    	let each_value_1 = [1, 2, 3, 4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			line = svg_element("line");

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(line, "class", "major svelte-o8tujw");
    			attr_dev(line, "y1", "40");
    			attr_dev(line, "y2", "45");
    			attr_dev(line, "transform", "rotate(" + 30 * /*minute*/ ctx[13] + ")");
    			add_location(line, file, 71, 5, 1963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(71:4) {#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as minute}",
    		ctx
    	});

    	return block;
    }

    // (102:4) {:else}
    function create_else_block(ctx) {
    	let t0;
    	let t1_value = /*clock*/ ctx[0].alarmTime + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text("Alarm: ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*clock*/ 1 && t1_value !== (t1_value = /*clock*/ ctx[0].alarmTime + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(102:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:4) {#if clock.alarmIsTrigger == true}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("WAKE UP!!");
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
    		id: create_if_block.name,
    		type: "if",
    		source: "(100:4) {#if clock.alarmIsTrigger == true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div7;
    	let div2;
    	let div1;
    	let h30;
    	let t0;
    	let div0;
    	let previous_key = /*clock*/ ctx[0].time.hour;
    	let t1;
    	let span;
    	let t3;
    	let previous_key_1 = /*clock*/ ctx[0].time.minute;
    	let t4;
    	let button0;
    	let t6;
    	let input0;
    	let t7;
    	let p0;
    	let t8;
    	let p1;
    	let t9;
    	let div4;
    	let h31;
    	let t10;
    	let cir;
    	let svg0;
    	let circle;
    	let line0;
    	let line0_transform_value;
    	let g;
    	let line1;
    	let g_transform_value;
    	let t11;
    	let div3;
    	let button1;
    	let t13;
    	let input1;
    	let t14;
    	let div6;
    	let h32;
    	let t15;
    	let rec;
    	let svg1;
    	let rect0;
    	let rect1;
    	let rect1_height_value;
    	let rect2;
    	let rect2_height_value;
    	let t16;
    	let p2;
    	let t17;
    	let div5;
    	let button2;
    	let t19;
    	let input2;
    	let t20;
    	let p3;
    	let t21;
    	let p4;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*clock*/ ctx[0].alarmIsTrigger == true) return create_if_block_2;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let key_block0 = create_key_block_1(ctx);
    	let key_block1 = create_key_block(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*clock*/ ctx[0].alarmIsTrigger == true) return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);
    	let each_value = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 12; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	function select_block_type_2(ctx, dirty) {
    		if (/*clock*/ ctx[0].alarmIsTrigger == true) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type_2 = select_block_type_2(ctx);
    	let if_block2 = current_block_type_2(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div7 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			h30 = element("h3");
    			if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			key_block0.c();
    			t1 = space();
    			span = element("span");
    			span.textContent = ":";
    			t3 = space();
    			key_block1.c();
    			t4 = space();
    			button0 = element("button");
    			button0.textContent = "ToggleAlarm";
    			t6 = space();
    			input0 = element("input");
    			t7 = space();
    			p0 = element("p");
    			t8 = space();
    			p1 = element("p");
    			t9 = space();
    			div4 = element("div");
    			h31 = element("h3");
    			if_block1.c();
    			t10 = space();
    			cir = element("cir");
    			svg0 = svg_element("svg");
    			circle = svg_element("circle");

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].c();
    			}

    			line0 = svg_element("line");
    			g = svg_element("g");
    			line1 = svg_element("line");
    			t11 = space();
    			div3 = element("div");
    			button1 = element("button");
    			button1.textContent = "ToggleAlarm";
    			t13 = space();
    			input1 = element("input");
    			t14 = space();
    			div6 = element("div");
    			h32 = element("h3");
    			if_block2.c();
    			t15 = space();
    			rec = element("rec");
    			svg1 = svg_element("svg");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			rect2 = svg_element("rect");
    			t16 = space();
    			p2 = element("p");
    			t17 = space();
    			div5 = element("div");
    			button2 = element("button");
    			button2.textContent = "ToggleAlarm";
    			t19 = space();
    			input2 = element("input");
    			t20 = space();
    			p3 = element("p");
    			t21 = space();
    			p4 = element("p");
    			attr_dev(h30, "class", "svelte-o8tujw");
    			add_location(h30, file, 33, 1, 981);
    			attr_dev(span, "class", "svelte-o8tujw");
    			add_location(span, file, 46, 8, 1243);
    			add_location(div0, file, 40, 1, 1090);
    			attr_dev(button0, "class", "button-3d svelte-o8tujw");
    			attr_dev(button0, "id", "C-button1");
    			add_location(button0, file, 53, 1, 1413);
    			attr_dev(input0, "type", "time");
    			add_location(input0, file, 54, 2, 1516);
    			attr_dev(p0, "id", "time");
    			attr_dev(p0, "class", "svelte-o8tujw");
    			add_location(p0, file, 55, 1, 1575);
    			attr_dev(p1, "id", "alarm");
    			attr_dev(p1, "class", "svelte-o8tujw");
    			add_location(p1, file, 56, 1, 1592);
    			add_location(div1, file, 32, 1, 974);
    			attr_dev(div2, "class", "column svelte-o8tujw");
    			add_location(div2, file, 31, 1, 952);
    			attr_dev(h31, "class", "svelte-o8tujw");
    			add_location(h31, file, 60, 2, 1650);
    			attr_dev(circle, "class", "clock-face svelte-o8tujw");
    			attr_dev(circle, "r", "48");
    			add_location(circle, file, 68, 4, 1831);
    			attr_dev(line0, "class", "hour svelte-o8tujw");
    			attr_dev(line0, "y1", "33");
    			attr_dev(line0, "y2", "38");
    			attr_dev(line0, "transform", line0_transform_value = "rotate(" + (6 / 12 * /*$minutes*/ ctx[3] - 180) + ")");
    			add_location(line0, file, 82, 4, 2247);
    			attr_dev(line1, "class", "minute svelte-o8tujw");
    			attr_dev(line1, "y1", "30");
    			attr_dev(line1, "y2", "38");
    			add_location(line1, file, 90, 5, 2436);
    			attr_dev(g, "transform", g_transform_value = "rotate(" + (6 * /*$minutes*/ ctx[3] - 180) + ")");
    			add_location(g, file, 89, 4, 2386);
    			attr_dev(svg0, "viewBox", "-50 -50 100 100");
    			set_style(svg0, "height", "inherit");
    			attr_dev(svg0, "class", "svelte-o8tujw");
    			add_location(svg0, file, 67, 3, 1772);
    			attr_dev(cir, "class", "svelte-o8tujw");
    			add_location(cir, file, 66, 2, 1763);
    			attr_dev(button1, "class", "button-3d svelte-o8tujw");
    			attr_dev(button1, "id", "C-button2");
    			add_location(button1, file, 94, 7, 2511);
    			attr_dev(input1, "type", "time");
    			add_location(input1, file, 95, 3, 2615);
    			add_location(div3, file, 94, 2, 2506);
    			attr_dev(div4, "class", "column svelte-o8tujw");
    			add_location(div4, file, 59, 1, 1626);
    			attr_dev(h32, "class", "svelte-o8tujw");
    			add_location(h32, file, 98, 3, 2715);
    			attr_dev(rect0, "width", "100%");
    			attr_dev(rect0, "height", "100%");
    			set_style(rect0, "fill", "rgb(79,79,79)");
    			set_style(rect0, "stroke-height", "1");
    			set_style(rect0, "stroke", "rgb(0,0,0)");
    			add_location(rect0, file, 107, 5, 2905);
    			attr_dev(rect1, "height", rect1_height_value = "" + (/*clock*/ ctx[0].time.minute / 60 * 100 + "%"));
    			attr_dev(rect1, "width", "50%");
    			set_style(rect1, "fill", "rgb(0,0,0)");
    			set_style(rect1, "stroke-height", "1");
    			set_style(rect1, "stroke", "rgb(0,0,0)");
    			add_location(rect1, file, 108, 5, 3007);
    			attr_dev(rect2, "height", rect2_height_value = "" + (/*clock*/ ctx[0].time.minute / 60 + /*clock*/ ctx[0].time.hour / 24 * 100 + "%"));
    			attr_dev(rect2, "width", "50%");
    			attr_dev(rect2, "x", "50%");
    			set_style(rect2, "fill", "rgb(0,0,0)");
    			set_style(rect2, "stroke-height", "1");
    			set_style(rect2, "stroke", "rgb(0,0,0)");
    			add_location(rect2, file, 109, 5, 3132);
    			attr_dev(svg1, "width", "20");
    			attr_dev(svg1, "height", "10");
    			set_style(svg1, "height", "inherit");
    			attr_dev(svg1, "class", "svelte-o8tujw");
    			add_location(svg1, file, 106, 4, 2848);
    			attr_dev(rec, "class", "svelte-o8tujw");
    			add_location(rec, file, 105, 3, 2838);
    			attr_dev(p2, "class", "svelte-o8tujw");
    			add_location(p2, file, 112, 3, 3305);
    			attr_dev(button2, "class", "button-3d svelte-o8tujw");
    			attr_dev(button2, "id", "C-button2");
    			add_location(button2, file, 115, 8, 3354);
    			attr_dev(input2, "type", "time");
    			add_location(input2, file, 116, 4, 3459);
    			add_location(div5, file, 115, 3, 3349);
    			attr_dev(p3, "id", "time");
    			attr_dev(p3, "class", "svelte-o8tujw");
    			add_location(p3, file, 117, 3, 3527);
    			attr_dev(p4, "id", "alarm");
    			attr_dev(p4, "class", "svelte-o8tujw");
    			add_location(p4, file, 118, 3, 3546);
    			attr_dev(div6, "class", "column svelte-o8tujw");
    			add_location(div6, file, 97, 2, 2691);
    			attr_dev(div7, "class", "grid-container svelte-o8tujw");
    			add_location(div7, file, 30, 0, 922);
    			attr_dev(main, "class", "svelte-o8tujw");
    			add_location(main, file, 29, 0, 915);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div7);
    			append_dev(div7, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h30);
    			if_block0.m(h30, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			key_block0.m(div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, span);
    			append_dev(div0, t3);
    			key_block1.m(div0, null);
    			append_dev(div1, t4);
    			append_dev(div1, button0);
    			append_dev(div1, t6);
    			append_dev(div1, input0);
    			set_input_value(input0, /*clock*/ ctx[0].setAlarmFromString);
    			append_dev(div1, t7);
    			append_dev(div1, p0);
    			append_dev(div1, t8);
    			append_dev(div1, p1);
    			append_dev(div7, t9);
    			append_dev(div7, div4);
    			append_dev(div4, h31);
    			if_block1.m(h31, null);
    			append_dev(div4, t10);
    			append_dev(div4, cir);
    			append_dev(cir, svg0);
    			append_dev(svg0, circle);

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].m(svg0, null);
    			}

    			append_dev(svg0, line0);
    			append_dev(svg0, g);
    			append_dev(g, line1);
    			append_dev(div4, t11);
    			append_dev(div4, div3);
    			append_dev(div3, button1);
    			append_dev(div3, t13);
    			append_dev(div3, input1);
    			set_input_value(input1, /*clock*/ ctx[0].setAlarmFromString);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, h32);
    			if_block2.m(h32, null);
    			append_dev(div6, t15);
    			append_dev(div6, rec);
    			append_dev(rec, svg1);
    			append_dev(svg1, rect0);
    			append_dev(svg1, rect1);
    			append_dev(svg1, rect2);
    			append_dev(div6, t16);
    			append_dev(div6, p2);
    			append_dev(div6, t17);
    			append_dev(div6, div5);
    			append_dev(div5, button2);
    			append_dev(div5, t19);
    			append_dev(div5, input2);
    			set_input_value(input2, /*clock*/ ctx[0].setAlarmFromString);
    			append_dev(div6, t20);
    			append_dev(div6, p3);
    			append_dev(div6, t21);
    			append_dev(div6, p4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[6], false, false, false),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[7]),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[8], false, false, false),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(h30, null);
    				}
    			}

    			if (dirty & /*clock*/ 1 && safe_not_equal(previous_key, previous_key = /*clock*/ ctx[0].time.hour)) {
    				group_outros();
    				transition_out(key_block0, 1, 1, noop);
    				check_outros();
    				key_block0 = create_key_block_1(ctx);
    				key_block0.c();
    				transition_in(key_block0);
    				key_block0.m(div0, t1);
    			} else {
    				key_block0.p(ctx, dirty);
    			}

    			if (dirty & /*clock*/ 1 && safe_not_equal(previous_key_1, previous_key_1 = /*clock*/ ctx[0].time.minute)) {
    				group_outros();
    				transition_out(key_block1, 1, 1, noop);
    				check_outros();
    				key_block1 = create_key_block(ctx);
    				key_block1.c();
    				transition_in(key_block1);
    				key_block1.m(div0, null);
    			} else {
    				key_block1.p(ctx, dirty);
    			}

    			if (dirty & /*clock*/ 1) {
    				set_input_value(input0, /*clock*/ ctx[0].setAlarmFromString);
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(h31, null);
    				}
    			}

    			if (dirty & /*$minutes*/ 8 && line0_transform_value !== (line0_transform_value = "rotate(" + (6 / 12 * /*$minutes*/ ctx[3] - 180) + ")")) {
    				attr_dev(line0, "transform", line0_transform_value);
    			}

    			if (dirty & /*$minutes*/ 8 && g_transform_value !== (g_transform_value = "rotate(" + (6 * /*$minutes*/ ctx[3] - 180) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}

    			if (dirty & /*clock*/ 1) {
    				set_input_value(input1, /*clock*/ ctx[0].setAlarmFromString);
    			}

    			if (current_block_type_2 === (current_block_type_2 = select_block_type_2(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type_2(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(h32, null);
    				}
    			}

    			if (dirty & /*clock*/ 1 && rect1_height_value !== (rect1_height_value = "" + (/*clock*/ ctx[0].time.minute / 60 * 100 + "%"))) {
    				attr_dev(rect1, "height", rect1_height_value);
    			}

    			if (dirty & /*clock*/ 1 && rect2_height_value !== (rect2_height_value = "" + (/*clock*/ ctx[0].time.minute / 60 + /*clock*/ ctx[0].time.hour / 24 * 100 + "%"))) {
    				attr_dev(rect2, "height", rect2_height_value);
    			}

    			if (dirty & /*clock*/ 1) {
    				set_input_value(input2, /*clock*/ ctx[0].setAlarmFromString);
    			}
    		},
    		i: function intro(local) {
    			transition_in(key_block0);
    			transition_in(key_block1);
    		},
    		o: function outro(local) {
    			transition_out(key_block0);
    			transition_out(key_block1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block0.d();
    			key_block0.d(detaching);
    			key_block1.d(detaching);
    			if_block1.d();
    			destroy_each(each_blocks, detaching);
    			if_block2.d();
    			mounted = false;
    			run_all(dispose);
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
    	let $hours,
    		$$unsubscribe_hours = noop,
    		$$subscribe_hours = () => ($$unsubscribe_hours(), $$unsubscribe_hours = subscribe(hours, $$value => $$invalidate(10, $hours = $$value)), hours);

    	let $minutes,
    		$$unsubscribe_minutes = noop,
    		$$subscribe_minutes = () => ($$unsubscribe_minutes(), $$unsubscribe_minutes = subscribe(minutes, $$value => $$invalidate(3, $minutes = $$value)), minutes);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_hours());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_minutes());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let clock = new Clock(23, 50);
    	let i = 0;
    	let hours = spring();
    	validate_store(hours, 'hours');
    	$$subscribe_hours();
    	let minutes = spring();
    	validate_store(minutes, 'minutes');
    	$$subscribe_minutes();
    	set_store_value(minutes, $minutes = parseInt(clock.time.hour) * 60 + parseInt(clock.time.minute), $minutes);
    	set_store_value(hours, $hours = parseInt(clock.time.hour), $hours);

    	function tick() {
    		clock.tick();
    		$$invalidate(0, clock);

    		if (clock.time.hour + clock.time.minute == 0) {
    			$$subscribe_hours($$invalidate(1, hours = spring()));
    			$$subscribe_minutes($$invalidate(2, minutes = spring()));
    			set_store_value(minutes, $minutes = parseInt(clock.time.hour) * 60 + parseInt(clock.time.minute), $minutes);
    			set_store_value(hours, $hours = parseInt(clock.time.hour), $hours);
    		} else {
    			hours.set(parseInt(clock.time.hour));
    			minutes.set(parseInt(clock.time.hour) * 60 + parseInt(clock.time.minute));
    		}
    	}

    	setInterval(tick, 1000);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => clock.toggleAlarm();

    	function input0_input_handler() {
    		clock.setAlarmFromString = this.value;
    		$$invalidate(0, clock);
    	}

    	const click_handler_1 = () => clock.toggleAlarm();

    	function input1_input_handler() {
    		clock.setAlarmFromString = this.value;
    		$$invalidate(0, clock);
    	}

    	const click_handler_2 = () => clock.toggleAlarm();

    	function input2_input_handler() {
    		clock.setAlarmFromString = this.value;
    		$$invalidate(0, clock);
    	}

    	$$self.$capture_state = () => ({
    		Clock,
    		FillClock: Fill_clock,
    		fly,
    		fade,
    		slide,
    		draw,
    		spring,
    		tweened,
    		clock,
    		i,
    		hours,
    		minutes,
    		tick,
    		$hours,
    		$minutes
    	});

    	$$self.$inject_state = $$props => {
    		if ('clock' in $$props) $$invalidate(0, clock = $$props.clock);
    		if ('i' in $$props) i = $$props.i;
    		if ('hours' in $$props) $$subscribe_hours($$invalidate(1, hours = $$props.hours));
    		if ('minutes' in $$props) $$subscribe_minutes($$invalidate(2, minutes = $$props.minutes));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		clock,
    		hours,
    		minutes,
    		$minutes,
    		click_handler,
    		input0_input_handler,
    		click_handler_1,
    		input1_input_handler,
    		click_handler_2,
    		input2_input_handler
    	];
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

    var app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
