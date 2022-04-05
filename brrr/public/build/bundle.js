
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
    let outros;
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

    /* src\SearchBar.svelte generated by Svelte v3.46.4 */

    const file$7 = "src\\SearchBar.svelte";

    function create_fragment$7(ctx) {
    	let form;
    	let input;
    	let t;
    	let button;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			form = element("form");
    			input = element("input");
    			t = space();
    			button = element("button");
    			img = element("img");
    			attr_dev(input, "class", "search-input svelte-x2w6h3");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "placeholder", "Search");
    			attr_dev(input, "aria-label", "Search");
    			add_location(input, file$7, 4, 4, 54);
    			if (!src_url_equal(img.src, img_src_value = "magnify.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "magnify");
    			add_location(img, file$7, 6, 8, 194);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "search-btn svelte-x2w6h3");
    			add_location(button, file$7, 5, 4, 143);
    			attr_dev(form, "class", "search-bar svelte-x2w6h3");
    			add_location(form, file$7, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, input);
    			append_dev(form, t);
    			append_dev(form, button);
    			append_dev(button, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchBar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchBar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SearchBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchBar",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\MenuIcons.svelte generated by Svelte v3.46.4 */

    const file$6 = "src\\MenuIcons.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let a3;
    	let img3;
    	let img3_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t1 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t2 = space();
    			a3 = element("a");
    			img3 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "video-plus.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Upload Video");
    			add_location(img0, file$6, 5, 8, 76);
    			attr_dev(a0, "href", "#0");
    			add_location(a0, file$6, 4, 4, 53);
    			if (!src_url_equal(img1.src, img1_src_value = "apps.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Apps");
    			add_location(img1, file$6, 8, 8, 160);
    			attr_dev(a1, "href", "#0");
    			add_location(a1, file$6, 7, 4, 137);
    			if (!src_url_equal(img2.src, img2_src_value = "bell.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Notifications");
    			add_location(img2, file$6, 11, 8, 230);
    			attr_dev(a2, "href", "#0");
    			add_location(a2, file$6, 10, 4, 207);
    			attr_dev(img3, "class", "menu-channel-icon svelte-ok2eyj");
    			if (!src_url_equal(img3.src, img3_src_value = "http://unsplash.it/36/36?gravity=center")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Your Channel");
    			add_location(img3, file$6, 14, 8, 309);
    			attr_dev(a3, "href", "#0");
    			add_location(a3, file$6, 13, 4, 286);
    			attr_dev(div, "class", "menu-icons svelte-ok2eyj");
    			add_location(div, file$6, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(a0, img0);
    			append_dev(div, t0);
    			append_dev(div, a1);
    			append_dev(a1, img1);
    			append_dev(div, t1);
    			append_dev(div, a2);
    			append_dev(a2, img2);
    			append_dev(div, t2);
    			append_dev(div, a3);
    			append_dev(a3, img3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuIcons', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuIcons> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class MenuIcons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuIcons",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\Categories.svelte generated by Svelte v3.46.4 */

    const file$5 = "src\\Categories.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let section;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t7;
    	let button4;
    	let t9;
    	let button5;
    	let t11;
    	let button6;
    	let t13;
    	let button7;
    	let t15;
    	let button8;
    	let t17;
    	let button9;

    	const block = {
    		c: function create() {
    			div = element("div");
    			section = element("section");
    			button0 = element("button");
    			button0.textContent = "All";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Category 1";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Category 2";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = "Category 3";
    			t7 = space();
    			button4 = element("button");
    			button4.textContent = "Category 4";
    			t9 = space();
    			button5 = element("button");
    			button5.textContent = "Category 5";
    			t11 = space();
    			button6 = element("button");
    			button6.textContent = "Category 6";
    			t13 = space();
    			button7 = element("button");
    			button7.textContent = "Category 7";
    			t15 = space();
    			button8 = element("button");
    			button8.textContent = "Category 8";
    			t17 = space();
    			button9 = element("button");
    			button9.textContent = "Category 9";
    			attr_dev(button0, "class", "category active svelte-os7h1r");
    			add_location(button0, file$5, 5, 8, 97);
    			attr_dev(button1, "class", "category svelte-os7h1r");
    			add_location(button1, file$5, 6, 8, 151);
    			attr_dev(button2, "class", "category svelte-os7h1r");
    			add_location(button2, file$5, 7, 8, 205);
    			attr_dev(button3, "class", "category svelte-os7h1r");
    			add_location(button3, file$5, 8, 8, 259);
    			attr_dev(button4, "class", "category svelte-os7h1r");
    			add_location(button4, file$5, 9, 8, 313);
    			attr_dev(button5, "class", "category svelte-os7h1r");
    			add_location(button5, file$5, 10, 8, 367);
    			attr_dev(button6, "class", "category svelte-os7h1r");
    			add_location(button6, file$5, 11, 8, 421);
    			attr_dev(button7, "class", "category svelte-os7h1r");
    			add_location(button7, file$5, 12, 8, 475);
    			attr_dev(button8, "class", "category svelte-os7h1r");
    			add_location(button8, file$5, 13, 8, 529);
    			attr_dev(button9, "class", "category svelte-os7h1r");
    			add_location(button9, file$5, 14, 8, 583);
    			attr_dev(section, "class", "category-section svelte-os7h1r");
    			add_location(section, file$5, 4, 4, 53);
    			attr_dev(div, "class", "categories svelte-os7h1r");
    			add_location(div, file$5, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section);
    			append_dev(section, button0);
    			append_dev(section, t1);
    			append_dev(section, button1);
    			append_dev(section, t3);
    			append_dev(section, button2);
    			append_dev(section, t5);
    			append_dev(section, button3);
    			append_dev(section, t7);
    			append_dev(section, button4);
    			append_dev(section, t9);
    			append_dev(section, button5);
    			append_dev(section, t11);
    			append_dev(section, button6);
    			append_dev(section, t13);
    			append_dev(section, button7);
    			append_dev(section, t15);
    			append_dev(section, button8);
    			append_dev(section, t17);
    			append_dev(section, button9);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Categories', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Categories> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Categories extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Categories",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\VideoContainer.svelte generated by Svelte v3.46.4 */

    const file$4 = "src\\VideoContainer.svelte";

    function create_fragment$4(ctx) {
    	let article;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div2;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let div1;
    	let a2;
    	let t3;
    	let a3;
    	let t5;
    	let div0;
    	let span0;
    	let t7;
    	let span1;

    	const block = {
    		c: function create() {
    			article = element("article");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			div2 = element("div");
    			a1 = element("a");
    			img1 = element("img");
    			t1 = space();
    			div1 = element("div");
    			a2 = element("a");
    			a2.textContent = "Video Title";
    			t3 = space();
    			a3 = element("a");
    			a3.textContent = "Channel Name";
    			t5 = space();
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "12K views";
    			t7 = text("\r\n                •\r\n                ");
    			span1 = element("span");
    			span1.textContent = "1 week ago";
    			attr_dev(img0, "class", "thumbnail-image svelte-o12ghd");
    			if (!src_url_equal(img0.src, img0_src_value = "http://unsplash.it/250/150?gravity=center")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$4, 4, 8, 123);
    			attr_dev(a0, "href", "#0");
    			attr_dev(a0, "class", "thumbnail svelte-o12ghd");
    			attr_dev(a0, "data-duration", "13:37");
    			add_location(a0, file$4, 3, 4, 60);
    			attr_dev(img1, "class", "channel-icon svelte-o12ghd");
    			if (!src_url_equal(img1.src, img1_src_value = "http://unsplash.it/36/36?gravity=center")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			add_location(img1, file$4, 8, 12, 294);
    			attr_dev(a1, "href", "#0");
    			add_location(a1, file$4, 7, 8, 267);
    			attr_dev(a2, "href", "#0");
    			attr_dev(a2, "class", "video-title svelte-o12ghd");
    			attr_dev(a2, "alt", "");
    			add_location(a2, file$4, 11, 12, 438);
    			attr_dev(a3, "href", "#0");
    			attr_dev(a3, "class", "video-channel-name svelte-o12ghd");
    			attr_dev(a3, "alt", "");
    			add_location(a3, file$4, 12, 12, 507);
    			add_location(span0, file$4, 14, 16, 630);
    			add_location(span1, file$4, 16, 16, 689);
    			attr_dev(div0, "class", "video-metadata svelte-o12ghd");
    			add_location(div0, file$4, 13, 12, 584);
    			attr_dev(div1, "class", "video-details svelte-o12ghd");
    			add_location(div1, file$4, 10, 8, 397);
    			attr_dev(div2, "class", "video-bottom-section svelte-o12ghd");
    			add_location(div2, file$4, 6, 4, 223);
    			attr_dev(article, "class", "video-container svelte-o12ghd");
    			add_location(article, file$4, 2, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, a0);
    			append_dev(a0, img0);
    			append_dev(article, t0);
    			append_dev(article, div2);
    			append_dev(div2, a1);
    			append_dev(a1, img1);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, a2);
    			append_dev(div1, t3);
    			append_dev(div1, a3);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t7);
    			append_dev(div0, span1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
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

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VideoContainer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VideoContainer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class VideoContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VideoContainer",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\RMY.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\RMY.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let h2;
    	let t0;
    	let button;
    	let t2;
    	let videocontainer0;
    	let t3;
    	let videocontainer1;
    	let t4;
    	let videocontainer2;
    	let t5;
    	let videocontainer3;
    	let t6;
    	let videocontainer4;
    	let t7;
    	let videocontainer5;
    	let current;
    	videocontainer0 = new VideoContainer({ $$inline: true });
    	videocontainer1 = new VideoContainer({ $$inline: true });
    	videocontainer2 = new VideoContainer({ $$inline: true });
    	videocontainer3 = new VideoContainer({ $$inline: true });
    	videocontainer4 = new VideoContainer({ $$inline: true });
    	videocontainer5 = new VideoContainer({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			t0 = text("Recommended For You\r\n        ");
    			button = element("button");
    			button.textContent = "×";
    			t2 = space();
    			create_component(videocontainer0.$$.fragment);
    			t3 = space();
    			create_component(videocontainer1.$$.fragment);
    			t4 = space();
    			create_component(videocontainer2.$$.fragment);
    			t5 = space();
    			create_component(videocontainer3.$$.fragment);
    			t6 = space();
    			create_component(videocontainer4.$$.fragment);
    			t7 = space();
    			create_component(videocontainer5.$$.fragment);
    			attr_dev(button, "class", "video-section-title-close svelte-p7sxss");
    			add_location(button, file$3, 6, 8, 184);
    			attr_dev(h2, "class", "video-section-title svelte-p7sxss");
    			add_location(h2, file$3, 4, 4, 113);
    			attr_dev(section, "class", "video-section svelte-p7sxss");
    			add_location(section, file$3, 3, 0, 76);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(h2, t0);
    			append_dev(h2, button);
    			append_dev(section, t2);
    			mount_component(videocontainer0, section, null);
    			append_dev(section, t3);
    			mount_component(videocontainer1, section, null);
    			append_dev(section, t4);
    			mount_component(videocontainer2, section, null);
    			append_dev(section, t5);
    			mount_component(videocontainer3, section, null);
    			append_dev(section, t6);
    			mount_component(videocontainer4, section, null);
    			append_dev(section, t7);
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
    	validate_slots('RMY', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RMY> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ VideoContainer });
    	return [];
    }

    class RMY extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RMY",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Trend.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\Trend.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let h2;
    	let t0;
    	let button;
    	let t2;
    	let videocontainer0;
    	let t3;
    	let videocontainer1;
    	let t4;
    	let videocontainer2;
    	let t5;
    	let videocontainer3;
    	let t6;
    	let videocontainer4;
    	let t7;
    	let videocontainer5;
    	let current;
    	videocontainer0 = new VideoContainer({ $$inline: true });
    	videocontainer1 = new VideoContainer({ $$inline: true });
    	videocontainer2 = new VideoContainer({ $$inline: true });
    	videocontainer3 = new VideoContainer({ $$inline: true });
    	videocontainer4 = new VideoContainer({ $$inline: true });
    	videocontainer5 = new VideoContainer({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			t0 = text("Trending\r\n        ");
    			button = element("button");
    			button.textContent = "×";
    			t2 = space();
    			create_component(videocontainer0.$$.fragment);
    			t3 = space();
    			create_component(videocontainer1.$$.fragment);
    			t4 = space();
    			create_component(videocontainer2.$$.fragment);
    			t5 = space();
    			create_component(videocontainer3.$$.fragment);
    			t6 = space();
    			create_component(videocontainer4.$$.fragment);
    			t7 = space();
    			create_component(videocontainer5.$$.fragment);
    			attr_dev(button, "class", "video-section-title-close svelte-rklyjg");
    			add_location(button, file$2, 6, 8, 173);
    			attr_dev(h2, "class", "video-section-title svelte-rklyjg");
    			add_location(h2, file$2, 4, 4, 113);
    			attr_dev(section, "class", "video-section svelte-rklyjg");
    			add_location(section, file$2, 3, 0, 76);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(h2, t0);
    			append_dev(h2, button);
    			append_dev(section, t2);
    			mount_component(videocontainer0, section, null);
    			append_dev(section, t3);
    			mount_component(videocontainer1, section, null);
    			append_dev(section, t4);
    			mount_component(videocontainer2, section, null);
    			append_dev(section, t5);
    			mount_component(videocontainer3, section, null);
    			append_dev(section, t6);
    			mount_component(videocontainer4, section, null);
    			append_dev(section, t7);
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
    	validate_slots('Trend', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Trend> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ VideoContainer });
    	return [];
    }

    class Trend extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Trend",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Subs.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\Subs.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let h2;
    	let t0;
    	let button;
    	let t2;
    	let videocontainer0;
    	let t3;
    	let videocontainer1;
    	let t4;
    	let videocontainer2;
    	let t5;
    	let videocontainer3;
    	let t6;
    	let videocontainer4;
    	let t7;
    	let videocontainer5;
    	let current;
    	videocontainer0 = new VideoContainer({ $$inline: true });
    	videocontainer1 = new VideoContainer({ $$inline: true });
    	videocontainer2 = new VideoContainer({ $$inline: true });
    	videocontainer3 = new VideoContainer({ $$inline: true });
    	videocontainer4 = new VideoContainer({ $$inline: true });
    	videocontainer5 = new VideoContainer({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			h2 = element("h2");
    			t0 = text("Subsciptions\r\n            ");
    			button = element("button");
    			button.textContent = "×";
    			t2 = space();
    			create_component(videocontainer0.$$.fragment);
    			t3 = space();
    			create_component(videocontainer1.$$.fragment);
    			t4 = space();
    			create_component(videocontainer2.$$.fragment);
    			t5 = space();
    			create_component(videocontainer3.$$.fragment);
    			t6 = space();
    			create_component(videocontainer4.$$.fragment);
    			t7 = space();
    			create_component(videocontainer5.$$.fragment);
    			attr_dev(button, "class", "video-section-title-close svelte-x7s7fg");
    			add_location(button, file$1, 6, 12, 201);
    			attr_dev(h2, "class", "video-section-title svelte-x7s7fg");
    			add_location(h2, file$1, 4, 8, 129);
    			attr_dev(section, "class", "video-section svelte-x7s7fg");
    			add_location(section, file$1, 3, 4, 88);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h2);
    			append_dev(h2, t0);
    			append_dev(h2, button);
    			append_dev(section, t2);
    			mount_component(videocontainer0, section, null);
    			append_dev(section, t3);
    			mount_component(videocontainer1, section, null);
    			append_dev(section, t4);
    			mount_component(videocontainer2, section, null);
    			append_dev(section, t5);
    			mount_component(videocontainer3, section, null);
    			append_dev(section, t6);
    			mount_component(videocontainer4, section, null);
    			append_dev(section, t7);
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
    	validate_slots('Subs', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Subs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ VideoContainer });
    	return [];
    }

    class Subs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Subs",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let searchbar;
    	let t0;
    	let menuicons;
    	let t1;
    	let categories;
    	let t2;
    	let div;
    	let rmy;
    	let t3;
    	let trend;
    	let t4;
    	let subs;
    	let current;
    	searchbar = new SearchBar({ $$inline: true });
    	menuicons = new MenuIcons({ $$inline: true });
    	categories = new Categories({ $$inline: true });
    	rmy = new RMY({ $$inline: true });
    	trend = new Trend({ $$inline: true });
    	subs = new Subs({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			create_component(searchbar.$$.fragment);
    			t0 = space();
    			create_component(menuicons.$$.fragment);
    			t1 = space();
    			create_component(categories.$$.fragment);
    			t2 = space();
    			div = element("div");
    			create_component(rmy.$$.fragment);
    			t3 = space();
    			create_component(trend.$$.fragment);
    			t4 = space();
    			create_component(subs.$$.fragment);
    			attr_dev(header, "class", "header svelte-137ds9w");
    			add_location(header, file, 10, 1, 274);
    			attr_dev(div, "class", "videos svelte-137ds9w");
    			add_location(div, file, 21, 1, 468);
    			attr_dev(main, "class", "svelte-137ds9w");
    			add_location(main, file, 9, 0, 265);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			mount_component(searchbar, header, null);
    			append_dev(header, t0);
    			mount_component(menuicons, header, null);
    			append_dev(main, t1);
    			mount_component(categories, main, null);
    			append_dev(main, t2);
    			append_dev(main, div);
    			mount_component(rmy, div, null);
    			append_dev(div, t3);
    			mount_component(trend, div, null);
    			append_dev(div, t4);
    			mount_component(subs, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchbar.$$.fragment, local);
    			transition_in(menuicons.$$.fragment, local);
    			transition_in(categories.$$.fragment, local);
    			transition_in(rmy.$$.fragment, local);
    			transition_in(trend.$$.fragment, local);
    			transition_in(subs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchbar.$$.fragment, local);
    			transition_out(menuicons.$$.fragment, local);
    			transition_out(categories.$$.fragment, local);
    			transition_out(rmy.$$.fragment, local);
    			transition_out(trend.$$.fragment, local);
    			transition_out(subs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(searchbar);
    			destroy_component(menuicons);
    			destroy_component(categories);
    			destroy_component(rmy);
    			destroy_component(trend);
    			destroy_component(subs);
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

    	$$self.$capture_state = () => ({
    		SearchBar,
    		MenuIcons,
    		Categories,
    		RMY,
    		Trend,
    		Subs
    	});

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
