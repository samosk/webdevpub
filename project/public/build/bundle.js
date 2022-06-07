
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function append(target, node) {
        target.appendChild(node);
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
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
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
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
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
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

    const info = {
        "Nature":[{
            "picture": "https://cutewallpaper.org/23/1920x1080-simple-wallpaper/2816532261.jpg",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        }],
        "Minimal":[{
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        },
        {
            "picture": "src",
            "desc": "text",
            "auth": "name"
        }]
    };

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let img3;
    	let img3_src_value;
    	let t3;
    	let img4;
    	let img4_src_value;
    	let t4;
    	let img5;
    	let img5_src_value;
    	let t5;
    	let img6;
    	let img6_src_value;
    	let t6;
    	let img7;
    	let img7_src_value;
    	let t7;
    	let img8;
    	let img8_src_value;
    	let t8;
    	let img9;
    	let img9_src_value;
    	let t9;
    	let img10;
    	let img10_src_value;
    	let t10;
    	let img11;
    	let img11_src_value;
    	let t11;
    	let img12;
    	let img12_src_value;
    	let t12;
    	let img13;
    	let img13_src_value;
    	let t13;
    	let img14;
    	let img14_src_value;
    	let t14;
    	let img15;
    	let img15_src_value;
    	let t15;
    	let div1;
    	let img16;
    	let img16_src_value;
    	let t16;
    	let img17;
    	let img17_src_value;
    	let t17;
    	let img18;
    	let img18_src_value;
    	let t18;
    	let img19;
    	let img19_src_value;
    	let t19;
    	let img20;
    	let img20_src_value;
    	let t20;
    	let img21;
    	let img21_src_value;
    	let t21;
    	let img22;
    	let img22_src_value;
    	let t22;
    	let img23;
    	let img23_src_value;
    	let t23;
    	let img24;
    	let img24_src_value;
    	let t24;
    	let img25;
    	let img25_src_value;
    	let t25;
    	let img26;
    	let img26_src_value;
    	let t26;
    	let img27;
    	let img27_src_value;
    	let t27;
    	let img28;
    	let img28_src_value;
    	let t28;
    	let img29;
    	let img29_src_value;
    	let t29;
    	let img30;
    	let img30_src_value;
    	let t30;
    	let img31;
    	let img31_src_value;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			img2 = element("img");
    			t2 = space();
    			img3 = element("img");
    			t3 = space();
    			img4 = element("img");
    			t4 = space();
    			img5 = element("img");
    			t5 = space();
    			img6 = element("img");
    			t6 = space();
    			img7 = element("img");
    			t7 = space();
    			img8 = element("img");
    			t8 = space();
    			img9 = element("img");
    			t9 = space();
    			img10 = element("img");
    			t10 = space();
    			img11 = element("img");
    			t11 = space();
    			img12 = element("img");
    			t12 = space();
    			img13 = element("img");
    			t13 = space();
    			img14 = element("img");
    			t14 = space();
    			img15 = element("img");
    			t15 = space();
    			div1 = element("div");
    			img16 = element("img");
    			t16 = space();
    			img17 = element("img");
    			t17 = space();
    			img18 = element("img");
    			t18 = space();
    			img19 = element("img");
    			t19 = space();
    			img20 = element("img");
    			t20 = space();
    			img21 = element("img");
    			t21 = space();
    			img22 = element("img");
    			t22 = space();
    			img23 = element("img");
    			t23 = space();
    			img24 = element("img");
    			t24 = space();
    			img25 = element("img");
    			t25 = space();
    			img26 = element("img");
    			t26 = space();
    			img27 = element("img");
    			t27 = space();
    			img28 = element("img");
    			t28 = space();
    			img29 = element("img");
    			t29 = space();
    			img30 = element("img");
    			t30 = space();
    			img31 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = info.Nature[0].picture)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-1yz1g85");
    			add_location(img0, file, 6, 8, 148);
    			if (!src_url_equal(img1.src, img1_src_value = info.Nature[0].picture)) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "svelte-1yz1g85");
    			add_location(img1, file, 7, 8, 204);
    			if (!src_url_equal(img2.src, img2_src_value = info.Nature[0].picture)) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			attr_dev(img2, "class", "svelte-1yz1g85");
    			add_location(img2, file, 8, 8, 260);
    			if (!src_url_equal(img3.src, img3_src_value = info.Nature[0].picture)) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "");
    			attr_dev(img3, "class", "svelte-1yz1g85");
    			add_location(img3, file, 9, 8, 316);
    			if (!src_url_equal(img4.src, img4_src_value = info.Nature[0].picture)) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "");
    			attr_dev(img4, "class", "svelte-1yz1g85");
    			add_location(img4, file, 10, 8, 372);
    			if (!src_url_equal(img5.src, img5_src_value = info.Nature[0].picture)) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "");
    			attr_dev(img5, "class", "svelte-1yz1g85");
    			add_location(img5, file, 11, 8, 428);
    			if (!src_url_equal(img6.src, img6_src_value = info.Nature[0].picture)) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "");
    			attr_dev(img6, "class", "svelte-1yz1g85");
    			add_location(img6, file, 12, 8, 484);
    			if (!src_url_equal(img7.src, img7_src_value = info.Nature[0].picture)) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "");
    			attr_dev(img7, "class", "svelte-1yz1g85");
    			add_location(img7, file, 13, 8, 540);
    			if (!src_url_equal(img8.src, img8_src_value = info.Nature[0].picture)) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "");
    			attr_dev(img8, "class", "svelte-1yz1g85");
    			add_location(img8, file, 14, 8, 596);
    			if (!src_url_equal(img9.src, img9_src_value = info.Nature[0].picture)) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "");
    			attr_dev(img9, "class", "svelte-1yz1g85");
    			add_location(img9, file, 15, 8, 652);
    			if (!src_url_equal(img10.src, img10_src_value = info.Nature[0].picture)) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "");
    			attr_dev(img10, "class", "svelte-1yz1g85");
    			add_location(img10, file, 16, 8, 708);
    			if (!src_url_equal(img11.src, img11_src_value = info.Nature[0].picture)) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "");
    			attr_dev(img11, "class", "svelte-1yz1g85");
    			add_location(img11, file, 17, 8, 764);
    			if (!src_url_equal(img12.src, img12_src_value = info.Nature[0].picture)) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "");
    			attr_dev(img12, "class", "svelte-1yz1g85");
    			add_location(img12, file, 18, 8, 820);
    			if (!src_url_equal(img13.src, img13_src_value = info.Nature[0].picture)) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "alt", "");
    			attr_dev(img13, "class", "svelte-1yz1g85");
    			add_location(img13, file, 19, 8, 876);
    			if (!src_url_equal(img14.src, img14_src_value = info.Nature[0].picture)) attr_dev(img14, "src", img14_src_value);
    			attr_dev(img14, "alt", "");
    			attr_dev(img14, "class", "svelte-1yz1g85");
    			add_location(img14, file, 20, 8, 932);
    			if (!src_url_equal(img15.src, img15_src_value = info.Nature[0].picture)) attr_dev(img15, "src", img15_src_value);
    			attr_dev(img15, "alt", "");
    			attr_dev(img15, "class", "svelte-1yz1g85");
    			add_location(img15, file, 21, 8, 988);
    			attr_dev(div0, "class", "nature svelte-1yz1g85");
    			attr_dev(div0, "id", "center");
    			attr_dev(div0, "style", "overflow: ;hidden");
    			add_location(div0, file, 5, 4, 80);
    			if (!src_url_equal(img16.src, img16_src_value = info.Nature[0].picture)) attr_dev(img16, "src", img16_src_value);
    			attr_dev(img16, "alt", "");
    			attr_dev(img16, "class", "svelte-1yz1g85");
    			add_location(img16, file, 24, 8, 1121);
    			if (!src_url_equal(img17.src, img17_src_value = info.Nature[0].picture)) attr_dev(img17, "src", img17_src_value);
    			attr_dev(img17, "alt", "");
    			attr_dev(img17, "class", "svelte-1yz1g85");
    			add_location(img17, file, 25, 8, 1177);
    			if (!src_url_equal(img18.src, img18_src_value = info.Nature[0].picture)) attr_dev(img18, "src", img18_src_value);
    			attr_dev(img18, "alt", "");
    			attr_dev(img18, "class", "svelte-1yz1g85");
    			add_location(img18, file, 26, 8, 1233);
    			if (!src_url_equal(img19.src, img19_src_value = info.Nature[0].picture)) attr_dev(img19, "src", img19_src_value);
    			attr_dev(img19, "alt", "");
    			attr_dev(img19, "class", "svelte-1yz1g85");
    			add_location(img19, file, 27, 8, 1289);
    			if (!src_url_equal(img20.src, img20_src_value = info.Nature[0].picture)) attr_dev(img20, "src", img20_src_value);
    			attr_dev(img20, "alt", "");
    			attr_dev(img20, "class", "svelte-1yz1g85");
    			add_location(img20, file, 28, 8, 1345);
    			if (!src_url_equal(img21.src, img21_src_value = info.Nature[0].picture)) attr_dev(img21, "src", img21_src_value);
    			attr_dev(img21, "alt", "");
    			attr_dev(img21, "class", "svelte-1yz1g85");
    			add_location(img21, file, 29, 8, 1401);
    			if (!src_url_equal(img22.src, img22_src_value = info.Nature[0].picture)) attr_dev(img22, "src", img22_src_value);
    			attr_dev(img22, "alt", "");
    			attr_dev(img22, "class", "svelte-1yz1g85");
    			add_location(img22, file, 30, 8, 1457);
    			if (!src_url_equal(img23.src, img23_src_value = info.Nature[0].picture)) attr_dev(img23, "src", img23_src_value);
    			attr_dev(img23, "alt", "");
    			attr_dev(img23, "class", "svelte-1yz1g85");
    			add_location(img23, file, 31, 8, 1513);
    			if (!src_url_equal(img24.src, img24_src_value = info.Nature[0].picture)) attr_dev(img24, "src", img24_src_value);
    			attr_dev(img24, "alt", "");
    			attr_dev(img24, "class", "svelte-1yz1g85");
    			add_location(img24, file, 32, 8, 1569);
    			if (!src_url_equal(img25.src, img25_src_value = info.Nature[0].picture)) attr_dev(img25, "src", img25_src_value);
    			attr_dev(img25, "alt", "");
    			attr_dev(img25, "class", "svelte-1yz1g85");
    			add_location(img25, file, 33, 8, 1625);
    			if (!src_url_equal(img26.src, img26_src_value = info.Nature[0].picture)) attr_dev(img26, "src", img26_src_value);
    			attr_dev(img26, "alt", "");
    			attr_dev(img26, "class", "svelte-1yz1g85");
    			add_location(img26, file, 34, 8, 1681);
    			if (!src_url_equal(img27.src, img27_src_value = info.Nature[0].picture)) attr_dev(img27, "src", img27_src_value);
    			attr_dev(img27, "alt", "");
    			attr_dev(img27, "class", "svelte-1yz1g85");
    			add_location(img27, file, 35, 8, 1737);
    			if (!src_url_equal(img28.src, img28_src_value = info.Nature[0].picture)) attr_dev(img28, "src", img28_src_value);
    			attr_dev(img28, "alt", "");
    			attr_dev(img28, "class", "svelte-1yz1g85");
    			add_location(img28, file, 36, 8, 1793);
    			if (!src_url_equal(img29.src, img29_src_value = info.Nature[0].picture)) attr_dev(img29, "src", img29_src_value);
    			attr_dev(img29, "alt", "");
    			attr_dev(img29, "class", "svelte-1yz1g85");
    			add_location(img29, file, 37, 8, 1849);
    			if (!src_url_equal(img30.src, img30_src_value = info.Nature[0].picture)) attr_dev(img30, "src", img30_src_value);
    			attr_dev(img30, "alt", "");
    			attr_dev(img30, "class", "svelte-1yz1g85");
    			add_location(img30, file, 38, 8, 1905);
    			if (!src_url_equal(img31.src, img31_src_value = info.Nature[0].picture)) attr_dev(img31, "src", img31_src_value);
    			attr_dev(img31, "alt", "");
    			attr_dev(img31, "class", "svelte-1yz1g85");
    			add_location(img31, file, 39, 8, 1961);
    			attr_dev(div1, "class", "minimal svelte-1yz1g85");
    			attr_dev(div1, "id", "center");
    			attr_dev(div1, "style", "overflow: ;hidden");
    			add_location(div1, file, 23, 4, 1052);
    			attr_dev(main, "class", "svelte-1yz1g85");
    			add_location(main, file, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, img1);
    			append_dev(div0, t1);
    			append_dev(div0, img2);
    			append_dev(div0, t2);
    			append_dev(div0, img3);
    			append_dev(div0, t3);
    			append_dev(div0, img4);
    			append_dev(div0, t4);
    			append_dev(div0, img5);
    			append_dev(div0, t5);
    			append_dev(div0, img6);
    			append_dev(div0, t6);
    			append_dev(div0, img7);
    			append_dev(div0, t7);
    			append_dev(div0, img8);
    			append_dev(div0, t8);
    			append_dev(div0, img9);
    			append_dev(div0, t9);
    			append_dev(div0, img10);
    			append_dev(div0, t10);
    			append_dev(div0, img11);
    			append_dev(div0, t11);
    			append_dev(div0, img12);
    			append_dev(div0, t12);
    			append_dev(div0, img13);
    			append_dev(div0, t13);
    			append_dev(div0, img14);
    			append_dev(div0, t14);
    			append_dev(div0, img15);
    			append_dev(main, t15);
    			append_dev(main, div1);
    			append_dev(div1, img16);
    			append_dev(div1, t16);
    			append_dev(div1, img17);
    			append_dev(div1, t17);
    			append_dev(div1, img18);
    			append_dev(div1, t18);
    			append_dev(div1, img19);
    			append_dev(div1, t19);
    			append_dev(div1, img20);
    			append_dev(div1, t20);
    			append_dev(div1, img21);
    			append_dev(div1, t21);
    			append_dev(div1, img22);
    			append_dev(div1, t22);
    			append_dev(div1, img23);
    			append_dev(div1, t23);
    			append_dev(div1, img24);
    			append_dev(div1, t24);
    			append_dev(div1, img25);
    			append_dev(div1, t25);
    			append_dev(div1, img26);
    			append_dev(div1, t26);
    			append_dev(div1, img27);
    			append_dev(div1, t27);
    			append_dev(div1, img28);
    			append_dev(div1, t28);
    			append_dev(div1, img29);
    			append_dev(div1, t29);
    			append_dev(div1, img30);
    			append_dev(div1, t30);
    			append_dev(div1, img31);
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

    	$$self.$capture_state = () => ({ wallpaper: info });
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
