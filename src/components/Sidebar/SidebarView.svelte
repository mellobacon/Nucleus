<script lang="ts">
    export let show = false;
    let moving = false;
	
	let sidebar: HTMLElement;
	
	let initialPos: { x: any; y?: any; };
	let initialRect: { width: any; height?: number; right?: number; };
	
	const onGrabberMouseDown = (event) => {
		moving = true;
		const rect = sidebar.getBoundingClientRect();
		const parent = sidebar.parentElement.getBoundingClientRect();
		
		initialRect = {
			width: rect.width,
			height: rect.height,
			right: parent.right - rect.right
		};
		
		initialPos = {
			x: event.pageX,
			y: event.pageY
		};
	};
	
	const onGrabberMouseUp = (event) => {
		if (!moving) return;
		
		moving = false;
		initialRect = null;
		initialPos = null;
        let grabber = document.getElementById("grabber");
        grabber.classList.remove("showgrabber");
	};
	
	let width: number = 125;
	const onGrabberMouseMove = (event) => {
		if (!moving) return;
		
		const delta = event.pageX - initialPos.x;
		width = initialRect.width + delta;
		sidebar.style.width = `${width}px`;
        let grabber = document.getElementById("grabber");
        grabber.classList.add("showgrabber");
	};
</script>

<svelte:window on:mousemove={onGrabberMouseMove} on:mouseup={onGrabberMouseUp} />
{#if show}
	<div id="sidebarview" class:hidden={!show} bind:this={sidebar}>
		<slot></slot>
	</div>
	<div id="grabber" on:mousedown|preventDefault={onGrabberMouseDown}></div>
{/if}

<style>
    #sidebarview {
        height: 100%;
        width: 10rem;
        border-right: 1px solid #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 125px;
		max-width: 80%;
    }
    .hidden {
        display: none !important;
    }
    #grabber {
		width: 3px;
		height: 100%;
		cursor: ew-resize;
        position: relative;
        left: -3px;
	}
	#grabber:hover {
		background-color: #1eaedb;
        transition: 0.2s;
	}
    :global(.showgrabber) {
        background-color: #1eaedb;
        cursor: ew-resize;
    }
</style>