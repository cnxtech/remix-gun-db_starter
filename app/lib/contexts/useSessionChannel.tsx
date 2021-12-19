import { useEffect, useRef } from 'react';


// sync session across tabs using a broadcast channel
export default function useSessionChannel() {
  // @ts-ignore
  const { getUser } = useGunContext();
  const channelRef = useRef();

  useEffect(() => {
    const channel = new BroadcastChannel('session_channel');

    // let other tabs know we're here, in case one is logged in
    channel.postMessage({
      eventName: 'I_NEED_CREDS',
    });

    // check if other tabs are logged in
    channel.onmessage = (e) => {
      if (e.isTrusted) {
        const { eventName, value } = e.data;

        if (eventName === 'I_NEED_CREDS') {
          // send to tab
          channel.postMessage({
            eventName: 'I_HAVE_CREDS',
            value: window.sessionStorage.getItem('pair'),
          });
        }

        if (eventName === 'I_HAVE_CREDS') {
          const storedPair = window.sessionStorage.getItem('pair');

          if (value && !storedPair) {
            getUser().auth(JSON.parse(value));
          }
        }
      }
    };

  // @ts-ignore
    channelRef.current = channel;

    return () => {
      channel.close();
    };
  }, [getUser]);

  return {
    onMessage: (cb: (arg0: any) => void) => {
  // @ts-ignore
      const onmessage = channelRef.current.onmessage;

  // @ts-ignore
      channelRef.current.onmessage = (e: any) => {
        onmessage(e);
        cb(e);
      };
    },
  // @ts-ignore
    postMessage: (msg: any) => channelRef.current.postMessage(msg),
  };
}
