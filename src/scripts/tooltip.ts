export function tooltip(element: HTMLElement) {
	let div: HTMLElement;
	let title: string;

	function mouseEnter(e: MouseEvent & {currentTarget: EventTarget & HTMLButtonElement}) {
		const { height, left, width } = element.getBoundingClientRect();
		title = element.getAttribute('title');
		let isBottom = element.getAttribute("data-tooltip-bottom") ?? false;
		if (isBottom === "none") return;
		if (isBottom === "true" || isBottom === "") {
			isBottom = true;
		}
		else {
			isBottom = false;
		}
		let leftOffset = element.getAttribute("data-tooltip-offset") ?? "0";
		let topOffset = element.getAttribute("data-tooltip-top-offset") ?? "0";
		element.removeAttribute('title');
		
		div = document.createElement('div');
		const p = document.createElement("p");
        div.classList.add("tooltip");
		
		p.style.all = "unset";
		p.textContent = title;
		div.append(p);

		document.body.appendChild(div);
		div.style.left = `${left - (div.clientWidth / 2) + (width / 2) - parseInt(leftOffset)}px`;

		if (isBottom) {
			div.style.bottom = `${(height + 5 + parseInt(topOffset))}px`;
			div.style.top = "auto"
		}
		else {
			div.style.top = `${height + 5 + parseInt(topOffset)}px`;
			div.style.bottom = "auto"
		}
		div.style.right = "auto";
	}
	function mouseLeave() {
		if (!document.body.contains(div)) return;
		document.body.removeChild(div);
		element.setAttribute('title', title);
	}
	
	element.addEventListener('mouseenter', mouseEnter);
    element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('click', mouseLeave);
	
	return {
		destroy() {
			element.removeEventListener('mouseenter', mouseEnter);
			element.removeEventListener('mouseleave', mouseLeave);
		}
	}
}