import { BinLayout } from "../domain/binLayout";

export type ClientToServiceEvents = {
}

export type ServiceToClientEvents = {
    layoutUpdated: (layout: BinLayout) => void
}