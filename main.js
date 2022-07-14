((w)=>{
    let container;
    let me;
    const lg = console.log;
    const verifyPath = (hash) => hash.startsWith('#/');
    const elements = {
        card: (title, clickable, body, image) => {
            let node = document.createElement("div");
            node.classList.add('card');
            let titleNode = document.createElement("span");
            let ttext = document.createTextNode(`${title}`);
            //titleNode.className = 'title';
            let bodyNode = document.createElement("span");
            let btext = document.createTextNode(`${body || ''}`);
            //bodyNode.className = 'body';
            titleNode.appendChild(ttext);
            bodyNode.appendChild(btext);
            node.append(titleNode);
            node.append(bodyNode);
            if (!!image){
                let img = document.createElement("img");
                img.src = image;
                node.appendChild(img);
            }
            if (clickable){
                node.addEventListener('click', () => {route(title)})
                node.classList.add('clickable');
            }
            return node;
        }
    }
    const spawn = {
        country: (elem) => {
            const node = elements.card(elem.name, true, elem.code, `https://api.moonlord.ml/phone/flag/${elem.name}`);
            container.appendChild(node);
        },
        phone: (elem) => {
            const node = elements.card(elem.number, true, elem.time);
            container.appendChild(node);
        },
        message: (elem) => {
            const node = elements.card(elem.from, false, elem.message);
            container.appendChild(node);
        },
        loading: (elem) => {
            const node = elements.card("Loading...", false);
            container.appendChild(node);
        }
    };
    const render = (path) => {
        if (!container){
            container = document.createElement("div");
            container.className = 'container';
            me.parentNode.insertBefore(container, me);
        } else {
            while (c = container.firstChild) {
                container.removeChild(c);
            }
        }
        if (!path)
            fetch(`https://api.moonlord.ml/phone/countries`)
              .then(d => d.json())
              .then(d => {
                  d.forEach(e => {
                      spawn.country(e);
                  });
              }).catch(e => lg(e));
        else if (path.startsWith("+"))
            fetch(`https://api.moonlord.ml/phone/messages/${path}`)
              .then(d => d.json())
              .then(d => {
                  d.forEach(e => {
                      spawn.message(e);
                  });
              }).catch(e => lg(e));
        else 
            fetch(`https://api.moonlord.ml/phone/phones/${path}`)
              .then(d => d.json())
              .then(d => {
                  d.forEach(e => {
                      spawn.phone(e);
                  });
              }).catch(e => lg(e));
        return true;
    }
    const route = (hash) => {
        if (!hash) w.location.hash = '/';
        //else history.pushState(null,null,`${window.location.pathname}#/${hash}`); 
        else w.location.hash = '/' + hash;
    }

    w.addEventListener("hashchange", (e)=>{
        if (e.isTrusted){
            let path = w.location.hash;
            if (!verifyPath(path)) lg("???") || route();
            else render(path.substring(2));
        }
    });
    me = document.currentScript;
    document.querySelector('.header').addEventListener('click',()=>route());
    let hash = w.location.hash;
    verifyPath(hash) && render(hash.substring(2)) || route();
    
})(this);