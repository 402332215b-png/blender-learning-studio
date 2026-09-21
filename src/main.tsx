import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { useAuthStore, useProgressStore } from './stores'
import { applyToDom, readHue, readLight, readSkin } from './lib/theme'
import './styles/globals.css'

// 0) 套用配色偏好（色相级 + 明暗档）。
//    index.html 里的内联脚本已经在首帧前写好了整套 CSS 变量，这里再写一次是
//    **兜底**：万一内联脚本被 CSP 拦掉（或将来被构建工具挪走），
//    React 这边仍然能补上，不至于整套配色失效。重复写是幂等的。
applyToDom(readHue(), readLight(), readSkin())

// 1) 先把本机已存的学习数据读进来（离线也要能立刻看到自己的进度）
useProgressStore.getState().loadFromStorage()

// 2) 再恢复登录态，并把「自动同步」挂上：
//    登录后 → 先拉一次云端；之后本机数据一变就自动推上去（防抖合并）
void useAuthStore.getState().initSync()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
