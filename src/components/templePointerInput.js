import {MOUSE} from 'three'

export const TEMPLE_MOUSE_BUTTONS=Object.freeze({LEFT:MOUSE.ROTATE,MIDDLE:MOUSE.DOLLY,RIGHT:null})
export const isTempleNavigateClick=e=>e.button===(e.pointerType==='mouse'?2:0)
export const isTempleNavigateDrag=e=>e.pointerType==='mouse'&&e.buttons===2
export const isTempleLookDrag=e=>e.pointerType==='touch'||(e.pointerType==='mouse'&&e.buttons===1)
