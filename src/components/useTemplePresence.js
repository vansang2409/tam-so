import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { connectTemplePresence, resolveTempleRoom, visitorName } from '../data/templePresence.js'
export function useTemplePresence(enabled=true) {
  const id=useRef(null),connection=useRef(null)
  if(!id.current)id.current=crypto.randomUUID()
  const [name,setName]=useState(()=>{try{return visitorName(localStorage.getItem('tamso-temple-visitor-name')||('Khách '+id.current.slice(0,4)))}catch{return 'Khách hành hương'}})
  const [appearance,setAppearance]=useState(()=>{try{return localStorage.getItem('tamso-temple-appearance')==='female'?'female':'male'}catch{return 'male'}})
  const appearanceRef=useRef(appearance);appearanceRef.current=appearance
  const [state,setState]=useState({phase:'connecting',peers:[],count:0})
  const nameRef=useRef(name);nameRef.current=name
  const room=resolveTempleRoom(typeof window==='undefined'?'':window.location.search,import.meta.env.DEV)
  useEffect(()=>{
    if(!enabled){setState({phase:'offline',peers:[],count:0});return}
    const c=connectTemplePresence(supabase,{id:id.current,name:nameRef.current,appearance:appearanceRef.current,room,onChange:setState});connection.current=c
    return ()=>{connection.current=null;c.close()}
  },[enabled,room])
  const update=useCallback(p=>connection.current?.update(p),[])
  const rename=value=>{const next=visitorName(value);setName(next);try{localStorage.setItem('tamso-temple-visitor-name',next)}catch{}connection.current?.rename(next);return next}
  const chooseAppearance=value=>{const next=value==='female'?'female':'male';setAppearance(next);try{localStorage.setItem('tamso-temple-appearance',next)}catch{}connection.current?.update({appearance:next});return next}
  return {...state,name,appearance,chooseAppearance,rename,update}
}
