import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BinViewClient, getClient } from "../clients/binView";
import { Option, map, mapAsSome, matchNone, matchSome, none, some, someNotNullish, valueOr } from "hmi/src/utility/optional";
import { pipe } from "hmi/src/utility/pipe";
import { BinLayoutViewer } from "../components/binLayoutViewer";

export function BinLayout() {
    const p = useParams();
    const binLayoutId = pipe(
        someNotNullish(p.id),
        matchNone(() => some('55420215-355d-478d-abe0-7d5c61e81a4e')))

    const [client, setClient] = useState<Option<BinViewClient>>(none());
        

  useEffect(() => {
    let connectionState: 1 | 2 | 3 = 1; // 1 = connected, 2 = disconnecting, 3 = disconnected
    matchSome<string>((binLayoutId) => {
        getClient(binLayoutId).then(client => {
            if (connectionState === 1) {
              console.log(`client (${client.id}) connected`)
              setClient(some(client));
              
          } else if (connectionState === 2) {
              console.log(`disconnecting client (${client.id})`)
              client.disconnect();        
              connectionState = 3;
          }
        });
    })(binLayoutId);
    
    return () => {
      connectionState = 2;
    }
  }, [p.id]);
  
    return (<>
    <h1>bin Layout</h1>
        {pipe(
            client,
            mapAsSome(client => (<BinLayoutViewer source={client.updates} />)),
            valueOr(<div>loading...</div>)
        )}
    </>)
}