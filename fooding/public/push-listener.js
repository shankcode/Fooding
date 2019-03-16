//---------------- PUSH Event Listener ---------------//
self.addEventListener("push", event => {
  const data = event.data.json();
  const body = {
    body: data.body,
    icon: data.icon,
    badge: data.icon,
    // sound:
    //   "https://notificationsounds.com/message-tones/to-the-point-568/download/mp3",
    requireInteraction: data.requireInteraction
  };
  event.waitUntil(self.registration.showNotification(data.title, body));
});
