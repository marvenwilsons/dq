import Vue from "vue";

function get_ref_val(reference_val, theme_object) {
  // get refs
  const final_ref_val = reference_val.split("/");
  final_ref_val.shift();
  final_ref_val[final_ref_val.length - 1] === "" && final_ref_val.pop();

  // temp
  let ref_temp = undefined;

  // get value if refs
  for (let i = 0; i < final_ref_val.length; i++) {
    if (!ref_temp) {
      ref_temp = theme_object[final_ref_val[0]];
    } else {
      ref_temp = ref_temp[final_ref_val[i]];
    }
  }

  return ref_temp;
}

/**
 * dq-prop
 * used in global ui html elements for adding attributes and propertes
 * dynamically
 */
Vue.directive("dq-prop", {
  bind(el, { value }, vnode) {
    if (value) {
      // classlist
      if (value.classList.length != 0) {
        value.classList.map(classname => {
          el.classList.add(classname);
        });
      }

      if (value.properties) {
        const setattr = attr => {
          value.properties.attributes[attr] &&
            el.setAttribute(attr, value.properties.attributes[attr]);
        };

        const setNativeAttr = attr => {
          value.properties.native_attributes[attr] &&
            el.setAttribute(attr, value.properties.native_attributes[attr]);
        };

        // global attr
        if (value.properties.attributes) {
          // id
          value.properties.attributes.id && setattr("id");
          // name
          value.properties.attributes.name && setattr("name");
          // tabindex
          value.properties.attributes.tabindex && setattr("tabindex");
        }

        // native attr
        if (value.properties.native_attributes) {
          /**
           * Button Native props
           */
          if (el.tagName === "BUTTON") {
            // value
            value.properties.native_attributes.value && setNativeAttr("value");
            // autofucos
            value.properties.native_attributes.autofucos &&
              setNativeAttr("autofucos");
            //disabled
            value.properties.native_attributes.disabled &&
              setNativeAttr("disabled");
            // formenctype: type =submit
            value.properties.native_attributes.formenctype &&
              setNativeAttr("formenctype");
            //formmethod
            value.properties.native_attributes.formmethod &&
              setNativeAttr("formmethod");
            //formnovalidate
            value.properties.native_attributes.formnovalidate &&
              setNativeAttr("formnovalidate");
            //formtarget
            value.properties.native_attributes.formtarget &&
              setNativeAttr("formtarget");
            // type
            value.properties.native_attributes.type && setNativeAttr("type");
          }

          /**
           * Anchor native props
           */
          if (el.tagName === "A") {
            // target
            value.properties.native_attributes.target &&
              setNativeAttr("target");
            // title
            value.properties.native_attributes.title && setNativeAttr("title");
            // href
            value.properties.native_attributes.href && setNativeAttr("href");
            // download
            value.properties.native_attributes.download &&
              setNativeAttr("download");
          }

          /**
           * Audio
           */
          if (el.tagName === "AUDIO") {
            // src
            el.dataset.aud = value.properties.native_attributes.src;
            // autoplay
            value.properties.native_attributes.autoplay &&
              setNativeAttr("autoplay");
            // controls
            value.properties.native_attributes.controls &&
              setNativeAttr("controls");
            // loop
            value.properties.native_attributes.loop && setNativeAttr("loop");
            // muted
            value.properties.native_attributes.muted && setNativeAttr("muted");
          }

          /**
           * Video
           */
          if (el.tagName === "VIDEO") {
            // autoplay
            value.properties.native_attributes.autoplay &&
              setNativeAttr("autoplay");
            // controls
            value.properties.native_attributes.controls &&
              setNativeAttr("controls");
            // height
            value.properties.native_attributes.height &&
              setNativeAttr("height");
            // loop
            value.properties.native_attributes.loop && setNativeAttr("loop");
            // muted
            value.properties.native_attributes.muted && setNativeAttr("muted");
            // poster
            value.properties.native_attributes.poster &&
              setNativeAttr("poster");
            // width
            value.properties.native_attributes.width && setNativeAttr("width");
            // src
            value.properties.native_attributes.src && setNativeAttr("src");
            el.dataset.vid = value.properties.native_attributes.src;
          }

          /**
           * Img
           */
          if (el.tagName === "IMG") {
            // alt
            value.properties.native_attributes.alt && setNativeAttr("alt");
            // crossorigin
            value.properties.native_attributes.crossorigin &&
              setNativeAttr("crossorigin");
            // height
            value.properties.native_attributes.height &&
              setNativeAttr("height");
            // width
            value.properties.native_attributes.width && setNativeAttr("width");
            // ismap
            value.properties.native_attributes.ismap && setNativeAttr("ismap");
            // longdesc
            value.properties.native_attributes.longdesc &&
              setNativeAttr("longdesc");
            // src
            el.dataset.img = value.properties.native_attributes.src;
          }
        }
      }

      // native attr
    }
  }
});

