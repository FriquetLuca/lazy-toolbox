const observeDOM = (function(){
    const wnd: any = window;
    const MutationObserver = wnd.MutationObserver || wnd.WebKitMutationObserver;
    return function(obj: any, callback: MutationCallback){
      if(!obj || obj.nodeType !== 1) {
        return;
      }
      if(MutationObserver){
        // define a new observer
        const mutationObserver = new MutationObserver(callback);
        // have the observer observe for changes in children
        mutationObserver.observe(obj, { childList:true, subtree:true });
        return mutationObserver;
      } else if(wnd.addEventListener){ // browser support fallback
        obj.addEventListener('DOMNodeInserted', callback, false);
        obj.addEventListener('DOMNodeRemoved', callback, false);
      }
    }
  })();
  observeDOM(document.body, (elements: MutationRecord[]) => {
    for(const element of elements) {
        for(const currentNode of element.addedNodes) {
            if(currentNode.nodeType === Node.ELEMENT_NODE && (<HTMLElement>currentNode).hasAttribute('custom-attr')) {
                console.log(currentNode);
            }
        }
    }
});

const pey = document.querySelector("p");
let firstClick = false;
if(pey) {
    pey.addEventListener('click', () => {
        if(!firstClick) {
            pey.innerHTML = "Uwu World!";
        }
        if(firstClick) {
            pey.innerHTML = "<p><div custom-attr></div></p>";
        }
        firstClick = true;
    });
}