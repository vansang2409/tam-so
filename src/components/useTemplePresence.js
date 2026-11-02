import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { connectTemplePresence, visitorName } from '../data/templePresence.js'
export function useTemplePresence(enabled=true) {
  const id=useRef(null),connection=useRef(null)
  if(!id.current)id.current=crypto.randomUUID()
  const [name,setName]=useState(()=>{try{return visitorName(localStorage.getItem('tamso-temple-visitor-name')||('Khách '+id.current.slice(0,4)))}catch{return 'Khách hành hương'}})
  const [state,setState]=useState({phase:'connecting',peers:[],count:0})
  const nameRef=useRef(name);nameRef.current=name
  useEffect(()=>{
    if(!enabled){setState({phase:'offline',peers:[],count:0});return}
    const c=connectTemplePresence(supabase,{id:id.current,name:nameRef.current,onChange:setState});connection.current=c
    return ()=>{connection.current=null;c.close()}
  },[enabled])
  const update=useCallback(p=>connection.current?.update(p),[])
  const rename=value=>{const next=visitorName(value);setName(next);try{localStorage.setItem('tamso-temple-visitor-name',next)}catch{}connection.current?.rename(next);return next}
  return {...state,name,rename,update}
}