/**
 * dq-theme
 * used in dq admin, handles the theme for the admin area, responsible for
 * applying initial style on page load
 */
Vue.directive("dq-theme", {
  bind(el, { value, modifiers, arg }, vnode) {
    // console.log("** theme");
    const theme_object = vnode.context.$store.state.theme.content;

    // arg of dq-theme is a prop name
    if (arg) {
      // validate input should be array
      if (!Array.isArray(value)) {
        throw "Error! dq-theme directive value is not an array! it should be array ";
      }

      //
      const selected_section_of_theme = theme_object[arg];

      value.map(keys => {
        // handling references
        const reference_val = selected_section_of_theme[keys]["$ref"];
        if (reference_val) {
          // set style
          el.style[keys] = get_ref_val(reference_val, theme_object);
        } else {
          el.style[keys] = selected_section_of_theme[keys];
        }
      });
    }
  }
});

/**
 * dq-hover
 * mostly use in dq admin area, for dynamic list, responsilbe for applying style
 * at hovered item list using the selected theme data
 */
Vue.directive("dq-hover", {
  bind(el, { value, modifiers, arg }, vnode) {
    // console.log("** hover");
    const theme_object = vnode.context.$store.state.theme.content;

    const selected_section_of_theme = theme_object[arg]["on_hover"];

    if (selected_section_of_theme) {
      const on_hover_keys = Object.keys(selected_section_of_theme);

      on_hover_keys.map(keys => {
        const reference_val = selected_section_of_theme[keys]["$ref"];

        if (reference_val) {
          // set style
          el.onmouseover = () => {
            if (el.getAttribute("data") != "active") {
              el.style[keys] = get_ref_val(reference_val, theme_object);
            }
          };
        }
      });

      el.onmouseleave = () => {
        if (el.getAttribute("data") != "active") {
          el.style.background = "";
        }
      };
    } else {
      throw `Error! dq-hover directive is applied in a component but 'on_hover' property is not found in "${arg}" object in theme object `;
    }
  }
});

/**
 * dq-active-style-for-click-list
 * mostly use in dq admin area, for dynamic list
 * 1. responsilbe for applying style at clicked item list using the selected theme data
 * 2. responsilbe for removing style at prev click item list
 * 3. responsilbe for resetting the default active style when on first inde pane close
 */
const els = [];
Vue.directive("dq-active-style-for-click-list", {
  bind(el, { value, modifiers, arg }, vnode) {
    console.log("** active");
    els.push(el);

    const theme_object = vnode.context.$store.state.theme.content;
    const selected_section_of_theme = theme_object[arg]["on_active"];

    // fires on first load
    const set_def = () => {
      if (el.innerText.trim() === value) {
        const theme_obj_on_active = theme_object[arg]["on_active"];
        if (theme_obj_on_active) {
          Object.keys(theme_obj_on_active).map(keys => {
            el.style[keys] = get_ref_val(
              theme_obj_on_active[keys][["$ref"]],
              theme_object
            );
          });

          el.setAttribute("data", "active");
        }
      }
    }
    if (modifiers["default"]) {
      set_def()
    }

    // fires on items click
    el.onclick = () => {
      if (el.getAttribute("data") != "active") {
        els.map(element => {
          if (element.getAttribute("data") == "active") {
            element.removeAttribute("data");
            element.style = "";
          }
        });

        //
        if (selected_section_of_theme) {
          const on_active_keys = Object.keys(selected_section_of_theme);

          on_active_keys.map(keys => {
            const reference_val = selected_section_of_theme[keys]["$ref"];

            if (reference_val) {
              el.style[keys] = get_ref_val(reference_val, theme_object);
            }
          });
        }

        el.setAttribute("data", "active");
      }
    };

    // fires on pane close
    const default_docker_active_item = 'Dashboard'
    if(els.length == 1) {
      // push an action to the store to be executed when pane close
      vnode.context.$store._actions[
        "pane_system/resetting_pane_to_default"
      ].push(() => {
        // responsible for applying hightlight to the default docker item
        set_def()

        // responsible for removing the prev active docker item highlight
        els.map(element => {
          if (
            element.getAttribute("data") == "active" &&
            element.innerText.trim() != default_docker_active_item
          ) {
            element.removeAttribute("data");
            element.style = "";
          }
        });


      });
    }
    
  }
});

/**
 * dq-disable-horizontal-scrolling
 * mostyle used in dq amin area
 * responsible for disabling horizontal scrolling when on hover at a
 * vertical scrolling container
 */
Vue.directive("dq-disable-horizontal-scrolling", {
  bind(el, { value, modifiers, arg }, vnode) {
    el.onmouseover = () => {
      vnode.context.$store.commit(
        "pane_system/set_horizontal_scrolling",
        false
      );
    };
    el.onmouseleave = () => {
      vnode.context.$store.commit("pane_system/set_horizontal_scrolling", true);
    };
  }
});

/**
 * 
 */
Vue.directive("dq-event-handler", {
  
})

