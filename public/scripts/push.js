'use strict';

// eslint-disable-next-line max-len
const applicationServerPublicKey = 'BBeIm7PLOA3CbCc50zWZTUXuPDuUWZwCOV71rQZBvRQzsOgkvQ9vuVa9UIyO1C3VENblyzY4keNOjh0HHmxrziQ';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// servicerWorker pushManager
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('serviceWorker and PushManager is supported');

  navigator.serviceWorker.register('service-worker.js')
      .then((reg) => {
        console.log('serviceWorker is registered', reg);
        swRegistration = reg;
        initialliseUI();
      }).catch((err) => {
        console.error('serviceWorker is error', err);
      });
} else {
  console.warn('push message is not supported');
  pushButton.textContent = 'push not supported';
}

// 检查当前用户有没有订阅
function initialliseUI() {
  pushButton.addEventListener('click', () => {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: unsubscribe user
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });
  // Set the initial subScription value
  // getSubscription() 方法可以在存在订阅时返回可使用当前订阅解析的 promise 否则，返回 null
  swRegistration.pushManager.getSubscription()
      .then((subscription) => {
        isSubscribed = !(subscription === null);
        if (isSubscribed) {
          console.log('User is subscipted');
        } else {
          console.log('User is NOT subscribed.');
        }
        updateBtn();
      });
}
// 更新按钮状态
function updateBtn() {
  // 阻止权限
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'push messaging bolcked';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }
  // 订阅相关
  if (isSubscribed) {
    pushButton.textContent = 'disable push messaging';
  } else {
    pushButton.textContent = 'enable push messaging';
  }

  pushButton.disabled = false;
}
/**
 * @param userVisibleOnly 参数基本上就表示承认您会在发送推送时显示通知
 */
// 订阅操作
function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  }).then((subscription) => {
    console.log('User is subscribed:', subscription);
    updateSubscriptionOnServer(subscription);
    isSubscribed = true;
    updateBtn();
  }).catch((err) => {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

// 取消订阅
function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
      .then((subscription) => {
        if (subscription) {
          return subscription.unsubscribe();
        }
      }).catch((err) => {
        console.log('Errot unsubscribing');
      }).then(() => {
        updateSubscriptionOnServer(null);

        console.log('User is unsubscribed.');
        isSubscribed = false;
        updateBtn();
      });
}

// 将订阅发送到后端
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  // eslint-disable-next-line max-len
  const subscriptionDetails = document.querySelector('.js-subscription-details');
  if (subscriptionJson) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}


