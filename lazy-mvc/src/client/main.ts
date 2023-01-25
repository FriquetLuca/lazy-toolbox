
// observeDOM(document.body, (elements: MutationRecord[]) => {
// for(const element of elements) {
// for(const currentNode of element.addedNodes) {
// if(currentNode.nodeType === Node.ELEMENT_NODE && (<HTMLElement>currentNode).hasAttribute('custom-attr')) {
// console.log(currentNode);
// }
// }
// }
// });

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