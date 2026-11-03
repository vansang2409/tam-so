import assert from 'node:assert/strict'
import {MOUSE} from 'three'
import {TEMPLE_MOUSE_BUTTONS,isTempleNavigateClick,isTempleNavigateDrag,isTempleLookDrag} from '../src/components/templePointerInput.js'

assert.equal(TEMPLE_MOUSE_BUTTONS.LEFT,MOUSE.ROTATE)
assert.equal(TEMPLE_MOUSE_BUTTONS.RIGHT,null,'Right mouse must not also rotate the orbit camera')
assert.equal(TEMPLE_MOUSE_BUTTONS.MIDDLE,MOUSE.DOLLY)
assert.equal(isTempleNavigateClick({pointerType:'mouse',button:2}),true)
for(const button of [0,1,3,4])assert.equal(isTempleNavigateClick({pointerType:'mouse',button}),false)
assert.equal(isTempleNavigateDrag({pointerType:'mouse',buttons:2}),true)
for(const buttons of [0,1,3,4])assert.equal(isTempleNavigateDrag({pointerType:'mouse',buttons}),false)
assert.equal(isTempleLookDrag({pointerType:'mouse',buttons:1}),true)
for(const buttons of [0,2,3,4])assert.equal(isTempleLookDrag({pointerType:'mouse',buttons}),false)
for(const pointerType of ['touch','pen'])assert.equal(isTempleNavigateClick({pointerType,button:0}),true,'Primary touch/stylus taps remain navigation')
assert.equal(isTempleLookDrag({pointerType:'touch',buttons:1}),true,'Touch swiping remains look-around')
assert.equal(isTempleNavigateDrag({pointerType:'touch',buttons:1}),false,'Touch swiping must not become continuous walking')
console.log('Pointer: left drag looks, right click/drag walks; middle zoom and touch/pen taps preserved.')
