import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import EditorArea from './components/EditorArea'
import SetArea from './components/SetArea'
import PreviewArea from './components/PreviewArea'
import UpperToolbar from './components/UpperToolbar'

function App() {
  const [editorAreaW, setEditorAreaW] = useState<number>(350)
  const [editorAndSetAreaW, setEditorAndSetAreaW] = useState<number>(650)
  const [isResizing, setIsResizing] = useState<boolean>(false)

  const startXRef = useRef<number>(0)
  const movingRef = useRef<number>(-1)
  const startEWRef = useRef<number>(0)
  const startESWRef = useRef<number>(0)
  const [minW, setMinW] = useState<number>(192);
  const [maxW, setMaxW] = useState<number>(document.documentElement.clientWidth);
  const [expandLevel, setExpandLevel] = useState<number>(2)
  const [displayId, setDisplayId] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      const newW = document.documentElement.clientWidth;
      if (newW >= 1024) {
        setExpandLevel(2)
      } else if (newW > 640) {
        setExpandLevel(1)
      } else {
        setExpandLevel(0)
        setEditorAndSetAreaW(newW)
        setEditorAreaW(newW)
        setMaxW(newW)
        return
      }
      setMaxW(newW)
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  useEffect(() => {
    if (maxW < minW + editorAndSetAreaW) {
      setEditorAndSetAreaW(maxW - minW)
    }
    if (maxW < expandLevel * minW + editorAreaW) {
      setEditorAreaW(maxW - (expandLevel * minW))
    }
  }, [maxW, editorAndSetAreaW, editorAreaW])

  const handleMove = (clientX: number) => {
    if (isResizing) {

      if (movingRef.current == 0) {
        if (editorAndSetAreaW - (startEWRef.current + (clientX - startXRef.current)) < minW && expandLevel > 1) {
          setEditorAndSetAreaW(Math.min(maxW - minW, Math.max(minW, startEWRef.current + (clientX - startXRef.current) + minW)));
        }
        setEditorAreaW(Math.min(maxW - (expandLevel * minW), Math.max(minW, startEWRef.current + (clientX - startXRef.current))));
      } else if (movingRef.current == 1) {
        if (startESWRef.current + (clientX - startXRef.current) < (2 * minW)) {
          return
        }
        if (startESWRef.current + (clientX - startXRef.current) - editorAreaW < minW) {
          setEditorAreaW(startESWRef.current + (clientX - startXRef.current) - minW);
        }
        setEditorAndSetAreaW(Math.min((maxW - minW), Math.max(386, startESWRef.current + (clientX - startXRef.current))));
      }
    }
  };

  useEffect(() => {
    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (isResizing) {
        handleMove(e.clientX)
      }
    };

    const onMouseUp = () => {
      setIsResizing(false);
      startEWRef.current = editorAreaW;
      startESWRef.current = editorAndSetAreaW;
      movingRef.current = -1;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    if (isResizing) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    const onTouchMove = (e: globalThis.TouchEvent) => {
      if (isResizing) {
        const moceTouch = e.changedTouches[0];
        handleMove(moceTouch.clientX)
      }
    };

    const onTouchEnd = () => {
      setIsResizing(false);
      startEWRef.current = editorAreaW;
      startESWRef.current = editorAndSetAreaW;
      movingRef.current = -1;
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    if (isResizing) {
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isResizing]);

  const handleMoveStart = (clientX: number) => {
    setIsResizing(true);
    startXRef.current = clientX;
    startEWRef.current = editorAreaW;
    startESWRef.current = editorAndSetAreaW;
  }

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>, target: number) => {
    movingRef.current = target;
    handleMoveStart(e.clientX)
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, target: number) => {
    movingRef.current = target;
    const touch = e.changedTouches[0];
    handleMoveStart(touch.clientX)
  }

  return (
    <div className='App h-[100dvh] overflow-y-hidden flex flex-col overflow-x-hidden'>
      <header className=' sticky h-10 bg-blue-300 rounded-b-md -mb-1 z-10 text-l'>
        <h1 className=' text-left pl-3 pt-1 text-2xl'>MD2PDF</h1>
        {/* <div className=' bg-red-600 z-30 absolute h-2' style={{ width: editorAreaW }}></div> */}
      </header>

      <UpperToolbar editorAndSetWidth={editorAndSetAreaW} editorWidth={editorAreaW} expandLevel={expandLevel} displayId={displayId} setDisplayId={setDisplayId}></UpperToolbar>
      <main className={`flex h-full flex-grow relative ${isResizing ? " pointer-events-none-j " : ""}`}>
        <EditorArea expandLevel={expandLevel} width={editorAreaW}></EditorArea>
        {expandLevel > 0 &&
          <div onTouchStart={(e) => handleTouchStart(e, 0)} onMouseDown={(e) => onMouseDown(e, 0)} className=' cursor-col-resize w-2 bg-stone-300 hover:bg-slate-50 resize-col flex-grow-0 flex-shrink-0'></div>
        }
        <SetArea displayId={displayId} expandLevel={expandLevel} width={expandLevel > 1 ? editorAndSetAreaW - editorAreaW : editorAreaW}></SetArea>
        {expandLevel > 1 &&
          <div onTouchStart={(e) => handleTouchStart(e, 1)} onMouseDown={(e) => onMouseDown(e, 1)} className=' cursor-col-resize w-2 bg-stone-300 hover:bg-slate-50 resize-col flex-grow-0 flex-shrink-0'></div>
        }
        <PreviewArea expandLevel={expandLevel} displayId={displayId}></PreviewArea>
      </main>
    </div>
  )
}

export default App
