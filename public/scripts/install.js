/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

let deferredInstallPrompt = null;
const installButton = document.getElementById('butInstall');
installButton.addEventListener('click', installPWA);

// CODELAB: Add event listener for beforeinstallprompt event
// 监听beforeinstallprompt事件
window.addEventListener('beforeinstallprompt',saveBeforeInstallPromptEvent)


/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 *
 * @param {Event} evt
 */
// 我们将保存对 beforeinstallprompt 事件的引用，以便我们稍后可以调用它的 prompt() ，并修改我们的 UI 以显示安装按钮。
function saveBeforeInstallPromptEvent(evt) {
  // CODELAB: Add code to save event & show the install button.
  deferredInstallPrompt = evt;
  installButton.removeAttribute('hidden');
}


/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
// 我们需要调用保存的 beforeinstallprompt 事件的 .prompt() 函数。我们还需要隐藏安装按钮，因为 .prompt() 只能在每个保存的事件上调用一次。
function installPWA(evt) {
  // CODELAB: Add code show install prompt & hide the install button.
  deferredInstallPrompt.prompt();
  // 隐藏安装 button 因为 每个保存的事件上调用一次prompt
  evt.srcElement.setAttribute('hidden', true);
  // CODELAB: Log user response to prompt.
  // 在显示出提示并且用户已对其作出响应后，Promise 将返回一个具有 outcome 属性的对象。
  deferredInstallPrompt.userChoice.then(choice => {
    if(choice.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt', choice);
    } else {
      console.log('User dismissed the A2HS prompt', choice);
    }
    deferredInstallPrompt = null
  })

}

// CODELAB: Add event listener for appinstalled event
// 跟踪其他的安装事件
window.addEventListener('appinstalled', logAppInstalled)

/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
function logAppInstalled(evt) {
  // CODELAB: Add code to log the event
  console.log('app 已被安装', evt);
}
