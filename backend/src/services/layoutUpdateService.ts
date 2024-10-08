import { BinLayout } from '../domain/binLayout'
import { none, Option, some } from 'hmi/src/utility/optional';

const layouts:  { [layoutId: string]: BinLayout } = {}
const notifyListeners: ((layout: BinLayout) => void)[] = [];

export function applyLayout(layout: BinLayout) {
    layouts[layout.id] = layout;
    notifyListeners.forEach(listener => listener(layout));
}

export function getLayout(layoutId: string): Option<BinLayout> {
    return layoutId in layouts
        ? some(layouts[layoutId])
        : none();
}

export function subscribeToUpdates(listener: (layout: BinLayout) => void) {
    notifyListeners.push(listener);
}