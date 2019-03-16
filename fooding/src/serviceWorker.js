export function register() {
  //Check browser compatibility and runtime environment Check
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }
    window.addEventListener("load", () => {
      //URL for Service Worker
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      registerValidSW(swUrl);
    });
  }
}

//----------------- Register SW -------------------//
function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(
      registration => {
        console.log(
          "Service Worker registration successful",
          registration.scope
        );
        //Call push notification
        subscribePush();
      },
      err => {
        console.log("Service Worker registration failed", err);
      }
    )
    .catch(error => {
      console.error("Error during service worker registration:", error);
    });
}

//----------------------- PUSH Subscription ---------------------//
function subscribePush() {
  navigator.serviceWorker.ready.then(registration => {
    if (!registration.pushManager) {
      alert("Push Unsupported in this browser");
      return;
    }
    registration.pushManager
      .subscribe({
        userVisibleOnly: true, //Always display notifications
        applicationServerKey: convertedVapidKey
      })
      .then(subscription => {
        fetch("/push/register", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: {
            "Content-Type": "application/json"
          }
        });
      })
      .catch(err => console.error("Push subscription error: ", err));
  });
}

//---------------- Convert URL Safe base64 string to a Uint8Array ---------------//
const vapidPublicKey =
  "BGeF7ScOGJHjwP5Cgy_M_pe9xRyuDrqUUQtFlUi24QZl-7d8KGXZFAvM7fBQUY00HFCoLBsZ0enq4QLUO6BD1WI";
const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

//----------------------- PUSH Un-Subscribe ---------------------//
/**
 * To Unsubscribe push notification, hook
 * unsubscribePush() to onClick button or anything.
 */
export function unsubscribePush() {
  navigator.serviceWorker.ready.then(registration => {
    //Find the registered push subscription in the service worker
    registration.pushManager
      .getSubscription()
      .then(subscription => {
        if (!subscription) {
          //If there isn't a subscription, then there's nothing to do
          return;
        }
        subscription
          .unsubscribe()
          .then(() =>
            fetch("/push/unregister", {
              method: "POST",
              body: JSON.stringify(subscription),
              headers: {
                "Content-Type": "application/json"
              }
            })
          )
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  });
}

//--------------------- To UN-Register SW -------------------//
export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
