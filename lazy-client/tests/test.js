class App extends LazyClient.LazyReact {
    notification(component) {
        console.log(`App: ${JSON.stringify(component)}`);
    }
}

class Hello extends LazyClient.LazyReact {
    notification(component) {
        console.log(`Should I say Bye to ${component.name} too?`);
    }
}

const app = App.createComponent({
    name: "App",
    selector: "#main",
    datas: {
        name: "Person A",
        content: "Greetings to you, stupid Person B."
    },
    behaviours: {
        consoleMyClick: (e) => {
            console.log(`Clicked on : `, e.target);
        }
    },
    component: (datas) => {
        return `<h1 consoleMyClick="click">${datas.name}</h1><p>${datas.content}</p>`;
    }
});
app.render();
const hello = Hello.createComponent({
    name: "Hello",
    selector: "#hewwo",
    datas: {
        name: "Person B",
        content: "Hello the lambda Person A."
    },
    component: (datas) => {
        // consoleMyClick="click" isn't available here, we're not in the same component !
        return `<h1 consoleMyClick="click">${datas.name}</h1><p>${datas.content}</p>`;
    }
});
hello.render();
const discussions = [
    "So witch, tell me what you want.",
    "Nothing much, just testing some sit out.",
    "Oh really?",
    "Yeah really, now bye you useless pizofjit.",
    "Mhm. Fug you too."
];
for(let i = 0; i < discussions.length; i++) {
    setTimeout(() => {
        if(i % 2 == 0) {
            app.datas.content = discussions[i];
        } else {
            hello.datas.content = discussions[i];
        }
    }, 3000 * (i + 1));
}
setTimeout(() => {
    app.datas.name = "Person C";
}, 3000);