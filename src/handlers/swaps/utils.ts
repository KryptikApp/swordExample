import { Network, NetworkFamily } from "hdseedloop";
import { networkFromNetworkDb } from "../../helpers/utils/networkUtils";
import { NetworkDb } from "../../services/models/network";
import { TokenAndNetwork } from "../../services/models/token";

export function isSwapAvailable(buyTokenNetworkDb:NetworkDb, sellTokenNetworkDb:NetworkDb):boolean{
    const buyTokenNetwork:Network = networkFromNetworkDb(buyTokenNetworkDb);
    const sellTokenNetwork:Network = networkFromNetworkDb(sellTokenNetworkDb);
    // TODO: UPDATE TO SUPPORT NONEVM + CROSSCHAIN SWAPS
    if(buyTokenNetwork.networkFamily == NetworkFamily.EVM && sellTokenNetwork.networkFamily == NetworkFamily.EVM && buyTokenNetwork.fullName.toLowerCase() == sellTokenNetwork.fullName.toLowerCase())
    {
        return true;
    }
    return false;
}

// validator class for swaps
export class SwapValidator{
    fromTokenAndNetwork:TokenAndNetwork
    constructor(fromTokenANdNetwork:TokenAndNetwork) {
        this.fromTokenAndNetwork = fromTokenANdNetwork
    }
    isValidSwapPair(toToken:TokenAndNetwork){
        return isSwapAvailable(this.fromTokenAndNetwork.baseNetworkDb, toToken.baseNetworkDb);
    }
}