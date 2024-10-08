import { BinLayout } from '../domain/binLayout'

const layouts:  { [layoutId: string]: BinLayout } = {}
const notifyListeners: ((layout: BinLayout) => void)[] = [];

export function applyLayout(layout: BinLayout) {
    layouts[layout.id] = layout;
    notifyListeners.forEach(listener => listener(layout));
}

export function subscribeToUpdates(listener: (layout: BinLayout) => void) {
    notifyListeners.push(listener);
}